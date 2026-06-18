package com.enterprise.backend.repository;

import com.enterprise.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;


public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}