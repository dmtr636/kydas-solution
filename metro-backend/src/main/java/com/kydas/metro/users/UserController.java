package com.kydas.metro.users;

import com.kydas.metro.core.crud.BaseController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.kydas.metro.core.web.Endpoints.USERS_ENDPOINT;

@RestController
@RequestMapping(USERS_ENDPOINT)
@Tag(name="Сервис пользователей")
public class UserController extends BaseController<User, Long, UserDTO> {
    public UserController(UserService service, UserMapper mapper) {
        super(service, mapper);
    }
}
