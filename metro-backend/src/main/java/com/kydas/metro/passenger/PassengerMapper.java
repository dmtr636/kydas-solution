package com.kydas.metro.passenger;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PassengerMapper extends BaseMapper<Passenger, PassengerDTO> {

}