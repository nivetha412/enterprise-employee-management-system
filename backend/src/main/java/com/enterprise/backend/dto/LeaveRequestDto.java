package com.enterprise.backend.dto;

import com.enterprise.backend.enums.LeavePriority;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.enums.LeaveType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestDto {

    private Long employeeId;

    private LeaveType leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private LeavePriority priority;

    private Long backupEmployeeId;

    // Used by admin approve/reject
    private LeaveStatus status;

    private String managerRemarks;

    private String hrRemarks;
}