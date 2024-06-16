package com.kydas.metro.stations;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.STATIONS_ENDPOINT;

@RestController
@RequestMapping(STATIONS_ENDPOINT)
@Tag(name="Сервис станций")
public class StationController extends BaseController<Station, Integer, StationDTO> {
    public StationController(StationService service, StationMapper mapper) {
        super(service, mapper);
    }
}
