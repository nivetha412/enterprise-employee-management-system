package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

/** Returned only once, to the authenticated administrator who created the employee. */
@Data
@Builder
public class EmployeeProvisioningResponseDto {
    private EmployeeResponseDto employee;
    private String temporaryPassword;
}
