package com.kydas.metro.employee;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import com.kydas.metro.core.security.SecurityContext;
import com.kydas.metro.events.EventDTO;
import com.kydas.metro.events.EventService;
import com.kydas.metro.events.EventWebsocketDTO;
import com.kydas.metro.events.EventsWebsocketController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService extends BaseService<Employee, Long, EmployeeDTO> {
    @Autowired
    private EmployeeRepository repository;
    @Autowired
    private EmployeeMapper mapper;
    @Autowired
    private EventService eventService;
    @Autowired
    private SecurityContext securityContext;
    @Autowired
    private EventsWebsocketController eventsWebsocketController;

    public EmployeeService(EmployeeRepository repository) {
        super(repository);
    }

    public Employee create(EmployeeDTO dto) throws ApiException {
        var employee = new Employee();
        mapper.update(employee, dto);
        var savedEmployee = repository.save(employee);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.CREATE)
            .setObjectName("employee")
            .setData(mapper.toDTO(employee))
        );
        eventService.create(new EventDTO()
            .setObjectId(savedEmployee.getId().toString())
            .setObjectName("employee")
            .setAction("CREATE_EMPLOYEE")
            .setUserId(securityContext.getCurrentUser().getId())
        );
        return savedEmployee;
    }

    public Employee createByRoot(EmployeeDTO dto) throws ApiException {
        var employee = new Employee();
        mapper.update(employee, dto);
        var savedEmployee = repository.save(employee);
        eventService.create(new EventDTO()
            .setObjectId(savedEmployee.getId().toString())
            .setObjectName("employee")
            .setAction("CREATE_EMPLOYEE")
            .setUserId(1L)
        );
        return savedEmployee;
    }

    public Employee update(EmployeeDTO dto) throws ApiException {
        var employee = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        var oldLock = employee.getLockedEdit();
        var newLock = dto.getLockedEdit();
        mapper.update(employee, dto);
        var savedEmployee = repository.save(employee);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.UPDATE)
            .setObjectName("employee")
            .setData(mapper.toDTO(employee))
        );
        if (oldLock == newLock) {
            eventService.create(new EventDTO()
                .setObjectId(savedEmployee.getId().toString())
                .setObjectName("employee")
                .setAction("UPDATE_EMPLOYEE")
                .setUserId(securityContext.getCurrentUser().getId())
            );
        }
        return savedEmployee;
    }

    public void delete(Long id) throws ApiException {
        var request = repository.findById(id).orElseThrow(NotFoundException::new);
        eventsWebsocketController.notify(new EventWebsocketDTO()
            .setType(EventWebsocketDTO.Type.DELETE)
            .setObjectName("employee")
            .setData(mapper.toDTO(request))
        );
        eventService.create(new EventDTO()
            .setObjectId(id.toString())
            .setObjectName("employee")
            .setAction("DELETE_EMPLOYEE")
            .setUserId(securityContext.getCurrentUser().getId())
        );
        repository.deleteById(id);
    }
}
