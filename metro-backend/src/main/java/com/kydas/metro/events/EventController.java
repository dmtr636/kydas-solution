package com.kydas.metro.events;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.EVENTS_ENDPOINT;

@RestController
@RequestMapping(EVENTS_ENDPOINT)
@Tag(name="Сервис событий")
public class EventController extends BaseController<Event, Long, EventDTO> {
    public EventController(EventService service, EventMapper mapper) {
        super(service, mapper);
    }
}
