package com.kydas.metro.passenger;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class PassengerDTO {
    private Long id;

    private String fullName;

    private String phone;

    private String phoneDescription;

    private String phoneSecondary;

    private String phoneSecondaryDescription;

    private String sex;

    private Integer age;

    private Integer groupId;

    private Boolean pacemaker;

    private String comment;

    private String createDate;

    private String updateDate;

    private Boolean lockedEdit;
}

