package com.kydas.metro.core.openapi;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
    info = @Info(
        title = "API",
        description = """
            A service for monitoring and adaptive
            distribution of requests for serving from
            passengers with limited mobility""",
        version = "1.0.0"
    )
)
public class OpenApiConfig {

}