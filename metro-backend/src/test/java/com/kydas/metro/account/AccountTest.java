package com.kydas.metro.account;

import com.kydas.metro.security.SecurityTestUtils;
import com.kydas.metro.users.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import static com.kydas.metro.AssertUtils.assertDTO;
import static com.kydas.metro.core.web.Endpoints.ACCOUNT_ENDPOINT;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AccountTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SecurityTestUtils securityTestUtils;

    @BeforeEach
    void authenticateRestTemplate() {
        securityTestUtils.authenticateRestTemplateAsRootUser(restTemplate);
    }

    @Test
    void getCurrentUserInfo() {
        var response = restTemplate.getForEntity(
            ACCOUNT_ENDPOINT,
            UserDTO.class
        );
        assertDTO(response, securityTestUtils.getRootUserDTO());
    }
}

