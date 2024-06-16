package com.kydas.metro.stations;

import com.kydas.metro.core.crud.BaseMapper;
import com.kydas.metro.employee.Employee;
import com.kydas.metro.employee.EmployeeDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface StationMapper extends BaseMapper<Station, StationDTO> {

}