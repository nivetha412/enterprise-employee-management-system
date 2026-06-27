package com.enterprise.backend.service;

import com.enterprise.backend.dto.DashboardReportDto;
import com.enterprise.backend.entity.Attendance;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.AttendanceRepository;
import com.enterprise.backend.repository.DepartmentRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EmployeeRepository employeeRepository;

    private final DepartmentRepository departmentRepository;

    private final AttendanceRepository attendanceRepository;

    public DashboardReportDto getDashboardReport() {

        long totalEmployees =
        employeeRepository.count();

long totalDepartments =
        departmentRepository.count();

List<Employee> employees =
        employeeRepository.findAll();

long activeEmployees =
        employees.stream()
                .filter(employee ->
                        Boolean.TRUE.equals(employee.getActive()))
                .count();

long inactiveEmployees =
        totalEmployees - activeEmployees;

List<Attendance> attendanceList =
        attendanceRepository.findAll();

long presentToday =
        attendanceList.stream()
                .filter(attendance ->
                        "PRESENT".equals(
                                attendance.getStatus()))
                .count();

long absentToday =
        attendanceList.stream()
                .filter(attendance ->
                        "ABSENT".equals(
                                attendance.getStatus()))
                .count();

long lateToday =
        attendanceList.stream()
                .filter(attendance ->
                        Boolean.TRUE.equals(
                                attendance.getLateArrival()))
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