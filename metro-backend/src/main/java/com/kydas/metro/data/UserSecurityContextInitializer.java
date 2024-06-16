package com.kydas.metro.data;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.users.User;
import com.kydas.metro.users.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
public class UserSecurityContextInitializer {

    private final UserService userService;
    private final UserDetailsService userDetailsService;

    public UserSecurityContextInitializer(UserService userService, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

    public void authenticateUserById(Long userId) throws ApiException {
        User user = userService.getById(userId);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
