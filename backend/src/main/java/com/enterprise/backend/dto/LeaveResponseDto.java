package com.enterprise.backend.dto;

import com.enterprise.backend.enums.LeavePriority;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.enums.LeaveType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class LeaveResponseDto {

    private Long id;

    private Long employeeId;

    private LeaveType leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer totalDays;

    private String reason;

    private LeavePriority priority;

    private LeaveStatus status;

    private Long backupEmployeeId;

    private String managerRemarks;

    private String hrRemarks;

    private LocalDate appliedDate;

    private LocalDate approvedDate;
}