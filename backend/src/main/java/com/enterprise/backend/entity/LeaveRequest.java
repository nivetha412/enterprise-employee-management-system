package com.enterprise.backend.entity;

import com.enterprise.backend.enums.LeavePriority;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.enums.LeaveType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer totalDays;

    @Column(length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    private LeavePriority priority;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    private Long backupEmployeeId;

    @Column(length = 1000)
    private String managerRemarks;

    @Column(length = 1000)
    private String hrRemarks;

    private LocalDate appliedDate;

    private LocalDate approvedDate;
}