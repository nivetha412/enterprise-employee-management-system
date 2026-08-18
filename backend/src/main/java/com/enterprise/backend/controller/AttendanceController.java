package com.enterprise.backend.controller;

import com.enterprise.backend.dto.AttendanceRequestDto;
import com.enterprise.backend.dto.AttendanceResponseDto;
import com.enterprise.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    @PreAuthorize("@accessControl.ownsEmployee(#dto.employeeId, authentication)")
    public AttendanceResponseDto checkIn(
            @RequestBody AttendanceRequestDto dto) {

        return attendanceService.checkIn(dto);
    }

    @PostMapping("/checkout")
    @PreAuthorize("@accessControl.ownsEmployee(#dto.employeeId, authentication)")
    public AttendanceResponseDto checkOut(
            @RequestBody AttendanceRequestDto dto) {

        return attendanceService.checkOut(dto);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AttendanceResponseDto> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("@accessControl.ownsEmployee(#employeeId, authentication)")
    public List<AttendanceResponseDto> getAttendanceByEmployee(
            @PathVariable Long employeeId) {

        return attendanceService.getAttendanceByEmployeeId(employeeId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return "Attendance Deleted Successfully";
    }
}
