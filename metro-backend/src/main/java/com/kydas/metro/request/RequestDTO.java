package com.kydas.metro.request;

import com.kydas.metro.employee.AssignedEmployee;
import com.kydas.metro.stations.StationDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.ElementCollection;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;
import java.util.UUID;

@Data
@Accessors(chain = true)
public class RequestDTO {
    private UUID id;

    private Long number;

    private Long passengerId;

    @Valid
    @NotNull
    private RequestInfoDTO info;

    private String createDate;

    private String updateDate;

    private Request.Status status = Request.Status.NEW;

    private Request.ConvoyStatus convoyStatus = Request.ConvoyStatus.ACCEPTED;

    private String cancelReason;

    private Integer inspectorMaleCount;

    private Integer inspectorFemaleCount;

    private Integer position;

    private String tripDuration;

    private Boolean lockedEdit;

    private Boolean fromSite;

    private List<AssignedEmployee> assignedEmployees;

    private List<Integer> route;

    private List<Integer> routeTransferTime;
}

