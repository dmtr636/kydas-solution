package com.kydas.metro.request;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.email.EmailService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import com.kydas.metro.core.filter.GetListByFilterDTO;
import com.kydas.metro.core.security.SecurityContext;
import com.kydas.metro.data.StationsDataLoader;
import com.kydas.metro.employee.AssignedEmployee;
import com.kydas.metro.events.EventWebsocketDTO;
import com.kydas.metro.events.EventsWebsocketController;
import com.kydas.metro.notification.Notification;
import com.kydas.metro.notification.NotificationDTO;
import com.kydas.metro.notification.NotificationService;
import com.kydas.metro.routes.RouteService;
import com.kydas.metro.stations.Station;
import com.kydas.metro.users.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.kydas.metro.core.utils.TimeUtils.convertMinutesToHHMMSS;

@Service
public class RequestService extends BaseService<Request, UUID, RequestDTO> {
    public static final List<Integer> GROUPS_WITH_EXTRA_TRANSFER_TIME = List.of(4, 5, 6, 7, 11);
    public static final int EXTRA_TRANSFER_TIME = 5;

    @Autowired
    private RequestRepository repository;
    @Autowired
    private RequestMapper mapper;
    @Autowired
    private EventsWebsocketController eventsWebsocketController;
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private SecurityContext securityContext;
    @Autowired
    private RouteService routeService;

    public RequestService(RequestRepository repository) {
        super(repository);
    }

    public void subscribe(RequestSubscribeDTO dto) throws ApiException {
        var request = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        request.getInfo().setEmail(dto.getEmail());
        var formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd / HH:mm");
        emailService.sendEmail(
            dto.getEmail(),
            "Информация о заявке на сопровождение М-" + request.getNumber(),
            """
                Ваша заявка успешно составлена!
                
                Номер: M-%s
                Получатель услуги: %s
                Дата и время оказания услуги: %s
                Станция отправления: %s
                Станция прибытия: %s
                """
                .formatted(
                    request.getNumber(),
                    request.getInfo().getFullName(),
                    LocalDateTime.ofInstant(
                        request.getInfo().getTripDate(),
                        ZoneId.of("Europe/Moscow")
                    ).format(formatter),
                    StationsDataLoader.getStations().stream().filter(
                        s -> s.getId() == request.getInfo().getDepartureStationId().longValue()
                    ),
                    StationsDataLoader.getStations().stream().filter(
                        s -> s.getId() == request.getInfo().getArrivalStationId().longValue()
                    )
                )
        );
        repository.save(request);
    }

    public Request create(RequestDTO dto) throws ApiException {
        var request = new Request();
        mapper.update(request, dto);
        request.setFromSite(!securityContext.isAuthenticated());

        var extraTransferTime = GROUPS_WITH_EXTRA_TRANSFER_TIME.contains(dto.getInfo().getGroupId())
            ? EXTRA_TRANSFER_TIME
            : 0;
        var route = routeService.findRoute(
            dto.getInfo().getDepartureStationId(), dto.getInfo().getArrivalStationId(), extraTransferTime
        );
        var tripDurationMinutes = routeService.getTripDuration(
            route, extraTransferTime
        );
        var tripDuration = convertMinutesToHHMMSS(tripDurationMinutes);
        ZonedDateTime dateTime = ZonedDateTime.parse(dto.getInfo().getTripDate(), DateTimeFormatter.ISO_ZONED_DATE_TIME);
        ZonedDateTime updatedDateTime = dateTime.plusMinutes(tripDurationMinutes);

        var shortRoute = routeService.getShortRoute(route);
        request.setRoute(shortRoute.stream().map(Station::getId).toList());
        request.setRouteTransferTime(routeService.getRouteTransferTime(route, extraTransferTime));
        request.setTripDuration(tripDuration);
        request.getInfo().setTripDateEnd(updatedDateTime.toInstant());

        var savedRequest = repository.save(request);
        notificationService.create(new NotificationDTO()
            .setRequestId(savedRequest.getId())
            .setRequestNumber(savedRequest.getNumber())
            .setAction(Notification.Action.CREATE_REQUEST)
            .setStatus(savedRequest.getStatus())
            .setUserId(securityContext.isAuthenticated() ? securityContext.getCurrentUser().getId() : null)
        );
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("request")
            .setData(mapper.toDTO(savedRequest))
        );
        return savedRequest;
    }

    @Transactional
    public Request update(RequestDTO dto) throws ApiException {
        var request = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        var oldStatus = request.getStatus();
        var newStatus = dto.getStatus();
        var oldLock = request.getLockedEdit();
        var newLock = dto.getLockedEdit();
        var oldCategory = request.getInfo().getGroupId();
        var oldTripStart = request.getInfo().getTripDate();
        var oldTripEnd = request.getInfo().getTripDateEnd();
        var oldStationStart = request.getInfo().getDepartureStationId();
        var oldStationEnd = request.getInfo().getArrivalStationId();
        mapper.update(request, dto);

        var user = securityContext.getCurrentUser();
        var action = Notification.Action.EDIT_REQUEST;
        if (user.getRole() == User.Role.EMPLOYEE) {
            if (dto.getConvoyStatus() == Request.ConvoyStatus.COMPLETE_CONVOY) {
                request.setStatus(Request.Status.COMPLETED);
                action = Notification.Action.COMPLETE_CONVOY;
            }
            if (dto.getConvoyStatus() == Request.ConvoyStatus.INSPECTOR_DISPATCHED) {
                action = Notification.Action.INSPECTOR_DISPATCHED;
            }
            if (dto.getConvoyStatus() == Request.ConvoyStatus.INSPECTOR_ON_SITE) {
                action = Notification.Action.INSPECTOR_ON_SITE;
            }
            if (dto.getConvoyStatus() == Request.ConvoyStatus.TRIP) {
                action = Notification.Action.TRIP;
            }
            if (dto.getConvoyStatus() == Request.ConvoyStatus.PASSENGER_LATE) {
                action = Notification.Action.PASSENGER_LATE;
            }
            if (dto.getConvoyStatus() == Request.ConvoyStatus.INSPECTOR_LATE) {
                action = Notification.Action.INSPECTOR_LATE;
            }
        } else {
            if (oldStatus != newStatus) {
                action = Notification.Action.CHANGE_STATUS;
            }
        }

        if (!oldTripStart.toString().equals(dto.getInfo().getTripDate()) ||
            !oldStationStart.equals(dto.getInfo().getDepartureStationId()) ||
            !oldStationEnd.equals(dto.getInfo().getArrivalStationId()) ||
            !oldCategory.equals(dto.getInfo().getGroupId())
        ) {
            var extraTransferTime = GROUPS_WITH_EXTRA_TRANSFER_TIME.contains(dto.getInfo().getGroupId())
                ? EXTRA_TRANSFER_TIME
                : 0;
            var route = routeService.findRoute(
                dto.getInfo().getDepartureStationId(), dto.getInfo().getArrivalStationId(), extraTransferTime
            );
            var tripDurationMinutes = routeService.getTripDuration(
                route, extraTransferTime
            );
            var tripDuration = convertMinutesToHHMMSS(tripDurationMinutes);
            ZonedDateTime dateTime = ZonedDateTime.parse(dto.getInfo().getTripDate(), DateTimeFormatter.ISO_ZONED_DATE_TIME);
            ZonedDateTime updatedDateTime = dateTime.plusMinutes(tripDurationMinutes);

            var shortRoute = routeService.getShortRoute(route);
            request.setRoute(shortRoute.stream().map(Station::getId).collect(Collectors.toList()));
            request.setRouteTransferTime(routeService.getRouteTransferTime(route, extraTransferTime));
            request.setTripDuration(tripDuration);
            request.getInfo().setTripDateEnd(updatedDateTime.toInstant());
        }

        var savedRequest = repository.save(request);
        if (oldLock == newLock) {
            notificationService.create(new NotificationDTO()
                .setRequestId(savedRequest.getId())
                .setRequestNumber(savedRequest.getNumber())
                .setAction(action)
                .setStatus(savedRequest.getStatus())
                .setConvoyStatus(savedRequest.getConvoyStatus())
                .setUserId(user.getId())
            );
        }
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("request")
            .setData(mapper.toDTO(savedRequest))
        );
        return savedRequest;
    }

    public Request confirm(RequestDTO dto) throws ApiException {
        var request = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(request, dto);
        request.setStatus(Request.Status.CONFIRMED);
        var savedRequest = repository.save(request);
        notificationService.create(new NotificationDTO()
            .setRequestId(savedRequest.getId())
            .setRequestNumber(savedRequest.getNumber())
            .setAction(Notification.Action.CONFIRM_REQUEST)
            .setStatus(savedRequest.getStatus())
            .setUserId(securityContext.getCurrentUser().getId())
        );
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("request")
            .setData(mapper.toDTO(savedRequest))
        );
        return savedRequest;
    }

    public Request cancelByPassenger(UUID id) throws ApiException {
        var request = repository.findById(id).orElseThrow(NotFoundException::new);
        request.setStatus(Request.Status.CANCELED);
        request.setCancelReason("Отменена пассажиром");
        var savedRequest = repository.save(request);
        notificationService.create(new NotificationDTO()
            .setRequestId(savedRequest.getId())
            .setRequestNumber(savedRequest.getNumber())
            .setAction(Notification.Action.CANCEL_REQUEST)
            .setStatus(savedRequest.getStatus())
        );
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("request")
            .setData(mapper.toDTO(savedRequest))
        );
        return savedRequest;
    }

    public Request cancel(RequestCancelDTO dto) throws ApiException {
        var request = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        request.setStatus(Request.Status.CANCELED);
        request.setCancelReason(dto.getReason());
        var savedRequest = repository.save(request);
        notificationService.create(new NotificationDTO()
            .setRequestId(savedRequest.getId())
            .setRequestNumber(savedRequest.getNumber())
            .setAction(Notification.Action.CANCEL_REQUEST)
            .setStatus(savedRequest.getStatus())
            .setUserId(securityContext.getCurrentUser().getId()));
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("request")
            .setData(mapper.toDTO(savedRequest))
        );
        return savedRequest;
    }

    public void delete(UUID id) throws ApiException {
        var request = repository.findById(id).orElseThrow(NotFoundException::new);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.DELETE)
            .setObjectName("request")
            .setData(mapper.toDTO(request))
        );
        notificationService.create(new NotificationDTO()
            .setRequestId(request.getId())
            .setRequestNumber(request.getNumber())
            .setAction(Notification.Action.DELETE_REQUEST)
            .setStatus(request.getStatus())
            .setUserId(securityContext.getCurrentUser().getId()));
        repository.deleteById(id);
    }

    @Transactional
    public List<Request> getListByFilter(GetListByFilterDTO<RequestFilterDTO> dto) {
        RequestFilterDTO filter = dto.getFilter();

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Request> query = cb.createQuery(Request.class);
        Root<Request> root = query.from(Request.class);

        List<Predicate> predicates = new ArrayList<>();

        if (filter.getTripDate() != null) {
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            LocalDate localDate = LocalDate.parse(filter.getTripDate(), inputFormatter);

            ZoneId moscowZoneId = ZoneId.of("Europe/Moscow");

            ZonedDateTime startOfDayMoscow = localDate.atStartOfDay(moscowZoneId);
            ZonedDateTime endOfDayMoscow = localDate.plusDays(1).atStartOfDay(moscowZoneId).minusNanos(1);

            ZonedDateTime startOfDayUtc = startOfDayMoscow.withZoneSameInstant(ZoneOffset.UTC);
            ZonedDateTime endOfDayUtc = endOfDayMoscow.withZoneSameInstant(ZoneOffset.UTC);

            predicates.add(cb.greaterThanOrEqualTo(root.get("info").get("tripDate"), startOfDayUtc.toInstant()));
            predicates.add(cb.lessThanOrEqualTo(root.get("info").get("tripDate"), endOfDayUtc.toInstant()));
        }

        if (filter.getDate() != null) {
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            LocalDate localDate = LocalDate.parse(filter.getDate(), inputFormatter);

            ZoneId moscowZoneId = ZoneId.of("Europe/Moscow");

            ZonedDateTime startOfDayMoscow = localDate.atStartOfDay(moscowZoneId);
            ZonedDateTime endOfDayMoscow = localDate.plusDays(1).atStartOfDay(moscowZoneId).minusNanos(1);

            ZonedDateTime startOfDayUtc = startOfDayMoscow.withZoneSameInstant(ZoneOffset.UTC);
            ZonedDateTime endOfDayUtc = endOfDayMoscow.withZoneSameInstant(ZoneOffset.UTC);

            predicates.add(cb.greaterThanOrEqualTo(root.get("createDate"), startOfDayUtc.toInstant()));
            predicates.add(cb.lessThanOrEqualTo(root.get("createDate"), endOfDayUtc.toInstant()));
        }

        if (filter.getEmployeeId() != null) {
            Join<Request, AssignedEmployee> assignedEmployeesJoin = root.join("assignedEmployees", JoinType.LEFT);
            Predicate employeeIdPredicate = cb.equal(assignedEmployeesJoin.get("employeeId"), filter.getEmployeeId());
            predicates.add(employeeIdPredicate);
        }

        if (filter.getStatus() != null) {
            predicates.add(
                cb.equal(root.get("status"), filter.getStatus())
            );
        }

        if (filter.getNumber() != null) {
            Expression<String> numberAsString = cb.concat("", root.get("number").as(String.class));
            predicates.add(
                cb.like(cb.lower(numberAsString), filter.getNumber().toString().toLowerCase() + "%")
            );
        }

        if (filter.getPassengerId() != null) {
            predicates.add(
                cb.equal(root.get("passengerId"), filter.getPassengerId())
            );
        }

        query.where(predicates.toArray(new Predicate[0]));

        return entityManager.createQuery(query)
            .setFirstResult(dto.getOffset())
            .setMaxResults(dto.getLimit())
            .getResultList();
    }
}
