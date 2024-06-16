package com.kydas.metro.distribution;

import com.kydas.metro.core.filter.GetListByFilterDTO;
import com.kydas.metro.employee.AssignedEmployee;
import com.kydas.metro.employee.Employee;
import com.kydas.metro.employee.EmployeeRepository;
import com.kydas.metro.request.Request;
import com.kydas.metro.request.RequestFilterDTO;
import com.kydas.metro.request.RequestRepository;
import com.kydas.metro.request.RequestService;
import com.kydas.metro.routes.RouteService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DistributionService {
    @Autowired
    private RequestService requestService;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private RouteService routeService;

    private static final double PROXIMITY_WEIGHT = 1;
    private static final double LOAD_WEIGHT = 2;
    private static final double FIT_WEIGHT = 5;
    private static final double PERSONAL_INFO_WEIGHT = 10;

    private Map<Long, Long> employeeBusyTimes;
    private Map<Long, List<Request>> employeeAssignedRequests;
    private List<Employee> allEmployees;
    private Map<Long, Map<DayOfWeek, WorkingHours>> employeeWorkingHours;

    // Плановое распределение заявок
    @Transactional
    public void plannedDistribution(String tripDate) {
        employeeBusyTimes = new HashMap<>();
        employeeAssignedRequests = new HashMap<>();

        // 1.1. Загрузка всех сотрудников и их рабочего времени
        loadAllEmployees();

        // 1.2. Получаем список всех заявок на указанный день, находящихся в листе ожидания
        var waitingListRequests = requestService.getListByFilter(new GetListByFilterDTO<RequestFilterDTO>()
            .setLimit(10000)
            .setOffset(0)
            .setFilter(new RequestFilterDTO()
                .setTripDate(tripDate)
                .setStatus(Request.Status.WAITING_LIST)
            )
        );

        // 1.3. Получаем список всех подтверждённых заявок на указанный день
        var todayRequests = requestService.getListByFilter(new GetListByFilterDTO<RequestFilterDTO>()
            .setLimit(10000)
            .setOffset(0)
            .setFilter(new RequestFilterDTO()
                .setTripDate(tripDate)
                .setStatus(Request.Status.CONFIRMED)
            )
        );
        var requests = Stream.concat(waitingListRequests.stream(), todayRequests.stream()).collect(Collectors.toList());
        requests.sort(Comparator.comparing(Request::getNumber));

        // 1.4. Сброс всех назначенных инспекторов
        requests.forEach(r -> r.setAssignedEmployees(null));
        requestRepository.saveAll(requests);

        // 2. Сортируем полученный список по дате поездки (по возрастанию)
        requests.sort(Comparator.comparing(r -> r.getInfo().getTripDate()));

        // 3. Проходим по каждой заявке из полученного списка
        for (var request : requests) {
            // 3.1. Находим список всех сотрудников, на которых может быть назначена данная заявка
            var employees = getAvailableEmployees(request);

            // 3.2. Ранжирование списка
            employees = rankAndSortEmployees(
                employees,
                request,
                LocalDate.parse(tripDate, DateTimeFormatter.ofPattern("dd.MM.yyyy")).getDayOfWeek()
            );

            // 3.3. Выбирается требуемое количество мужчин и женщин для рассматриваемой заявки.
            var requiredEmployees = selectRequiredEmployees(
                employees, request.getInspectorMaleCount(), request.getInspectorFemaleCount()
            );

            // 3.4. Назначение выбранных сотрудников на заявку
            request.setAssignedEmployees(
                requiredEmployees.stream().map(
                    e -> {
                        updateEmployeeBusyTime(e, request);
                        addAssignedRequest(e, request);
                        return new AssignedEmployee().setEmployeeId(e.getId());
                    }
                ).collect(Collectors.toList())
            );

            // 3.5. Первый в списке инспектор становится ответственным
            request.getAssignedEmployees().stream().findFirst().map(e -> e.setResponsible(true));

            // 3.6. Заявки, для которых не удалось назначить требуемое кол-во инспекторов попадают в лист ожидания
            if (request.getAssignedEmployees().size() < getRequiredCount(request)) {
                request.setStatus(Request.Status.WAITING_LIST);
            } else {
                request.setStatus(Request.Status.CONFIRMED);
            }
        }

        // 4. Сохранение заявок с назначенными сотрудниками
        requestRepository.saveAll(requests);
    }

    // Адаптивное распределение заявок
    @Transactional
    public void adaptiveDistribution() {
        ZoneId moscowZoneId = ZoneId.of("Europe/Moscow");
        ZonedDateTime moscowTime = ZonedDateTime.now(moscowZoneId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String tripDate = moscowTime.format(formatter);

        employeeBusyTimes = new HashMap<>();
        employeeAssignedRequests = new HashMap<>();

        // 1.1. Загрузка всех сотрудников и их рабочего времени
        loadAllEmployees();

        // 1.2. Загрузка уже назначенных заявок
        initializeExistingAssignments(tripDate);

        // 1.3. Получаем список всех заявок на указанный день, находящихся в листе ожидания
        var waitingListRequests = requestService.getListByFilter(new GetListByFilterDTO<RequestFilterDTO>()
            .setLimit(10000)
            .setOffset(0)
            .setFilter(new RequestFilterDTO()
                .setTripDate(tripDate)
                .setStatus(Request.Status.WAITING_LIST)
            )
        );

        // 1.4. Получаем список всех подтверждённых заявок на указанный день, поданных менее чем за сутки
        var todayRequests = requestService.getListByFilter(new GetListByFilterDTO<RequestFilterDTO>()
            .setLimit(10000)
            .setOffset(0)
            .setFilter(new RequestFilterDTO()
                .setDate(tripDate)
                .setTripDate(tripDate)
                .setStatus(Request.Status.CONFIRMED)
            )
        );

        // 1.5. Оставляем заявки, для которых не назначены инспекторы
        todayRequests = todayRequests.stream().filter(
            r -> r.getAssignedEmployees().size() < getRequiredCount(r)
        ).collect(Collectors.toList());

        var requests = Stream.concat(waitingListRequests.stream(), todayRequests.stream()).collect(Collectors.toList());

        // 1.6. Сброс всех назначенных инспекторов
        requests.forEach(r -> r.setAssignedEmployees(null));
        requestRepository.saveAll(requests);

        // 2. Сортируем полученный список по дате создания (сначала рассматриваем заявки, которые поданы заранее)
        requests.sort(Comparator.comparing(Request::getCreateDate));

        // 3. Проходим по каждой заявке из полученного списка
        for (var request : requests) {
            // 3.1. Находим список всех сотрудников, на которых может быть назначена данная заявка
            var employees = getAvailableEmployees(request);

            // 3.2. Ранжирование списка
            employees = rankAndSortEmployees(
                employees,
                request,
                LocalDate.parse(tripDate, DateTimeFormatter.ofPattern("dd.MM.yyyy")).getDayOfWeek()
            );

            // 3.3. Выбирается требуемое количество мужчин и женщин для рассматриваемой заявки.
            var requiredEmployees = selectRequiredEmployees(
                employees, request.getInspectorMaleCount(), request.getInspectorFemaleCount()
            );

            // 3.4. Назначение выбранных сотрудников на заявку
            request.setAssignedEmployees(
                requiredEmployees.stream().map(
                    e -> {
                        updateEmployeeBusyTime(e, request);
                        addAssignedRequest(e, request);
                        return new AssignedEmployee().setEmployeeId(e.getId());
                    }
                ).collect(Collectors.toList())
            );

            // 3.5. Первый в списке инспектор становится ответственным
            request.getAssignedEmployees().stream().findFirst().map(e -> e.setResponsible(true));

            // 3.6. Заявки, для которых не удалось назначить требуемое кол-во инспекторов попадают в лист ожидания
            if (request.getAssignedEmployees().size() < getRequiredCount(request)) {
                request.setStatus(Request.Status.WAITING_LIST);
            } else {
                request.setStatus(Request.Status.CONFIRMED);
            }
        }

        // 4. Сохранение заявок с назначенными сотрудниками
        requestRepository.saveAll(requests);
    }

    // Загрузка данных о сотрудниках и их рабочем времени
    private void loadAllEmployees() {
        allEmployees = employeeRepository.findAll();
        employeeWorkingHours = new HashMap<>();

        for (Employee employee : allEmployees) {
            Map<DayOfWeek, WorkingHours> workingHoursMap = new HashMap<>();
            workingHoursMap.put(DayOfWeek.MONDAY, new WorkingHours(
                employee.getTimeWorkStart1(), employee.getTimeWorkEnd1(), employee.getTimeLunch1())
            );
            workingHoursMap.put(DayOfWeek.TUESDAY, new WorkingHours(
                employee.getTimeWorkStart2(), employee.getTimeWorkEnd2(), employee.getTimeLunch2())
            );
            workingHoursMap.put(DayOfWeek.WEDNESDAY, new WorkingHours(
                employee.getTimeWorkStart3(), employee.getTimeWorkEnd3(), employee.getTimeLunch3())
            );
            workingHoursMap.put(DayOfWeek.THURSDAY, new WorkingHours(
                employee.getTimeWorkStart4(), employee.getTimeWorkEnd4(), employee.getTimeLunch4())
            );
            workingHoursMap.put(DayOfWeek.FRIDAY, new WorkingHours(
                employee.getTimeWorkStart5(), employee.getTimeWorkEnd5(), employee.getTimeLunch5())
            );
            workingHoursMap.put(DayOfWeek.SATURDAY, new WorkingHours(
                employee.getTimeWorkStart6(), employee.getTimeWorkEnd6(), employee.getTimeLunch6())
            );
            workingHoursMap.put(DayOfWeek.SUNDAY, new WorkingHours(
                employee.getTimeWorkStart7(), employee.getTimeWorkEnd7(), employee.getTimeLunch7())
            );
            employeeWorkingHours.put(employee.getId(), workingHoursMap);
        }
    }

    // Получение списка сотрудников, которые могут выполнять заявку
    public List<Employee> getAvailableEmployees(Request request) {
        ZoneId zoneId = ZoneId.of("Europe/Moscow");
        LocalDateTime tripStart = LocalDateTime.ofInstant(request.getInfo().getTripDate(), zoneId);
        LocalDateTime tripEnd = LocalDateTime.ofInstant(request.getInfo().getTripDateEnd(), zoneId);
        DayOfWeek tripDay = tripStart.getDayOfWeek();

        return allEmployees.stream()
            .filter(employee -> isEmployeeAvailable(employee, tripDay, tripStart, tripEnd, request))
            .collect(Collectors.toList());
    }

    // Проверка того, может ли сотрудник выполнить заявку
    private boolean isEmployeeAvailable(
        Employee employee, DayOfWeek tripDay, LocalDateTime tripStart, LocalDateTime tripEnd, Request request
    ) {
        if (!isEmployeeWorking(employee, tripDay, tripStart, tripEnd)) {
            return false;
        }

        if (hasConflictingRequests(employee, tripStart, tripEnd)) {
            return false;
        }

        // Успевает ли сотрудник добраться до станции начала сопровождения
        List<Request> assignedRequests = employeeAssignedRequests.get(employee.getId());
        if (assignedRequests != null && !assignedRequests.isEmpty()) {
            var lastRequest = assignedRequests.get(assignedRequests.size() - 1);
            var time = Math.round(routeService.getTimeBetweenStations(
                lastRequest.getInfo().getDepartureStationId(),
                request.getInfo().getArrivalStationId(),
                0
            ));
            ZoneId zoneId = ZoneId.of("Europe/Moscow");
            LocalDateTime lastRequestTripEnd = LocalDateTime.ofInstant(
                lastRequest.getInfo().getTripDateEnd(), zoneId
            );
            return !lastRequestTripEnd.plusMinutes(time + 10).isAfter(
                tripStart
            );
        }

        return true;
    }

    // Работает ли сотрудник в указанное время
    private boolean isEmployeeWorking(Employee employee, DayOfWeek tripDay, LocalDateTime tripStart, LocalDateTime tripEnd) {
        WorkingHours workingHours = employeeWorkingHours.get(employee.getId()).get(tripDay);
        LocalTime workStart = LocalTime.parse(workingHours.start());
        LocalTime workEnd = LocalTime.parse(workingHours.end());

        LocalTime tripStartTime = tripStart.toLocalTime();
        LocalTime tripEndTime = tripEnd.toLocalTime();

        LocalTime lunchStart = LocalTime.parse(workingHours.lunch().split("-")[0]);
        LocalTime lunchEnd = LocalTime.parse(workingHours.lunch().split("-")[1]);

        DayOfWeek previousDay = tripDay.minus(1);
        WorkingHours previousDayWorkingHours = employeeWorkingHours.get(employee.getId()).get(previousDay);
        LocalTime previousDayWorkStart = LocalTime.parse(previousDayWorkingHours.start());
        LocalTime previousDayWorkEnd = LocalTime.parse(previousDayWorkingHours.end());

        boolean currentDayShiftSpillsOver = workEnd.isBefore(workStart);
        boolean previousDayShiftSpillsOver = previousDayWorkEnd.isBefore(previousDayWorkStart);

        boolean isDuringLunch = (tripStartTime.isBefore(lunchEnd) && tripEndTime.isAfter(lunchStart));

        boolean isDuringWorkingHours = (!tripStartTime.isBefore(workStart) && !tripEndTime.isAfter(workEnd))
            || (currentDayShiftSpillsOver && (tripStartTime.isAfter(workStart) || tripEndTime.isBefore(workEnd)));

        boolean isDuringPreviousDayWorkingHours = previousDayShiftSpillsOver && (tripStartTime.isBefore(previousDayWorkEnd));

        return (isDuringWorkingHours || isDuringPreviousDayWorkingHours) && !isDuringLunch;
    }

    // Имеет ли сотрудник другие заявки, попадающие на указанный период
    private boolean hasConflictingRequests(Employee employee, LocalDateTime tripStart, LocalDateTime tripEnd) {
        List<Request> assignedRequests = employeeAssignedRequests.get(employee.getId());
        if (assignedRequests == null) {
            return false;
        }
        ZoneId zoneId = ZoneId.of("Europe/Moscow");
        for (Request assignedRequest : assignedRequests) {
            LocalDateTime assignedStart = LocalDateTime.ofInstant(
                assignedRequest.getInfo().getTripDate(), zoneId);
            LocalDateTime assignedEnd = LocalDateTime.ofInstant(
                assignedRequest.getInfo().getTripDateEnd(), zoneId
            );

            if (assignedStart.isBefore(tripEnd) && assignedEnd.isAfter(tripStart)) {
                return true;
            }
        }

        return false;
    }

    // Метрика близости сотрудника
    public double calculateProximityMetric(Employee employee, Request request) {
        List<Request> assignedRequests = employeeAssignedRequests.get(employee.getId());
        if (assignedRequests != null && !assignedRequests.isEmpty()) {
            var lastRequest = assignedRequests.get(assignedRequests.size() - 1);
            var time = routeService.getTimeBetweenStations(
                lastRequest.getInfo().getDepartureStationId(),
                request.getInfo().getArrivalStationId(),
                0
            );
            return Math.min(1, 10 / time);
        }
        return 1;
    }

    // Метрика загруженности сотрудника
    private double calculateLoadMetric(Employee employee, DayOfWeek tripDay) {
        long busyTime = employeeBusyTimes.getOrDefault(employee.getId(), 0L);
        long totalWorkingTime = calculateTotalWorkingTime(employee, tripDay);

        return (double) (totalWorkingTime - busyTime) / totalWorkingTime;
    }

    // Метрика, учитывающая параметры сотрудника
    public double calculateFitMetric(Employee employee, Request request) {
        double fitScore = 0.0;
        if (employee.getTags().contains("Язык жестов") && request.getInfo().getGroupId().equals(3)) {
            fitScore += 1.0;
        }
        if (employee.getTags().contains("Лёгкий труд") && request.getInfo().getMediumBaggage()) {
            fitScore += -10.0;
        }
        return fitScore;
    }

    // Метрика, учитывающая персональную информацию сотрудника
    public double calculatePersonalInfoMetric(Employee employee, Request request) {
        double score = 0.0;
        if (employee.getPosition().equals("ЦИ")) {
            score += 1.0;
        }
        return score;
    }

    // Ранжирование списка сотрудников
    public List<Employee> rankAndSortEmployees(List<Employee> employees, Request request, DayOfWeek tripDay) {
        Map<Employee, Double> employeeScores = new HashMap<>();

        for (Employee employee : employees) {
            double score = calculateProximityMetric(employee, request) * PROXIMITY_WEIGHT +
                calculateLoadMetric(employee, tripDay) * LOAD_WEIGHT +
                calculateFitMetric(employee, request) * FIT_WEIGHT +
                calculatePersonalInfoMetric(employee, request) * PERSONAL_INFO_WEIGHT;
            employeeScores.put(employee, score);
        }

        return employeeScores.entrySet().stream()
            .sorted(Map.Entry.<Employee, Double>comparingByValue().reversed())
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    // Расчёт длительности рабочего дня сотрудника
    private long calculateTotalWorkingTime(Employee employee, DayOfWeek dayOfWeek) {
        String workStartStr = getWorkStartTime(employee, dayOfWeek);
        String workEndStr = getWorkEndTime(employee, dayOfWeek);
        String lunchTimeStr = getLunchTime(employee, dayOfWeek);

        LocalTime workStart = LocalTime.parse(workStartStr);
        LocalTime workEnd = LocalTime.parse(workEndStr);
        LocalTime lunchStart = LocalTime.parse(lunchTimeStr.split("-")[0]);
        LocalTime lunchEnd = LocalTime.parse(lunchTimeStr.split("-")[1]);

        long totalWorkingMinutes = Duration.between(workStart, workEnd).toMinutes();
        long lunchDurationMinutes = Duration.between(lunchStart, lunchEnd).toMinutes();

        return totalWorkingMinutes - lunchDurationMinutes;
    }

    // Выбор требуемых сотрудников из списка
    private List<Employee> selectRequiredEmployees(List<Employee> rankedEmployees, Integer requiredMales, Integer requiredFemales) {
        List<Employee> selectedEmployees = new ArrayList<>();
        List<Employee> maleEmployees = rankedEmployees.stream()
            .filter(employee -> "male".equals(employee.getSex()))
            .collect(Collectors.toList());
        List<Employee> femaleEmployees = rankedEmployees.stream()
            .filter(employee -> "female".equals(employee.getSex()))
            .collect(Collectors.toList());

        if (requiredMales != null) {
            selectedEmployees.addAll(maleEmployees.stream().limit(requiredMales).collect(Collectors.toList()));
        }
        if (requiredFemales != null) {
            selectedEmployees.addAll(femaleEmployees.stream().limit(requiredFemales).collect(Collectors.toList()));
        }

        return selectedEmployees;
    }

    private int getRequiredCount(Request request) {
        var maleCount = request.getInspectorMaleCount();
        if (maleCount == null) {
            maleCount = 0;
        }
        var femaleCount = request.getInspectorFemaleCount();
        if (femaleCount == null) {
            femaleCount = 0;
        }
        return maleCount + femaleCount;
    }

    private void updateEmployeeBusyTime(Employee employee, Request request) {
        ZoneId zoneId = ZoneId.of("Europe/Moscow");
        LocalDateTime tripStart = LocalDateTime.ofInstant(request.getInfo().getTripDate(), zoneId);
        LocalDateTime tripEnd = LocalDateTime.ofInstant(request.getInfo().getTripDateEnd(), zoneId);
        long tripDuration = Duration.between(tripStart, tripEnd).toMinutes();

        employeeBusyTimes.put(employee.getId(),
            employeeBusyTimes.getOrDefault(employee.getId(), 0L) + tripDuration);
    }

    private void addAssignedRequest(Employee employee, Request request) {
        employeeAssignedRequests.computeIfAbsent(employee.getId(), k -> new ArrayList<>()).add(request);
    }

    // Инициализация текущих назначений
    private void initializeExistingAssignments(String tripDate) {
        var confirmedRequests = requestService.getListByFilter(new GetListByFilterDTO<RequestFilterDTO>()
            .setLimit(10000)
            .setOffset(0)
            .setFilter(new RequestFilterDTO()
                .setTripDate(tripDate)
                .setStatus(Request.Status.CONFIRMED)
            )
        );

        ZoneId zoneId = ZoneId.of("Europe/Moscow");

        for (var request : confirmedRequests) {
            var assignedEmployees = request.getAssignedEmployees();
            for (var assignedEmployee : assignedEmployees) {
                var employeeId = assignedEmployee.getEmployeeId();
                var employee = employeeRepository.findById(employeeId).orElse(null);

                if (employee != null) {
                    addAssignedRequest(employee, request);
                    updateEmployeeBusyTime(employee, request);
                }
            }
        }
    }

    private String getWorkStartTime(Employee employee, DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> employee.getTimeWorkStart1();
            case TUESDAY -> employee.getTimeWorkStart2();
            case WEDNESDAY -> employee.getTimeWorkStart3();
            case THURSDAY -> employee.getTimeWorkStart4();
            case FRIDAY -> employee.getTimeWorkStart5();
            case SATURDAY -> employee.getTimeWorkStart6();
            case SUNDAY -> employee.getTimeWorkStart7();
            default -> throw new IllegalArgumentException("Invalid day of week: " + dayOfWeek);
        };
    }

    private String getWorkEndTime(Employee employee, DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> employee.getTimeWorkEnd1();
            case TUESDAY -> employee.getTimeWorkEnd2();
            case WEDNESDAY -> employee.getTimeWorkEnd3();
            case THURSDAY -> employee.getTimeWorkEnd4();
            case FRIDAY -> employee.getTimeWorkEnd5();
            case SATURDAY -> employee.getTimeWorkEnd6();
            case SUNDAY -> employee.getTimeWorkEnd7();
            default -> throw new IllegalArgumentException("Invalid day of week: " + dayOfWeek);
        };
    }

    private String getLunchTime(Employee employee, DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> employee.getTimeLunch1();
            case TUESDAY -> employee.getTimeLunch2();
            case WEDNESDAY -> employee.getTimeLunch3();
            case THURSDAY -> employee.getTimeLunch4();
            case FRIDAY -> employee.getTimeLunch5();
            case SATURDAY -> employee.getTimeLunch6();
            case SUNDAY -> employee.getTimeLunch7();
            default -> throw new IllegalArgumentException("Invalid day of week: " + dayOfWeek);
        };
    }

    private record WorkingHours(String start, String end, String lunch) {
    }
}
