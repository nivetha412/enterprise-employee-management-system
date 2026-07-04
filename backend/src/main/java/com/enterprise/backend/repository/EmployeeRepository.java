package com.enterprise.backend.repository;

import com.enterprise.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeCode(String employeeCode);

    Optional<Employee> findByEmail(String email);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCodeAndIdNot(String employeeCode, Long id);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(e.employeeCode, 4) AS int)), 0) FROM Employee e WHERE e.employeeCode LIKE 'EMP%' AND LENGTH(e.employeeCode) > 3")
    long findMaxEmpCodeSequence();

    @Query("SELECT e FROM Employee e WHERE e.employeeCode IS NULL OR e.employeeCode = ''")
    List<Employee> findEmployeesWithoutCode();
}