package com.kydas.metro.core.exceptions.handler;

import com.kydas.metro.core.exceptions.classes.ApiException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionResponse {

    private ErrorDetails error;

    public ExceptionResponse(ApiException e) {
        this.error = new ErrorDetails()
            .setCode(e.getCode())
            .setData(e.getData())
            .setMessage(e.getMessage());
    }

    public ExceptionResponse(MethodArgumentNotValidException e) {
        Map<String, Object> data = new HashMap<>();
        e.getFieldErrors().forEach(fieldError -> data.put(fieldError.getField(), fieldError.getCode()));
        this.error = new ErrorDetails()
            .setCode("ValidationError")
            .setData(data)
            .setMessage(e.getMessage());
    }

    public ExceptionResponse(NoSuchElementException e) {
        this.error = new ErrorDetails().setCode("NotFound");
    }

    public ExceptionResponse(AuthenticationException e) {
        this.error = new ErrorDetails()
            .setCode(AuthenticationException.class.getSimpleName())
            .setMessage(e.getMessage());
    }

    public ExceptionResponse(Exception e) {
        var sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        this.error = new ErrorDetails()
            .setCode("UnknownError")
            .setMessage(e.getMessage())
            .setStackTrace(sw.toString());
    }
}
