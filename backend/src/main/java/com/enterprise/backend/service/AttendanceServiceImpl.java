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
import java.time.Clock;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final Clock businessClock;

    @Override
    public AttendanceResponseDto checkIn(AttendanceRequestDto dto) {
        ZonedDateTime now = ZonedDateTime.now(businessClock);
        LocalDate today = now.toLocalDate();
        LocalTime checkInTime = now.toLocalTime();
        attendanceRepository.findTopByEmployeeIdAndAttendanceDateOrderByIdDesc(dto.getEmployeeId(), today)
                .ifPresent(record -> {
                    throw new com.enterprise.backend.exception.AttendanceConflictException(record.getCheckOutTime() == null
                            ? "You are already checked in for today"
                            : "Today's attendance has already been completed");
                });
        attendanceRepository.findTopByEmployeeIdAndAttendanceDateAndCheckOutTimeIsNullOrderByIdDesc(
                dto.getEmployeeId(), today.minusDays(1))
                .ifPresent(record -> {
                    throw new com.enterprise.backend.exception.AttendanceConflictException(
                            "Please check out your previous workday before checking in again");
                });
        Attendance attendance = Attendance.builder()
                .employeeId(dto.getEmployeeId())
                .attendanceDate(today)
                .checkInTime(checkInTime)
                .status("PRESENT")
                .lateArrival(checkInTime.isAfter(LocalTime.of(9, 0)))
                .build();
        return mapToDto(attendanceRepository.save(attendance));
    }

    @Override
    public AttendanceResponseDto checkOut(AttendanceRequestDto dto) {
        ZonedDateTime now = ZonedDateTime.now(businessClock);
        LocalDate today = now.toLocalDate();
        LocalTime checkOutTime = now.toLocalTime();
        // Keep an overnight shift attached to its check-in date, including a checkout after midnight.
        Attendance attendance = attendanceRepository
                .findTopByEmployeeIdAndAttendanceDateBetweenAndCheckOutTimeIsNullOrderByAttendanceDateDescIdDesc(
                        dto.getEmployeeId(), today.minusDays(1), today)
                .orElseThrow(() -> new com.enterprise.backend.exception.AttendanceNotOpenException("No open check-in record found for today"));

        attendance.setCheckOutTime(checkOutTime);
        Duration duration = Duration.between(attendance.getCheckInTime(), checkOutTime);
        if (checkOutTime.isBefore(attendance.getCheckInTime())) duration = duration.plusDays(1);
        double workingHours = duration.toMinutes() / 60.0;
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
                .orElseThrow(() -> new com.enterprise.backend.exception.ResourceNotFoundException("Attendance record was not found"));
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
