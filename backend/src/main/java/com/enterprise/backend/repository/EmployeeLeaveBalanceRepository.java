package com.enterprise.backend.repository;

import com.enterprise.backend.entity.EmployeeLeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeLeaveBalanceRepository extends JpaRepository<EmployeeLeaveBalance, Long> {
    Optional<EmployeeLeaveBalance> findFirstByEmployeeId(Long employeeId);
}
