package com.kydas.metro.users;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.email.EmailService;
import com.kydas.metro.core.exceptions.classes.AlreadyExistsException;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.ForbiddenException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import com.kydas.metro.core.security.SecurityContext;
import com.kydas.metro.events.EventDTO;
import com.kydas.metro.events.EventService;
import com.kydas.metro.events.EventWebsocketDTO;
import com.kydas.metro.events.EventsWebsocketController;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService extends BaseService<User, Long, UserDTO> {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private EventService eventService;
    @Autowired
    private SecurityContext securityContext;
    @Value("${spring.security.user.password}")
    private String rootUserPassword;

    public UserService(UserRepository userRepository) {
        super(userRepository);
    }

    public User create(UserDTO userDTO) throws ApiException {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new AlreadyExistsException();
        }
        var user = new User();
        user = userMapper.update(user, userDTO);
        var password = userDTO.getPassword();
        if (password == null) {
            password = rootUserPassword;
            emailService.sendEmail(
                userDTO.getEmail(),
                "Учетные данные для входа",
                "Почта: " + userDTO.getEmail() + "\n" + "Пароль: " + password
            );
        }
        user.setPassword(passwordEncoder.encode(password));
        var savedUser = userRepository.save(user);
        if (securityContext.isAuthenticated()) {
            eventService.create(new EventDTO()
                .setObjectId(savedUser.getId().toString())
                .setObjectName("user")
                .setAction("CREATE_USER")
                .setUserId(securityContext.getCurrentUser().getId())
            );
        }
        return savedUser;
    }

    public User update(UserDTO userDTO) throws ApiException {
        var user = userRepository.findById(userDTO.getId()).orElseThrow(NotFoundException::new);
        if (user.getRole() == User.Role.ROOT) {
            throw new ForbiddenException().setMessage("ROOT user cannot be updated");
        }
        userMapper.update(user, userDTO);
        if (securityContext.isAuthenticated()) {
            eventService.create(new EventDTO()
                .setObjectId(user.getId().toString())
                .setObjectName("user")
                .setAction("UPDATE_USER")
                .setUserId(securityContext.getCurrentUser().getId())
            );
        }
        return userRepository.save(user);
    }

    public void delete(Long id) throws ApiException {
        var user = getById(id);
        if (user.getRole() == User.Role.ROOT) {
            throw new ForbiddenException().setMessage("ROOT user cannot be deleted");
        }
        if (securityContext.isAuthenticated()) {
            eventService.create(new EventDTO()
                .setObjectId(user.getId().toString())
                .setObjectName("user")
                .setAction("DELETE_USER")
                .setUserId(securityContext.getCurrentUser().getId())
            );
        }
        userRepository.deleteById(id);
    }
}
