package com.kydas.metro.stationsTransferTime;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface StationTransferTimeMapper extends BaseMapper<StationTransferTime, StationTransferTimeDTO> {

}