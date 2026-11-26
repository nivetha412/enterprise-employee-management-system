package com.enterprise.backend.repository;

import com.enterprise.backend.entity.EmployeeLeaveBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.Optional;
import java.util.List;

public interface EmployeeLeaveBalanceRepository extends JpaRepository<EmployeeLeaveBalance, Long> {
    Optional<EmployeeLeaveBalance> findFirstByEmployeeId(Long employeeId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM EmployeeLeaveBalance b WHERE b.employeeId = :employeeId ORDER BY b.id")
    List<EmployeeLeaveBalance> lockAllByEmployeeId(@Param("employeeId") Long employeeId);
}
