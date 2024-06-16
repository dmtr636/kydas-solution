package com.kydas.metro.stationsTransferTime;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.STATIONS_DRIVING_TIME_ENDPOINT;
import static com.kydas.metro.core.web.Endpoints.STATIONS_TRANSFER_TIME_ENDPOINT;

@RestController
@RequestMapping(STATIONS_TRANSFER_TIME_ENDPOINT)
@Tag(name="Сервис станций")
public class StationTransferTimeController extends BaseController<StationTransferTime, Integer, StationTransferTimeDTO> {
    public StationTransferTimeController(StationTransferTimeService service, StationTransferTimeMapper mapper) {
        super(service, mapper);
    }
}
