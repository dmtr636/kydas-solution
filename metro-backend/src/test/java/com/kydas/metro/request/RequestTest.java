package com.kydas.metro.request;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.annotation.DirtiesContext;

import static com.kydas.metro.AssertUtils.assertDTO;
import static com.kydas.metro.core.web.Endpoints.PUBLIC_REQUEST_ENDPOINT;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class RequestTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void createRequest() {
        var dto = new RequestDTO()
            .setInfo(new RequestInfoDTO()
                .setFullName("Иванов Иван Иванович")
                .setPhone("+79101234567")
                .setAge(100)
                .setTripDate("2024-05-11T14:20:31.889Z")
                .setDepartureStationId(1)
                .setArrivalStationId(1)
                .setMeetingPoint("У входных дверей")
                .setGroupId(1)
                .setWheelchairRequired(true)
                .setHasBaggage(true)
                .setLightBaggage(false)
                .setMediumBaggage(true)
                .setBaggageDescription("Очень большой багаж")
                .setBaggageWeight("10 кг.")
                .setComment("Комментарий")
            );
        var response = restTemplate.postForEntity(
            PUBLIC_REQUEST_ENDPOINT,
            dto,
            RequestDTO.class
        );
        assertDTO(response, dto);
    }
}