package com.kydas.metro.request;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.employee.AssignedEmployee;
import com.kydas.metro.notification.Notification;
import com.kydas.metro.notification.NotificationDTO;
import com.kydas.metro.notification.NotificationService;
import com.kydas.metro.routes.RouteService;
import com.kydas.metro.stations.Station;
import com.kydas.metro.stations.StationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.kydas.metro.core.utils.TimeUtils.convertMinutesToHHMMSS;

@Service
public class RequestServiceInternal {
    public static final List<Integer> GROUPS_WITH_EXTRA_TRANSFER_TIME = List.of(4, 5, 6, 7, 11);
    public static final int EXTRA_TRANSFER_TIME = 5;

    @Autowired
    private RequestRepository repository;
    @Autowired
    private RequestMapper mapper;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private RouteService routeService;
    @Autowired
    private StationMapper stationMapper;

    public Request create(RequestDTO dto) throws ApiException {
        var request = new Request();
        mapper.update(request, dto);

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
            .setUserId(1L)
        );

        if (dto.getStatus() == Request.Status.CANCELED) {
            notificationService.create(new NotificationDTO()
                .setRequestId(savedRequest.getId())
                .setRequestNumber(savedRequest.getNumber())
                .setAction(Notification.Action.CANCEL_REQUEST)
                .setStatus(savedRequest.getStatus())
                .setUserId(1L)
            );
        }
        if (dto.getStatus() == Request.Status.COMPLETED) {
            notificationService.create(new NotificationDTO()
                .setRequestId(savedRequest.getId())
                .setRequestNumber(savedRequest.getNumber())
                .setAction(Notification.Action.COMPLETE_CONVOY)
                .setStatus(savedRequest.getStatus())
                .setUserId(1L)
            );
        }

        return savedRequest;
    }
}
