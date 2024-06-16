package com.kydas.metro.auth;

import com.kydas.metro.auth.login.LoginAttemptService;
import com.kydas.metro.users.User;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.security.SecurityContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final RememberMeServices rememberMeServices;
    private final SecurityContext securityContext;
    private final LoginAttemptService loginAttemptService;

    public AuthService(RememberMeServices rememberMeServices, SecurityContext securityContext,
                       LoginAttemptService loginAttemptService) {
        this.rememberMeServices = rememberMeServices;
        this.securityContext = securityContext;
        this.loginAttemptService = loginAttemptService;
    }

    public User login(LoginRequest data, HttpServletRequest request, HttpServletResponse response) throws ApiException {
        authenticateUser(data.getEmail(), data.getPassword(), request);
        if (data.getRememberMe()) {
            rememberMeServices.loginSuccess(request, response, securityContext.getAuthentication());
        }
        return securityContext.getCurrentUser();
    }

    public void logout(HttpServletRequest request) throws ServletException {
        request.logout();
    }

    private void authenticateUser(String email, String password, HttpServletRequest request) throws ApiException {
        loginAttemptService.getOrCreateLoginAttempt(request);
        loginAttemptService.assertAttemptAvailable();
        try {
            request.logout();
            request.login(email, password);
            loginAttemptService.handleSuccessfulAttempt();
        } catch (ServletException e) {
            loginAttemptService.handleFailedAttempt();
        }
    }
}
