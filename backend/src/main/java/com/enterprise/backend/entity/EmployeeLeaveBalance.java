package com.enterprise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employee_leave_balance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeLeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;

    private Integer casualLeaveBalance;

    private Integer sickLeaveBalance;

    private Integer earnedLeaveBalance;

    private Integer compOffBalance;

    private Integer wfhBalance;
}