package com.enterprise.backend.service;

import com.enterprise.backend.entity.Attendance;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.AttendanceRepository;
import com.enterprise.backend.repository.DepartmentRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {
    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private AttendanceRepository attendanceRepository;

    @Test
    void reportsOnlyExplicitlyRecordedAbsenceRows() {
        Clock clock = Clock.fixed(Instant.parse("2026-11-22T00:00:00Z"), ZoneId.of("Asia/Kolkata"));
        ReportService service = new ReportService(employeeRepository, departmentRepository, attendanceRepository, clock);
        when(employeeRepository.count()).thenReturn(2L);
        when(employeeRepository.findAll()).thenReturn(List.of(
                Employee.builder().active(true).build(), Employee.builder().active(true).build()));
        when(departmentRepository.count()).thenReturn(1L);
        when(attendanceRepository.findByAttendanceDate(java.time.LocalDate.of(2026, 11, 22)))
                .thenReturn(List.of(
                        Attendance.builder().status("PRESENT").lateArrival(false).build(),
                        Attendance.builder().status("ABSENT").lateArrival(false).build()));

        var report = service.getDashboardReport();

        assertEquals(1L, report.getRecordedAbsentToday());
    }
}