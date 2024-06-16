package com.kydas.metro.passenger;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import com.kydas.metro.core.security.SecurityContext;
import com.kydas.metro.events.EventDTO;
import com.kydas.metro.events.EventService;
import com.kydas.metro.events.EventWebsocketDTO;
import com.kydas.metro.events.EventsWebsocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PassengerService extends BaseService<Passenger, Long, PassengerDTO> {
    @Autowired
    private PassengerRepository repository;
    @Autowired
    private PassengerMapper mapper;
    @Autowired
    private EventsWebsocketController eventsWebsocketController;
    @Autowired
    private EventService eventService;
    @Autowired
    private SecurityContext securityContext;

    public PassengerService(PassengerRepository repository) {
        super(repository);
    }

    public Passenger create(PassengerDTO dto) throws ApiException {
        var passenger = new Passenger();
        mapper.update(passenger, dto);
        var savedPassenger = repository.save(passenger);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("passenger")
            .setData(mapper.toDTO(savedPassenger))
        );
        eventService.create(new EventDTO()
            .setObjectId(savedPassenger.getId().toString())
            .setObjectName("passenger")
            .setAction("CREATE_PASSENGER")
            .setUserId(securityContext.getCurrentUser().getId())
        );
        return savedPassenger;
    }

    public Passenger createByRoot(PassengerDTO dto) {
        var passenger = new Passenger();
        mapper.update(passenger, dto);
        var savedPassenger = repository.save(passenger);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("passenger")
            .setData(mapper.toDTO(savedPassenger))
        );
        eventService.create(new EventDTO()
            .setObjectId(savedPassenger.getId().toString())
            .setObjectName("passenger")
            .setAction("CREATE_PASSENGER")
            .setUserId(1L)
        );
        return savedPassenger;
    }

    public Passenger update(PassengerDTO dto) throws ApiException {
        var passenger = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        var oldLock = passenger.getLockedEdit();
        var newLock = dto.getLockedEdit();
        mapper.update(passenger, dto);
        var savedPassenger = repository.save(passenger);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("passenger")
            .setData(mapper.toDTO(savedPassenger))
        );
        if (oldLock == newLock) {
            eventService.create(new EventDTO()
                .setObjectId(savedPassenger.getId().toString())
                .setObjectName("passenger")
                .setAction("UPDATE_PASSENGER")
                .setUserId(securityContext.getCurrentUser().getId())
            );
        }
        return savedPassenger;
    }

    public void delete(Long id) throws ApiException {
        var request = repository.findById(id).orElseThrow(NotFoundException::new);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.DELETE)
            .setObjectName("passenger")
            .setData(mapper.toDTO(request))
        );
        eventService.create(new EventDTO()
            .setObjectId(id.toString())
            .setObjectName("passenger")
            .setAction("DELETE_PASSENGER")
            .setUserId(securityContext.getCurrentUser().getId())
        );
        repository.deleteById(id);
    }
}
