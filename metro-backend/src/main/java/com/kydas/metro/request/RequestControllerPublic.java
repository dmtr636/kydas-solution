package com.kydas.metro.request;

import com.kydas.metro.core.exceptions.classes.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.kydas.metro.core.web.Endpoints.PUBLIC_REQUEST_ENDPOINT;

@RestController
@RequestMapping(PUBLIC_REQUEST_ENDPOINT)
@Tag(name="Сервис заявок (для сайта подачи заявок)")
public class RequestControllerPublic {
    @Autowired
    private RequestService service;

    @Autowired
    private RequestMapper mapper;

    @PostMapping
    @Operation(
        summary = "Подача заявки"
    )
    public RequestDTO create(@RequestBody @Valid RequestDTO dto) throws ApiException {
        var entity = service.create(dto);
        return mapper.toDTO(entity);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Получение заявки по UUID"
    )
    public RequestDTO getById(@PathVariable UUID id) throws ApiException {
        var entity = service.getById(id);
        return mapper.toDTO(entity);
    }

    @PostMapping("/{id}/cancel")
    @Operation(
        summary = "Отмена заявки"
    )
    public RequestDTO cancel(@PathVariable UUID id) throws ApiException {
        var entity = service.cancelByPassenger(id);
        return mapper.toDTO(entity);
    }

    @PostMapping("/subscribe")
    @Operation(
        summary = "Подписка на изменения"
    )
    public String subscribe(@RequestBody @Valid RequestSubscribeDTO dto) throws ApiException {
        service.subscribe(dto);
        return "Ok";
    }
}
