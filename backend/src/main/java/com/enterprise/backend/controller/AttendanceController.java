package com.enterprise.backend.controller;

import com.enterprise.backend.dto.AttendanceRequestDto;
import com.enterprise.backend.dto.AttendanceResponseDto;
import com.enterprise.backend.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/checkin")
    public AttendanceResponseDto checkIn(
            @RequestBody AttendanceRequestDto dto) {

        return attendanceService.checkIn(dto);
    }

    @PostMapping("/checkout")
    public AttendanceResponseDto checkOut(
            @RequestBody AttendanceRequestDto dto) {

        return attendanceService.checkOut(dto);
    }

    @GetMapping
    public List<AttendanceResponseDto> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return "Attendance Deleted Successfully";
    }
}