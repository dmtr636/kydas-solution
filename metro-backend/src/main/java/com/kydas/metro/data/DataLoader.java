package com.kydas.metro.data;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.distribution.DistributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataLoader implements ApplicationRunner {
    private final UserDataLoader userDataLoader;
    private final EmployeeDataLoader employeeDataLoader;
    private final StationsDataLoader stationsDataLoader;
    private final RequestDataLoader requestDataLoader;
    private final DistributionService distributionService;

    @Override
    public void run(ApplicationArguments args) throws IOException, ApiException, ParseException {
        if (!userDataLoader.isRootUserExists()) {
            userDataLoader.createUsers();
            employeeDataLoader.createEmployees();
            stationsDataLoader.createStations();
            requestDataLoader.createRequests();

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            LocalDate startDate = LocalDate.of(2024, 6, 10);
            LocalDate endDate = LocalDate.of(2024, 6, 30);

            IntStream.iterate(0, i -> i + 1)
                .limit(endDate.toEpochDay() - startDate.toEpochDay() + 1)
                .mapToObj(startDate::plusDays)
                .forEach(date -> distributionService.plannedDistribution(date.format(formatter)));
        } else {
            stationsDataLoader.loadStation();
        }
    }
}
