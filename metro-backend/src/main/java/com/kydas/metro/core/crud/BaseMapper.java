package com.kydas.metro.core.crud;

import org.mapstruct.MappingTarget;

public interface BaseMapper<E, DTO> {
    DTO toDTO(E entity);
    E update(@MappingTarget E entity, DTO dto);
}
