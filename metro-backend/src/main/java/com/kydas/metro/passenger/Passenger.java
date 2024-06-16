package com.kydas.metro.passenger;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    private String phoneDescription;

    private String phoneSecondary;

    private String phoneSecondaryDescription;

    private String sex;

    private Integer age;

    private Integer groupId;

    private Boolean pacemaker;

    @Lob
    private String comment;

    @CreationTimestamp
    private Instant createDate;

    @UpdateTimestamp
    private Instant updateDate;

    private Boolean lockedEdit;
}
