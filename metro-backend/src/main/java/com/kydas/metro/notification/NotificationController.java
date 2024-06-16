package com.kydas.metro.notification;

import com.kydas.metro.core.crud.BaseController;
import com.kydas.metro.core.exceptions.classes.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.NOTIFICATIONS_ENDPOINT;

@RestController
@RequestMapping(NOTIFICATIONS_ENDPOINT)
@Tag(name="Сервис уведомлений")
public class NotificationController extends BaseController<Notification, Long, NotificationDTO> {
    @Autowired
    NotificationService service;

    public NotificationController(NotificationService service, NotificationMapper mapper) {
        super(service, mapper);
    }

    @PostMapping("/readAll")
    @Operation(
        summary = "Прочитать все уведомления"
    )
    public String readAll() throws ApiException {
        service.readAll();
        return "Ok";
    }
}
