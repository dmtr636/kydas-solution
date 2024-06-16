package com.kydas.metro.security;

import com.kydas.metro.users.User;
import com.kydas.metro.users.UserMapper;
import com.kydas.metro.users.UserRepository;
import com.kydas.metro.users.UserDTO;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.stereotype.Component;

import java.net.HttpCookie;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.kydas.metro.auth.AuthTestUnits.getLoginRequest;
import static com.kydas.metro.core.web.Endpoints.AUTH_ENDPOINT;

@Getter
@Component
@RequiredArgsConstructor
public class SecurityTestUtils {
    private final UserMapper userMapper;
    private static final String SESSION_COOKIE_NAME = "JSESSIONID";
    private static final String SET_COOKIE_HEADER_NAME = "Set-Cookie";
    private static final String COOKIE_HEADER_NAME = "Cookie";

    @Autowired
    private UserRepository userRepository;

    @Value("${spring.security.user.name}")
    private String rootUserEmail;

    @Value("${spring.security.user.password}")
    private String rootUserPassword;

    public void authenticateRestTemplateAsRootUser(TestRestTemplate restTemplate) {
        authenticateRestTemplate(restTemplate, rootUserEmail, rootUserPassword);
    }

    public void authenticateRestTemplate(TestRestTemplate restTemplate, String email, String password) {
        var loginResponse = restTemplate.postForEntity(
            AUTH_ENDPOINT + "/login",
            getLoginRequest(email, password),
            UserDTO.class
        );
        var httpCookie = getSessionCookie(loginResponse).orElseThrow(() ->
            new AssertionError("No session cookie in response")
        );
        setCookieToRestTemplate(restTemplate, httpCookie);
    }

    public Optional<HttpCookie> getSessionCookie(ResponseEntity<?> responseEntity) {
        var cookieHeaders = responseEntity.getHeaders().getOrEmpty(SET_COOKIE_HEADER_NAME);

        var sessionCookieHeader = cookieHeaders.stream().filter(
            header -> header.contains(SESSION_COOKIE_NAME)
        ).findFirst();

        return sessionCookieHeader.map(header ->
            HttpCookie.parse(header).get(0)
        );
    }

    public void setCookieToRestTemplate(TestRestTemplate restTemplate, HttpCookie httpCookie) {
        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            request.getHeaders().add(COOKIE_HEADER_NAME, httpCookie.toString());
            return execution.execute(request, body);
        };
        restTemplate.getRestTemplate().setInterceptors(Collections.singletonList(interceptor));
    }

    public void removeCookiesFromRestTemplate(TestRestTemplate restTemplate) {
        restTemplate.getRestTemplate().setInterceptors(Collections.emptyList());
    }

    public UserDTO getRootUserDTO() {
        return getUserDTOByEmail(rootUserEmail);
    }

    public UserDTO getUserDTOByEmail(String email) {
        return userMapper.toDTO(getUserByEmail(email));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
            new AssertionError("User not found")
        );
    }
}
