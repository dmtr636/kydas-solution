package com.kydas.metro.events;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService extends BaseService<Event, Long, EventDTO> {
    @Autowired
    private EventRepository repository;
    @Autowired
    private EventMapper mapper;
    @Autowired
    private EventsWebsocketController eventsWebsocketController;

    public EventService(EventRepository repository) {
        super(repository);
    }

    public Event create(EventDTO dto) {
        var event = new Event();
        mapper.update(event, dto);
        var savedEvent = repository.save(event);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("event")
            .setData(mapper.toDTO(savedEvent))
        );
        return savedEvent;
    }

    public Event update(EventDTO dto) throws ApiException {
        var event = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(event, dto);
        var savedEvent = repository.save(event);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("event")
            .setData(mapper.toDTO(savedEvent))
        );
        return savedEvent;
    }
}
