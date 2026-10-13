package com.enterprise.backend.service;

import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
@ConditionalOnProperty(name = "app.auth.seed-test-accounts", havingValue = "true")
@RequiredArgsConstructor
public class DevLoginSeeder implements ApplicationRunner {

    private static final String EMPLOYEE_CODE = "EMP001";

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedEmployee();
    }

    private void seedEmployee() {
        Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(EMPLOYEE_CODE)
                .orElseGet(() -> Employee.builder()
                        .employeeCode(EMPLOYEE_CODE)
                        .firstName("Test")
                        .lastName("Employee")
                        .email("employee.test@enterprise.local")
                        .build());
        employee.setPasswordHash(passwordEncoder.encode(EMPLOYEE_CODE));
        employee.setActive(true);
        employeeRepository.save(employee);
    }
}
