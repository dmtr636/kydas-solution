package com.kydas.metro.core.security;

import com.kydas.metro.core.web.Endpoints;
import com.kydas.metro.core.web.WebConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.SecureRandom;
import java.util.List;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final WebConfig webConfig;

    @Value("${secret-key}")
    private String SECRET_KEY;

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http, RememberMeServices rememberMeServices
    ) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(antMatcher(Endpoints.AUTH_ENDPOINT + "/**")).permitAll()
                .requestMatchers(antMatcher("/api/public/**")).permitAll()
                .requestMatchers(antMatcher("/v3/api-docs/**")).permitAll()
                .requestMatchers(antMatcher("/swagger-ui/**")).permitAll()
                .anyRequest().authenticated()
            )
            .rememberMe((remember) -> remember
                .rememberMeServices(rememberMeServices)
            )
            .sessionManagement(session -> session
                .sessionFixation().migrateSession()
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
            )
            .exceptionHandling(configurer ->
                configurer.authenticationEntryPoint(new AuthenticationEntryPointImpl())
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10, new SecureRandom(SECRET_KEY.getBytes()));
    }

    @Bean
    public RememberMeServices rememberMeServices(UserDetailsService userDetailsService) {
        var rememberMe = new TokenBasedRememberMeServices(
            SECRET_KEY, userDetailsService
        );
        rememberMe.setAlwaysRemember(true);
        rememberMe.setUseSecureCookie(true);
        rememberMe.setTokenValiditySeconds(3600 * 24 * 30);
        return rememberMe;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(webConfig.getAllowedOrigin());
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}