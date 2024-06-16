package com.kydas.metro.core.web;

import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.apache.tomcat.util.http.SameSiteCookies;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.util.ArrayUtils;

import java.util.List;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Value("${domain}")
    private String domain;

    public List<String> getAllowedOrigin() {
        return List.of(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://localhost:6006",
            "http://localhost:6007",
            "http://localhost:6008",
            "http://localhost",
            "https://localhost",
            "https://" + domain.replace("api.", ""),
            "https://" + domain.replace("api.", "metro."),
            "https://" + domain.replace("api.", "metro-dev."),
            "https://" + domain.replace("api.", "admin-dev."),
            "https://" + domain.replace("api.", "inspector-dev."),
            "https://" + domain.replace("api.", "request-dev."),
            "https://" + domain.replace("api.", "admin."),
            "https://" + domain.replace("api.", "inspector."),
            "https://" + domain.replace("api.", "request.")
        );
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/**")
            .allowedOrigins(getAllowedOrigin().toArray(new String[0]))
            .allowCredentials(true);
    }

    @Bean
    public TomcatContextCustomizer sameSiteCookiesConfig() {
        return context -> {
            final var cookieProcessor = new Rfc6265CookieProcessor();
            cookieProcessor.setSameSiteCookies(SameSiteCookies.NONE.getValue());
            context.setCookieProcessor(cookieProcessor);
        };
    }
}