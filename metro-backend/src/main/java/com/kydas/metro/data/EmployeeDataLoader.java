package com.kydas.metro.data;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.utils.JsonUtils;
import com.kydas.metro.core.utils.StringUtils;
import com.kydas.metro.employee.EmployeeDTO;
import com.kydas.metro.employee.EmployeeService;
import com.kydas.metro.users.User;
import com.kydas.metro.users.UserDTO;
import com.kydas.metro.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;
import java.util.Random;

import static com.kydas.metro.data.RequestDataLoader.generateRandomName;
import static com.kydas.metro.data.RequestDataLoader.generateRandomPatronymic;

@Component
@RequiredArgsConstructor
public class EmployeeDataLoader {
    private final EmployeeService employeeService;
    private final UserService userService;

    @Value("${spring.security.user.name}")
    private String rootUserEmail;

    @Value("${spring.security.user.password}")
    private String rootUserPassword;

    @Value("classpath:data/employees.json")
    private Resource employeesDataFile;

    public void createEmployees() throws IOException, ApiException {
        var random = new Random(1);
        var employees = JsonUtils.readJson(employeesDataFile, EmployeeDTO[].class);
        int index = 1;
        for (EmployeeDTO employeeDTO : employees) {
            var user = userService.create(new UserDTO()
                .setEmail("inspector-%s@%s".formatted(index, rootUserEmail.split("@")[1]))
                .setPassword(rootUserPassword)
                .setRole(User.Role.EMPLOYEE)
            );
            employeeDTO.setUserId(user.getId());
            employeeDTO.setNumber(StringUtils.padLeft(String.valueOf(index), 8, "0"));
            employeeDTO.setFirstName(generateRandomName(Objects.equals(employeeDTO.getSex(), "male"), random));
            employeeDTO.setPatronymic(generateRandomPatronymic(Objects.equals(employeeDTO.getSex(), "male"), random));
            employeeService.createByRoot(employeeDTO);
            index++;
        }
    }
}
