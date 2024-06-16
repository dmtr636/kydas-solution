package com.kydas.metro.auth.login;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.LoginFailedException;
import com.kydas.metro.core.exceptions.classes.ThrottledException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class LoginAttemptService {

    private final LoginAttemptRepository loginAttemptRepository;

    private LoginAttempt loginAttempt;
    public final static int INITIAL_ATTEMPTS = 6;
    public final static int ATTEMPTS_AFTER_BAN = 3;
    public final static int SHORT_BAN_DURATION_SECONDS = 300;
    public final static int LONG_BAN_DURATION_SECONDS = 3600;

    @Autowired
    public LoginAttemptService(LoginAttemptRepository loginAttemptRepository) {
        this.loginAttemptRepository = loginAttemptRepository;
    }

    public void getOrCreateLoginAttempt(HttpServletRequest request) {
        var ipAddress = getIpAddress(request);
        this.loginAttempt = loginAttemptRepository.findByIp(ipAddress).orElseGet(() ->
            new LoginAttempt(ipAddress)
        );
        checkLastLogin();
        loginAttempt.setLastLoginAttempt(LocalDateTime.now());
        loginAttemptRepository.save(loginAttempt);
    }

    public void handleSuccessfulAttempt() throws ServletException {
        loginAttemptRepository.delete(loginAttempt);
    }

    public void handleFailedAttempt() throws ApiException {
        incrementAttempts();
        var remainingAttempts = getRemainingAttempts();

        if (remainingAttempts == 0) {
            setBan();
            throw new ThrottledException(getBanDurationSeconds());
        }

        throw new LoginFailedException(remainingAttempts);
    }

    public void assertAttemptAvailable() throws ApiException {
        if (isBanned()) {
            throw new ThrottledException(getBanDurationSeconds());
        }
    }

    private void checkLastLogin() {
        var now = LocalDateTime.now();
        var secondsSinceLastLogin = ChronoUnit.SECONDS.between(loginAttempt.getLastLoginAttempt(), now);

        if (secondsSinceLastLogin >= SHORT_BAN_DURATION_SECONDS) {
            if (loginAttempt.getAttempts() < INITIAL_ATTEMPTS) {
                loginAttempt.setAttempts(0);
            } else if (loginAttempt.getAttempts() % ATTEMPTS_AFTER_BAN != 0) {
                loginAttempt.setAttempts(INITIAL_ATTEMPTS);
            }
        }
    }

    private boolean isBanned() {
        var banExpirationTime = loginAttempt.getBanExpirationTime();
        return banExpirationTime != null && banExpirationTime.isAfter(LocalDateTime.now());
    }

    private void incrementAttempts() {
        var attempts = loginAttempt.getAttempts();
        loginAttempt.setAttempts(++attempts);
        loginAttemptRepository.save(loginAttempt);
    }

    private String getIpAddress(HttpServletRequest request) {
        var ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    private void setBan() {
        var attempts = loginAttempt.getAttempts();
        if (attempts == INITIAL_ATTEMPTS) {
            loginAttempt.setBanExpirationTime(LocalDateTime.now().plusSeconds(SHORT_BAN_DURATION_SECONDS));
        } else if (attempts != ATTEMPTS_AFTER_BAN && attempts % ATTEMPTS_AFTER_BAN == 0) {
            loginAttempt.setBanExpirationTime(LocalDateTime.now().plusSeconds(LONG_BAN_DURATION_SECONDS));
        }
        loginAttemptRepository.save(loginAttempt);
    }

    private int getRemainingAttempts() {
        var attempts = loginAttempt.getAttempts();
        if (attempts <= INITIAL_ATTEMPTS) {
            return INITIAL_ATTEMPTS - attempts;
        } else if (attempts % ATTEMPTS_AFTER_BAN == 0) {
            return 0;
        } else {
            return ATTEMPTS_AFTER_BAN - (attempts % ATTEMPTS_AFTER_BAN);
        }
    }

    private int getBanDurationSeconds() {
        var banExpirationTime = loginAttempt.getBanExpirationTime();
        if (banExpirationTime != null) {
            var remainingSeconds = (ChronoUnit.MILLIS.between(LocalDateTime.now(), banExpirationTime) / 1000.0);
            return (int) Math.max(0, Math.round(remainingSeconds));
        }
        return 0;
    }
}