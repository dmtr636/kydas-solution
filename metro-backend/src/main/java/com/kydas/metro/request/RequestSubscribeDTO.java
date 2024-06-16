package com.kydas.metro.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.UUID;

@Data
@Accessors(chain = true)
public class RequestSubscribeDTO {
    @NotNull
    private UUID id;

    @Email
    @NotBlank
    private String email;
}

