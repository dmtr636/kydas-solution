package com.kydas.metro.events;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Tag(name="Сервис взаимодействия по WebSocket")
public class EventsWebsocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public EventsWebsocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notify(EventWebsocketDTO eventDTO) {
        messagingTemplate.convertAndSend("/topic/events", eventDTO);
    }
}
