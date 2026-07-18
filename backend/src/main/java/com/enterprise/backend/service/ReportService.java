package com.enterprise.backend.service;

import com.enterprise.backend.dto.DashboardReportDto;
import com.enterprise.backend.entity.Attendance;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.AttendanceRepository;
import com.enterprise.backend.repository.DepartmentRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EmployeeRepository employeeRepository;

    private final DepartmentRepository departmentRepository;

    private final AttendanceRepository attendanceRepository;

    public DashboardReportDto getDashboardReport() {

        long totalEmployees = employeeRepository.count();

        long totalDepartments = departmentRepository.count();

        List<Employee> employees = employeeRepository.findAll();

        long activeEmployees = employees.stream()
                .filter(e -> Boolean.TRUE.equals(e.getActive()))
                .count();

        long inactiveEmployees = totalEmployees - activeEmployees;

        // Only count today's attendance records
        LocalDate today = LocalDate.now();
        List<Attendance> todayAttendance = attendanceRepository.findAll().stream()
                .filter(a -> today.equals(a.getAttendanceDate()))
                .toList();

        long presentToday = todayAttendance.stream()
                .filter(a -> "PRESENT".equals(a.getStatus()))
                .count();

        long absentToday = todayAttendance.stream()
                .filter(a -> "ABSENT".equals(a.getStatus()))
                .count();

        long lateToday = todayAttendance.stream()
                .filter(a -> Boolean.TRUE.equals(a.getLateArrival()))
                .count();

        return DashboardReportDto.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .inactiveEmployees(inactiveEmployees)
                .totalDepartments(totalDepartments)
                .presentToday(presentToday)
                .absentToday(absentToday)
                .lateToday(lateToday)
                .build();
    }
}