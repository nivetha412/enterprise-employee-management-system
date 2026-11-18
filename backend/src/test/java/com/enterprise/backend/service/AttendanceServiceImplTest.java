package com.enterprise.backend.service;

import com.enterprise.backend.dto.AttendanceRequestDto;
import com.enterprise.backend.entity.Attendance;
import com.enterprise.backend.repository.AttendanceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceImplTest {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");

    @Mock
    private AttendanceRepository attendanceRepository;

    @Test
    void checkInUsesBusinessDateJustBeforeMidnight() {
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T18:29:30Z"), BUSINESS_ZONE);
        AttendanceServiceImpl service = new AttendanceServiceImpl(attendanceRepository, clock);
        AttendanceRequestDto request = new AttendanceRequestDto();
        request.setEmployeeId(12L);
        when(attendanceRepository.findTopByEmployeeIdAndAttendanceDateOrderByIdDesc(12L, LocalDate.of(2026, 1, 1)))
                .thenReturn(Optional.empty());
        when(attendanceRepository.save(any(Attendance.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var saved = service.checkIn(request);

        assertEquals(LocalDate.of(2026, 1, 1), saved.getAttendanceDate());
        assertEquals(LocalTime.of(23, 59, 30), saved.getCheckInTime());
        verify(attendanceRepository).save(any(Attendance.class));
    }

    @Test
    void checkOutAfterMidnightClosesPreviousBusinessDateRecord() {
        Clock clock = Clock.fixed(Instant.parse("2026-01-01T18:37:00Z"), BUSINESS_ZONE);
        AttendanceServiceImpl service = new AttendanceServiceImpl(attendanceRepository, clock);
        AttendanceRequestDto request = new AttendanceRequestDto();
        request.setEmployeeId(12L);
        Attendance openRecord = Attendance.builder()
                .id(4L)
                .employeeId(12L)
                .attendanceDate(LocalDate.of(2026, 1, 1))
                .checkInTime(LocalTime.of(23, 58))
                .status("PRESENT")
                .build();
        when(attendanceRepository
                .findTopByEmployeeIdAndAttendanceDateBetweenAndCheckOutTimeIsNullOrderByAttendanceDateDescIdDesc(
                        12L, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 2)))
                .thenReturn(Optional.of(openRecord));
        when(attendanceRepository.save(openRecord)).thenReturn(openRecord);

        var saved = service.checkOut(request);

        assertEquals(LocalDate.of(2026, 1, 1), saved.getAttendanceDate());
        assertEquals(LocalTime.of(0, 7), saved.getCheckOutTime());
        assertEquals(0.15, saved.getWorkingHours());
        verify(attendanceRepository).save(openRecord);
    }
}
