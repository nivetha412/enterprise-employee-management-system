package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeLeaveBalanceResponseDto {
    private Integer casualLeaveBalance;
    private Integer sickLeaveBalance;
    private Integer earnedLeaveBalance;
    private Integer compOffBalance;
    private Integer wfhBalance;
}
