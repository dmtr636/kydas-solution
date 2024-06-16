package com.kydas.metro.notification;

import com.kydas.metro.request.Request;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.UUID;

@Data
@Accessors(chain = true)
public class NotificationDTO {
    private Long id;

    private UUID requestId;

    private Long requestNumber;

    private String createDate;

    private Notification.Action action;

    private Request.Status status;

    private Request.ConvoyStatus convoyStatus;

    private Long userId;

    private Boolean isRead;

    private String message;
}

