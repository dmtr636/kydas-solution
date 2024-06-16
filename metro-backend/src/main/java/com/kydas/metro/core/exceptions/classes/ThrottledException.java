package com.kydas.metro.core.exceptions.classes;

import org.springframework.http.HttpStatus;

import java.util.Map;

public class ThrottledException extends ApiException {

    public ThrottledException(int retryDelaySeconds) {
        this.setData(Map.of("retryDelaySeconds", retryDelaySeconds));
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.TOO_MANY_REQUESTS;
    }
}
