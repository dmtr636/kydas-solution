package com.kydas.metro.request;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RequestMapper extends BaseMapper<Request, RequestDTO> {

}