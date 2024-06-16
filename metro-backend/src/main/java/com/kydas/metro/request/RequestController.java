package com.kydas.metro.request;

import com.kydas.metro.core.crud.BaseController;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.filter.GetListByFilterDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.kydas.metro.core.web.Endpoints.REQUESTS_ENDPOINT;

@RestController
@RequestMapping(REQUESTS_ENDPOINT)
@Tag(name="Сервис заявок")
public class RequestController extends BaseController<Request, UUID, RequestDTO> {
    @Autowired
    private RequestMapper mapper;
    @Autowired
    private RequestService service;

    public RequestController(RequestService service, RequestMapper mapper) {
        super(service, mapper);
    }

    @PostMapping("/getListByFilter")
    @Operation(
        summary = "Фильтрация заявок"
    )
    public List<RequestDTO> filter(@RequestBody @Valid GetListByFilterDTO<RequestFilterDTO> dto) {
        var requests = service.getListByFilter(dto);
        return requests.stream().map(mapper::toDTO).collect(Collectors.toList());
    }

    @PostMapping("/confirm")
    @Operation(
        summary = "Подтверждение заявки"
    )
    public RequestDTO confirm(@RequestBody @Valid RequestDTO dto) throws ApiException {
        var entity = service.confirm(dto);
        return mapper.toDTO(entity);
    }

    @PostMapping("/cancel")
    @Operation(
        summary = "Отмена заявки"
    )
    public RequestDTO cancel(@RequestBody @Valid RequestCancelDTO dto) throws ApiException {
        var entity = service.cancel(dto);
        return mapper.toDTO(entity);
    }
}
