package com.kydas.metro.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kydas.metro.core.exceptions.handler.ExceptionResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    @Override
    public void commence(
        HttpServletRequest request, HttpServletResponse response, AuthenticationException authException
    ) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        var mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), new ExceptionResponse(authException));
    }
}
