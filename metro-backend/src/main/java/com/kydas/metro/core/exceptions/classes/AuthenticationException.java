package com.kydas.metro.core.exceptions.classes;

import org.springframework.http.HttpStatus;

public class AuthenticationException extends ApiException{
    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.UNAUTHORIZED;
    }
}
