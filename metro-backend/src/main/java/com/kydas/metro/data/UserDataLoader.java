package com.kydas.metro.data;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.utils.JsonUtils;
import com.kydas.metro.users.User;
import com.kydas.metro.users.UserDTO;
import com.kydas.metro.users.UserRepository;
import com.kydas.metro.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class UserDataLoader {
    private final UserService userService;
    private final UserRepository userRepository;

    @Value("${spring.security.user.name}")
    private String rootUserEmail;

    @Value("${spring.security.user.password}")
    private String rootUserPassword;

    @Value("classpath:data/users.json")
    private Resource userDataFile;

    public boolean isRootUserExists() {
        return userRepository.existsByEmail(rootUserEmail);
    }

    public void createUsers() throws ApiException, IOException {
        createRootUser();
        var users = JsonUtils.readJson(userDataFile, UserDTO[].class);
        for (UserDTO user : users) {
            user.setPassword(user.getPassword().replace("{password}", rootUserPassword));
            user.setEmail(user.getEmail().replace("{domain}", rootUserEmail.split("@")[1]));
            userService.create(user);
        }
    }

    private void createRootUser() throws ApiException {
        userService.create(new UserDTO()
            .setEmail(rootUserEmail)
            .setPassword(rootUserPassword)
            .setRole(User.Role.ROOT)
            .setName("Системный администратор"));
    }
}
