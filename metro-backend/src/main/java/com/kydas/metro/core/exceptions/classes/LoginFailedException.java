package com.kydas.metro.core.exceptions.classes;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.Map;

@NoArgsConstructor
public class LoginFailedException extends ApiException {
    public LoginFailedException(Integer remainingAttempts) {
        this.setData(Map.of("remainingAttempts", remainingAttempts));
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}

