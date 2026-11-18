package com.enterprise.backend.dto;

import com.enterprise.backend.enums.LeavePriority;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.enums.LeaveType;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

import java.time.LocalDate;

@Data
public class LeaveRequestDto {

    private Long employeeId;

    @NotNull(message = "Leave type is required")
    private LeaveType leaveType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotBlank(message = "Reason is required")
    @Size(max = 1000, message = "Reason must be 1000 characters or fewer")
    private String reason;

    @NotNull(message = "Priority is required")
    private LeavePriority priority;

    @NotNull(groups = Apply.class, message = "Backup employee is required")
    private Long backupEmployeeId;

    // Used by admin approve/reject
    private LeaveStatus status;

    private String managerRemarks;

    private String hrRemarks;

    public interface Apply extends Default {}
}
