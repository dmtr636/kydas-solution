package com.kydas.metro.employee;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String lastName;

    private String firstName;

    private String patronymic;

    private String sex;

    private String phone;

    private String phonePersonal;

    private String area;

    private String shift;

    private String position;

    private String number;

    private String supervisor;

    private Boolean lockedEdit;

    private String timeWorkStart1;
    private String timeWorkEnd1;
    private String timeWorkStart2;
    private String timeWorkEnd2;
    private String timeWorkStart3;
    private String timeWorkEnd3;
    private String timeWorkStart4;
    private String timeWorkEnd4;
    private String timeWorkStart5;
    private String timeWorkEnd5;
    private String timeWorkStart6;
    private String timeWorkEnd6;
    private String timeWorkStart7;
    private String timeWorkEnd7;

    private String timeLunch1;
    private String timeLunch2;
    private String timeLunch3;
    private String timeLunch4;
    private String timeLunch5;
    private String timeLunch6;
    private String timeLunch7;

    @ElementCollection
    private List<String> tags;

    @ElementCollection
    private List<EmployeeSchedule> schedule;
}
