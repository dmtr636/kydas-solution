package com.kydas.metro.passenger;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.PASSENGERS_ENDPOINT;

@RestController
@RequestMapping(PASSENGERS_ENDPOINT)
@Tag(name="Сервис пассажиров")
public class PassengerController extends BaseController<Passenger, Long, PassengerDTO> {
    public PassengerController(PassengerService service, PassengerMapper mapper) {
        super(service, mapper);
    }
}
