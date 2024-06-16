package com.kydas.metro.events;

import com.kydas.metro.core.crud.BaseMapper;
import com.kydas.metro.notification.Notification;
import com.kydas.metro.notification.NotificationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EventMapper extends BaseMapper<Event, EventDTO> {

}