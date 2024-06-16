package com.kydas.metro.core.security;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.AuthenticationException;
import com.kydas.metro.users.User;
import com.kydas.metro.users.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityContext {
    private final UserRepository userRepository;

    public User getCurrentUser() throws ApiException, ClassCastException {
        var userDetails = (UserDetailsImpl) getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getUser().getId()).orElseThrow(AuthenticationException::new);
    }

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public Boolean isAuthenticated() {
        if (getAuthentication() == null) {
            return false;
        }
        try {
            getCurrentUser();
            return true;
        } catch (ApiException | ClassCastException e) {
            return false;
        }
    }
}
