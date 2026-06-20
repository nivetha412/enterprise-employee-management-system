package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AttendanceResponseDto {

    private Long id;

    private Long employeeId;

    private LocalDate attendanceDate;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    private String status;

    private Double workingHours;

    private Boolean lateArrival;
}