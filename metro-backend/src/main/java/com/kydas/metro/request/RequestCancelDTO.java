package com.kydas.metro.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.UUID;

@Data
@Accessors(chain = true)
public class RequestCancelDTO {
    @NotNull
    private UUID id;

    @NotBlank
    private String reason;

    private Boolean canceledByOperator;
}

