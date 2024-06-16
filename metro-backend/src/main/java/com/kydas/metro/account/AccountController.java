package com.kydas.metro.account;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.security.SecurityContext;
import com.kydas.metro.users.UserDTO;
import com.kydas.metro.users.UserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/account")
@Tag(name="Сервис аккаунта пользователя")
public class AccountController {
    private final UserMapper userMapper;
    private final RememberMeServices rememberMeServices;
    private final SecurityContext securityContext;

    @GetMapping()
    @Operation(
        summary = "Получение информации о текущем пользователе"
    )
    public UserDTO currentUser(HttpServletRequest request, HttpServletResponse response) throws ApiException {
        String REMEMBER_ME_COOKIE_NAME = AbstractRememberMeServices.SPRING_SECURITY_REMEMBER_ME_COOKIE_KEY;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (REMEMBER_ME_COOKIE_NAME.equals(cookie.getName())) {
                    rememberMeServices.loginSuccess(request, response, securityContext.getAuthentication());
                    break;
                }
            }
        }
        return userMapper.toDTO(securityContext.getCurrentUser());
    }
}
