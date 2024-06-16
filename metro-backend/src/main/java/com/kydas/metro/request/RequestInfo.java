package com.kydas.metro.request;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.Data;

import java.time.Instant;

@Data
public class RequestInfo {
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String phoneDescription;

    private String phoneSecondary;

    private String phoneSecondaryDescription;

    private String email;

    private Integer age;

    private String sex;

    @Column(nullable = false)
    private Instant tripDate;

    private Instant tripDateEnd;

    @Column(nullable = false)
    private Integer departureStationId;

    @Column(nullable = false)
    private Integer arrivalStationId;

    @Column(nullable = false)
    private String meetingPoint;

    private Integer groupId;

    @Column(nullable = false)
    private Boolean wheelchairRequired;

    @Column(nullable = false)
    private Boolean hasBaggage;

    private Boolean lightBaggage;

    private Boolean mediumBaggage;

    private String baggageDescription;

    private String baggageWeight;

    private Boolean baggageHelpRequired;

    private Boolean pacemaker;

    @Lob
    private String comment;

    private String strollerDescription;
}
