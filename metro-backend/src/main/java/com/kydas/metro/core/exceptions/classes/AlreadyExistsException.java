package com.kydas.metro.core.exceptions.classes;

import org.springframework.http.HttpStatus;

public class AlreadyExistsException extends ApiException {
    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.CONFLICT;
    }
}
