package com.kydas.metro.auth.login;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode
@Entity
public class LoginAttempt {

    @Id
    @Column(nullable = false, unique = true)
    private String ip;

    @Column(nullable = false)
    private int attempts;

    private LocalDateTime banExpirationTime;

    @Column(nullable = false)
    private LocalDateTime lastLoginAttempt = LocalDateTime.now();

    public LoginAttempt(String ip) {
        this.ip = ip;
        this.attempts = 0;
    }

    public LoginAttempt() {
        this.attempts = 0;
    }
}
