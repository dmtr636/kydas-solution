package com.kydas.metro.core.exceptions.classes;

import org.springframework.http.HttpStatus;

public class NotFoundException extends ApiException {
    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
