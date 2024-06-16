package com.kydas.metro.data;

import com.kydas.metro.core.utils.JsonUtils;
import com.kydas.metro.stations.Station;
import com.kydas.metro.stations.StationDTO;
import com.kydas.metro.stations.StationService;
import com.kydas.metro.stationsDrivingTime.StationDrivingTime;
import com.kydas.metro.stationsDrivingTime.StationDrivingTimeDTO;
import com.kydas.metro.stationsDrivingTime.StationDrivingTimeService;
import com.kydas.metro.stationsTransferTime.StationTransferTime;
import com.kydas.metro.stationsTransferTime.StationTransferTimeDTO;
import com.kydas.metro.stationsTransferTime.StationTransferTimeService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class StationsDataLoader {
    private final StationService stationService;
    private final StationDrivingTimeService stationDrivingTimeService;
    private final StationTransferTimeService stationTransferTimeService;

    @Getter
    private static final List<Station> stations = new ArrayList<>();

    @Getter
    private static final List<StationDrivingTime> stationDrivingTimes = new ArrayList<>();

    @Getter
    private static final List<StationTransferTime> stationTransferTimes = new ArrayList<>();

    @Value("classpath:data/stations.json")
    private Resource stationsDataFile;

    @Value("classpath:data/stationsDrivingTime.json")
    private Resource stationsDrivingTimeDataFile;

    @Value("classpath:data/stationsTransferTime.json")
    private Resource stationsTransferTimeDataFile;

    public void createStations() throws IOException {
        var stationDTOS = JsonUtils.readJson(stationsDataFile, StationDTO[].class);
        for (StationDTO stationDTO : stationDTOS) {
            stations.add(stationService.create(stationDTO));
        }

        var stationDrivingTimeDTOS = JsonUtils.readJson(stationsDrivingTimeDataFile, StationDrivingTimeDTO[].class);
        for (StationDrivingTimeDTO dto : stationDrivingTimeDTOS) {
            stationDrivingTimes.add(stationDrivingTimeService.create(dto));
        }

        var stationTransferTimeDTOS = JsonUtils.readJson(stationsTransferTimeDataFile, StationTransferTimeDTO[].class);
        for (StationTransferTimeDTO dto : stationTransferTimeDTOS) {
            stationTransferTimes.add(stationTransferTimeService.create(dto));
        }
    }

    public void loadStation() {
        stations.addAll(stationService.getAll());
        stationDrivingTimes.addAll(stationDrivingTimeService.getAll());
        stationTransferTimes.addAll(stationTransferTimeService.getAll());
    }
}
