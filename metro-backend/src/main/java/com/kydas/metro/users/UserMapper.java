package com.kydas.metro.users;

import com.kydas.metro.core.crud.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Component
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper extends BaseMapper<User, UserDTO> {
    @Override
    @Mapping(target = "password", ignore = true)
    UserDTO toDTO(User entity);

    @Override
    @Mapping(target = "password", ignore = true)
    User update(@MappingTarget User entity, UserDTO userDTO);
}