package com.enterprise.backend.service;

import com.enterprise.backend.dto.AttendanceRequestDto;
import com.enterprise.backend.dto.AttendanceResponseDto;
import com.enterprise.backend.entity.Attendance;
import com.enterprise.backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Override
    public AttendanceResponseDto checkIn(AttendanceRequestDto dto) {
        Attendance attendance = Attendance.builder()
                .employeeId(dto.getEmployeeId())
                .attendanceDate(LocalDate.now())
                .checkInTime(LocalTime.now())
                .status("PRESENT")
                .lateArrival(LocalTime.now().isAfter(LocalTime.of(9, 0)))
                .build();
        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponseDto checkOut(AttendanceRequestDto dto) {
        // Find today's most recent check-in for this employee
        Attendance attendance = attendanceRepository
                .findTopByEmployeeIdAndAttendanceDateOrderByIdDesc(
                        dto.getEmployeeId(), LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No check-in record found for today"));

        attendance.setCheckOutTime(LocalTime.now());
        double workingHours = Duration.between(
                attendance.getCheckInTime(),
                attendance.getCheckOutTime()).toMinutes() / 60.0;
        attendance.setWorkingHours(workingHours);
        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    public List<AttendanceResponseDto> getAllAttendance() {
        return attendanceRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public List<AttendanceResponseDto> getAttendanceByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream().map(this::mapToDto).toList();
    }

    @Override
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance Not Found"));
        attendanceRepository.delete(attendance);
    }

    private AttendanceResponseDto mapToDto(Attendance attendance) {
        return AttendanceResponseDto.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployeeId())
                .attendanceDate(attendance.getAttendanceDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .workingHours(attendance.getWorkingHours())
                .lateArrival(attendance.getLateArrival())
                .build();
    }
}