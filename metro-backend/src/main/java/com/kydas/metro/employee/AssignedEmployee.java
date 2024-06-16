package com.kydas.metro.employee;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
@Embeddable
public class AssignedEmployee {
    @Column(name = "employee_id")
    private Long employeeId;

    private Boolean responsible = false;

    private Boolean assignedManually = false;
}
