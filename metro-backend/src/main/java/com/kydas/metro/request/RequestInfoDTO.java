package com.kydas.metro.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class RequestInfoDTO {
    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    private String phoneDescription;

    private String phoneSecondary;

    private String phoneSecondaryDescription;

    private String email;

    private Integer age;

    private String sex;

    @NotBlank
    private String tripDate;

    private String tripDateEnd;

    @NotNull
    private Integer departureStationId;

    @NotNull
    private Integer arrivalStationId;

    @NotBlank
    private String meetingPoint;

    private Integer groupId;

    @NotNull
    private Boolean wheelchairRequired;

    @NotNull
    private Boolean hasBaggage;

    private Boolean lightBaggage;

    private Boolean mediumBaggage;

    private String baggageDescription;

    private String baggageWeight;

    private Boolean baggageHelpRequired;

    private Boolean pacemaker;

    private String comment;

    private String strollerDescription;
}

