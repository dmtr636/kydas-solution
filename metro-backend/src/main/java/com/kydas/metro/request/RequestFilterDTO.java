package com.kydas.metro.request;

import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class RequestFilterDTO {
    private String tripDate;
    private String date;
    private Long employeeId;
    private Request.Status status;
    private Long number;
    private Long passengerId;
}

