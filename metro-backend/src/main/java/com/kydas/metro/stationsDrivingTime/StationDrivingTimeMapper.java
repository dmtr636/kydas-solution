package com.kydas.metro.stationsDrivingTime;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface StationDrivingTimeMapper extends BaseMapper<StationDrivingTime, StationDrivingTimeDTO> {

}