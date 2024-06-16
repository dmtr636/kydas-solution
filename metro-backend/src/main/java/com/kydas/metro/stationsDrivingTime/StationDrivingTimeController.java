package com.kydas.metro.stationsDrivingTime;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.STATIONS_DRIVING_TIME_ENDPOINT;
import static com.kydas.metro.core.web.Endpoints.STATIONS_ENDPOINT;

@RestController
@RequestMapping(STATIONS_DRIVING_TIME_ENDPOINT)
@Tag(name="Сервис станций")
public class StationDrivingTimeController extends BaseController<StationDrivingTime, Integer, StationDrivingTimeDTO> {
    public StationDrivingTimeController(StationDrivingTimeService service, StationDrivingTimeMapper mapper) {
        super(service, mapper);
    }
}
