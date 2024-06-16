package com.kydas.metro.employee;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@Embeddable
public class EmployeeSchedule {
    private String dateStart;
    private String dateEnd;
    private String event;
}
