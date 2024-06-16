package com.kydas.metro.auth;

import com.kydas.metro.auth.login.LoginAttempt;
import com.kydas.metro.auth.login.LoginAttemptRepository;
import com.kydas.metro.core.exceptions.classes.LoginFailedException;
import com.kydas.metro.core.exceptions.classes.ThrottledException;
import com.kydas.metro.core.exceptions.handler.ExceptionResponse;
import com.kydas.metro.users.UserDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.kydas.metro.AssertUtils.assertException;
import static com.kydas.metro.AssertUtils.assertGoodRequest;
import static com.kydas.metro.auth.AuthTestUnits.*;
import static com.kydas.metro.auth.login.LoginAttemptService.*;
import static com.kydas.metro.core.web.Endpoints.AUTH_ENDPOINT;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AuthControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private LoginAttemptRepository loginAttemptRepository;

    @Value("${spring.security.user.name}")
    private String ROOT_USER_EMAIL;

    @Value("${spring.security.user.password}")
    private String ROOT_USER_PASSWORD;

    @Test
    void successfulLogin() {
        var response = loginWithCredentials();

        var userDTO = response.getBody();

        assertAll(
            () -> assertGoodRequest(response),
            () -> assertThat(userDTO).isNotNull()
        );

        assertThat(userDTO.getEmail()).isEqualTo(ROOT_USER_EMAIL);
    }

    @Test
    void successfulLogout() {
        var response = restTemplate.postForEntity(
            AUTH_ENDPOINT + "/logout",
            null,
            Void.class
        );
        assertGoodRequest(response);
    }

    @Test
    void failedLoginWithWrongPassword() {
        assertException(
            loginWithWrongPassword(),
            new LoginFailedException(INITIAL_ATTEMPTS - 1)
        );
    }

    @Test
    void failedLoginWithWrongEmail() {
        assertException(
            loginWithWrongEmail(),
            new LoginFailedException(INITIAL_ATTEMPTS - 1)
        );
    }

    @Test
    void loginBannedAfterSixFailedAttempts() {
        for (var attempt = 1; attempt < INITIAL_ATTEMPTS; attempt++) {
            assertException(
                loginWithWrongPassword(),
                new LoginFailedException(INITIAL_ATTEMPTS - attempt)
            );
        }

        assertException(
            loginWithWrongPassword(),
            new ThrottledException(SHORT_BAN_DURATION_SECONDS)
        );

        resetBan();

        for (var attempt = 1; attempt < ATTEMPTS_AFTER_BAN; attempt++) {
            assertException(
                loginWithWrongPassword(),
                new LoginFailedException(ATTEMPTS_AFTER_BAN - attempt)
            );
        }

        assertException(
            loginWithWrongPassword(),
            new ThrottledException(LONG_BAN_DURATION_SECONDS)
        );
    }

    @Test
    void resetAttemptsAfterAnHour() {
        assertException(
            loginWithWrongPassword(),
            new LoginFailedException(INITIAL_ATTEMPTS - 1)
        );

        decreaseLastLoginByAnHour();

        for (var attempt = 1; attempt < INITIAL_ATTEMPTS; attempt++) {
            assertException(
                loginWithWrongPassword(),
                new LoginFailedException(INITIAL_ATTEMPTS - attempt)
            );
        }

        assertException(
            loginWithWrongPassword(),
            new ThrottledException(SHORT_BAN_DURATION_SECONDS)
        );

        resetBan();

        assertException(
            loginWithWrongPassword(),
            new LoginFailedException(ATTEMPTS_AFTER_BAN - 1)
        );

        decreaseLastLoginByAnHour();

        assertException(
            loginWithWrongPassword(),
            new LoginFailedException(ATTEMPTS_AFTER_BAN - 1)
        );
    }

    private Optional<LoginAttempt> getLoginAttempt() {
        return loginAttemptRepository.findByIp("127.0.0.1");
    }

    private void decreaseLastLoginByAnHour() {
        getLoginAttempt().ifPresent(loginAttempt -> {
            loginAttempt.setLastLoginAttempt(LocalDateTime.now().minusHours(1));
            loginAttemptRepository.save(loginAttempt);
        });
    }

    private void resetBan() {
        getLoginAttempt().ifPresent(loginAttempt -> {
            loginAttempt.setBanExpirationTime(LocalDateTime.now());
            loginAttemptRepository.save(loginAttempt);
        });
    }

    private ResponseEntity<ExceptionResponse> loginWithWrongPassword() {
        return restTemplate.postForEntity(
            AUTH_ENDPOINT + "/login",
            getLoginRequest(ROOT_USER_EMAIL, "wrongPassword"),
            ExceptionResponse.class
        );
    }

    private ResponseEntity<ExceptionResponse> loginWithWrongEmail() {
        return restTemplate.postForEntity(
            AUTH_ENDPOINT + "/login",
            getLoginRequest("wrongEmail", ROOT_USER_EMAIL),
            ExceptionResponse.class
        );
    }

    private ResponseEntity<UserDTO> loginWithCredentials() {
        return restTemplate.postForEntity(
            AUTH_ENDPOINT + "/login",
            getLoginRequest(ROOT_USER_EMAIL, ROOT_USER_PASSWORD),
            UserDTO.class
        );
    }
}
