package com.kydas.metro.core.exceptions.classes;

import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.http.HttpStatus;

import java.util.Map;


@Getter
@Setter
@Accessors(chain = true)
public class ApiException extends Exception {
    private String code;
    private Map<String, Object> data;
    private String message;
    private HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
    public String getCode() {
        return this.getClass().getSimpleName();
    }
}
