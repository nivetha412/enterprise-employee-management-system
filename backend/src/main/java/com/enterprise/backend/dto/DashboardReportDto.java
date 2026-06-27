package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardReportDto {

    private Long totalEmployees;

    private Long activeEmployees;

    private Long inactiveEmployees;

    private Long totalDepartments;

    private Long presentToday;

    private Long absentToday;

    private Long lateToday;

}