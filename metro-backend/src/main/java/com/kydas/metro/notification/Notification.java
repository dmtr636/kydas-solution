package com.kydas.metro.notification;

import com.kydas.metro.request.Request;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID requestId;

    @Column(nullable = false)
    private Long requestNumber;

    @CreationTimestamp
    private Instant createDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Action action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Request.Status status;

    @Enumerated(EnumType.STRING)
    private Request.ConvoyStatus convoyStatus;

    private Long userId;

    @Column(nullable = false)
    private Boolean isRead;

    private String message;

    public enum Action {
        CREATE_REQUEST,
        COMPLETE_CONVOY,
        EDIT_REQUEST,
        CHANGE_STATUS,
        CHANGE_CONVOY_STATUS,
        CANCEL_REQUEST,
        CONFIRM_REQUEST,
        DELETE_REQUEST,
        INSPECTOR_DISPATCHED,
        INSPECTOR_ON_SITE,
        TRIP,
        PASSENGER_LATE,
        INSPECTOR_LATE,
        RESCHEDULE,
    }
}
