package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

/** Minimum employee information needed to choose a leave backup. */
@Data
@Builder
public class EmployeeBasicDto {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String department;
}
