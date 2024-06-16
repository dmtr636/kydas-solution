package com.kydas.metro.employee;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.EMPLOYEES_ENDPOINT;

@RestController
@RequestMapping(EMPLOYEES_ENDPOINT)
@Tag(name="Сервис инспекторов")
public class EmployeeController extends BaseController<Employee, Long, EmployeeDTO> {
    public EmployeeController(EmployeeService service, EmployeeMapper mapper) {
        super(service, mapper);
    }
}
