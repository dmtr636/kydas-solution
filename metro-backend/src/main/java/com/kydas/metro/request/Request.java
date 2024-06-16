package com.kydas.metro.request;

import com.kydas.metro.employee.AssignedEmployee;
import com.kydas.metro.stations.Station;
import com.kydas.metro.stations.StationDTO;
import jakarta.persistence.*;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(indexes = {
    @Index(columnList = "tripDate"),
    @Index(columnList = "tripDateEnd"),
    @Index(columnList = "tripDate, tripDateEnd"),
    @Index(columnList = "status"),
    @Index(columnList = "number")
})
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "serial")
    @Generated
    private Long number;

    private Long passengerId;

    @Embedded
    private RequestInfo info;

    @CreationTimestamp
    private Instant createDate;

    @UpdateTimestamp
    private Instant updateDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Enumerated(EnumType.STRING)
    private ConvoyStatus convoyStatus;

    private String cancelReason;

    private Integer inspectorMaleCount;

    private Integer inspectorFemaleCount;

    private String tripDuration;

    private Boolean lockedEdit;

    private Boolean fromSite;

    @ElementCollection
    @CollectionTable(
        indexes = {
            @Index(columnList = "request_id"),
        }
    )
    private List<Integer> route;

    private Integer position;

    @ElementCollection
    @CollectionTable(
        indexes = {
            @Index(columnList = "request_id"),
        }
    )
    private List<Integer> routeTransferTime;

    @ElementCollection
    @CollectionTable(name = "assigned_employees", joinColumns = @JoinColumn(name = "id"),
        indexes = {
            @Index(columnList = "id, employee_id"),
            @Index(columnList = "employee_id"),
            @Index(columnList = "id"),
        }
    )
    @AttributeOverrides({
        @AttributeOverride(name = "employeeId", column = @Column(name = "employee_id")),
    })
    private List<AssignedEmployee> assignedEmployees;

    public enum Status {
        NEW,
        CONFIRMED,
        COMPLETED,
        CANCELED,
        UNDER_CONSIDERATION,
        WAITING_LIST,
    }

    public enum ConvoyStatus {
        ACCEPTED,
        INSPECTOR_DISPATCHED,
        INSPECTOR_ON_SITE,
        TRIP,
        COMPLETE_CONVOY,
        PASSENGER_LATE,
        INSPECTOR_LATE
    }
}
