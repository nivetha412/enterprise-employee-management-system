package com.enterprise.backend.repository;

import com.enterprise.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeId(Long employeeId);

    Optional<Attendance> findTopByEmployeeIdAndAttendanceDateAndCheckOutTimeIsNullOrderByIdDesc(
            Long employeeId, LocalDate date);

    Optional<Attendance> findTopByEmployeeIdAndAttendanceDateOrderByIdDesc(
            Long employeeId, LocalDate date);
}
