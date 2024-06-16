package com.kydas.metro.events;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class EventWebsocketDTO {
    private Type type;
    private String objectName;
    private Object data;

    public enum Type {CREATE, UPDATE, DELETE}
}
