package com.kydas.metro.core.crud;

import com.kydas.metro.core.exceptions.classes.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public abstract class BaseController<E, ID, DTO> {
    private final BaseService<E, ID, DTO> service;
    private final BaseMapper<E, DTO> mapper;

    @GetMapping
    @Operation(
        summary = "Получение списка всех объектов"
    )
    public List<DTO> all() throws ApiException {
        var entities = service.getAll();
        return entities.stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @PostMapping
    @Operation(
        summary = "Создание объекта"
    )
    public DTO create(@RequestBody @Valid DTO dto) throws ApiException {
        var entity = service.create(dto);
        return mapper.toDTO(entity);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Получение объекта по ID"
    )
    public DTO getById(@PathVariable ID id) throws ApiException {
        var entity = service.getById(id);
        return mapper.toDTO(entity);
    }

    @PutMapping
    @Operation(
        summary = "Обновление объекта"
    )
    public DTO update(@RequestBody @Valid DTO dto) throws ApiException {
        var entity = service.update(dto);
        return mapper.toDTO(entity);
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Удаление объекта"
    )
    public void delete(@PathVariable ID id) throws ApiException {
        service.delete(id);
    }
}
