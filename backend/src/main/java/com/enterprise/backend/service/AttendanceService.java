package com.enterprise.backend.service;

import com.enterprise.backend.dto.AttendanceRequestDto;
import com.enterprise.backend.dto.AttendanceResponseDto;

import java.util.List;

public interface AttendanceService {

    AttendanceResponseDto checkIn(
            AttendanceRequestDto dto);

    AttendanceResponseDto checkOut(
            AttendanceRequestDto dto);

    List<AttendanceResponseDto> getAllAttendance();

    List<AttendanceResponseDto> getAttendanceByEmployeeId(Long employeeId);

    void deleteAttendance(Long id);
}