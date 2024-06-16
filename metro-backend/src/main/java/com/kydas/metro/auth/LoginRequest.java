package com.kydas.metro.auth;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class LoginRequest {
    @NotNull
    private String email;

    @NotNull
    private String password;

    @NotNull
    private Boolean rememberMe;
}
