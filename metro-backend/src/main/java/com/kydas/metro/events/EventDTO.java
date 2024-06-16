package com.kydas.metro.events;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class EventDTO {
    private Long id;

    private String objectId;

    private String objectName;

    private String createDate;

    private String action;

    private Long userId;
}

