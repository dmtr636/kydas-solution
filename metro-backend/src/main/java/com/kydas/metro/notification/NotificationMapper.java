package com.kydas.metro.notification;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface NotificationMapper extends BaseMapper<Notification, NotificationDTO> {

}