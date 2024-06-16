package com.kydas.metro.notification;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import com.kydas.metro.events.EventWebsocketDTO;
import com.kydas.metro.events.EventsWebsocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService extends BaseService<Notification, Long, NotificationDTO> {
    @Autowired
    private NotificationRepository repository;
    @Autowired
    private NotificationMapper mapper;
    @Autowired
    private EventsWebsocketController eventsWebsocketController;

    public NotificationService(NotificationRepository repository) {
        super(repository);
    }

    public Notification create(NotificationDTO dto) {
        var notification = new Notification();
        mapper.update(notification, dto);
        notification.setIsRead(false);
        var savedNotification = repository.save(notification);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("notification")
            .setData(mapper.toDTO(savedNotification))
        );
        return savedNotification;
    }

    public Notification update(NotificationDTO dto) throws ApiException {
        var notification = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(notification, dto);
        var savedNotification = repository.save(notification);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("notification")
            .setData(mapper.toDTO(savedNotification))
        );
        return savedNotification;
    }

    public void readAll() throws ApiException {
        List<Notification> unreadNotifications = repository.findByIsReadFalse();
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        repository.saveAll(unreadNotifications);
    }
}
