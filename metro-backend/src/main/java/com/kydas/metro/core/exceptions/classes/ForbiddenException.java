package com.kydas.metro.core.exceptions.classes;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException {
    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.FORBIDDEN;
    }
}
