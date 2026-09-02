package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.dto.EmployeeSelfUpdateDto;
import com.enterprise.backend.dto.EmployeePasswordResetDto;
import com.enterprise.backend.dto.EmployeeBasicDto;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.entity.EmployeeLeaveBalance;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.repository.EmployeeLeaveBalanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeLeaveBalanceRepository employeeLeaveBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    private String generateEmployeeCode() {
        long seq = employeeRepository.findMaxEmpCodeSequence() + 1;
        String code = String.format("EMP%03d", seq);
        while (employeeRepository.existsByEmployeeCode(code)) {
            seq++;
            code = String.format("EMP%03d", seq);
        }
        return code;
    }
    @Override
    public String generateNextCode() {
        return generateEmployeeCode();
    }
    @Override
    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto) {

        if (dto.getInitialPassword() == null || dto.getInitialPassword().isBlank()) {
            throw new IllegalArgumentException("An initial password is required when creating an employee");
        }
        if (employeeRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Employee email already exists");
        }

        // patch existing employees that have no code
        for (Employee e : employeeRepository.findEmployeesWithoutCode()) {
            e.setEmployeeCode(generateEmployeeCode());
            employeeRepository.save(e);
        }

        Employee employee = Employee.builder()
                .employeeCode(generateEmployeeCode())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getInitialPassword()))
                .phone(dto.getPhone())
                .gender(dto.getGender())
                .designation(dto.getDesignation())
                .salary(dto.getSalary())
                .department(dto.getDepartment())
                .employmentType(dto.getEmploymentType())
                .active(true)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);
        employeeLeaveBalanceRepository.save(EmployeeLeaveBalance.builder()
            .employeeId(savedEmployee.getId())
            .casualLeaveBalance(5)
            .sickLeaveBalance(10)
            .earnedLeaveBalance(15)
            .compOffBalance(0)
            .wfhBalance(0)
            .build());

        return toResponseDto(savedEmployee);
    }

    @Override
    public List<EmployeeResponseDto> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Override
    public EmployeeResponseDto getEmployeeById(Long id) {
        return toResponseDto(
                employeeRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Employee Not Found"))
        );
    }

    @Override
    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto dto) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        employeeRepository.findByEmail(dto.getEmail())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new IllegalArgumentException("Employee email already exists"); });

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setGender(dto.getGender());
        employee.setDesignation(dto.getDesignation());
        employee.setSalary(dto.getSalary());
        employee.setDepartment(dto.getDepartment());
        employee.setEmploymentType(dto.getEmploymentType());
        // Allow bulk activate/deactivate — only update if explicitly provided
        if (dto.getActive() != null) {
            employee.setActive(dto.getActive());
        }
        if (dto.getInitialPassword() != null && !dto.getInitialPassword().isBlank()) {
            employee.setPasswordHash(passwordEncoder.encode(dto.getInitialPassword()));
        }

        return toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee Not Found");
        }
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));
        employee.setActive(false);
        employeeRepository.save(employee);
    }

    @Override
    public EmployeeResponseDto getMyProfile(Authentication authentication) {
        return toResponseDto(currentEmployee(authentication));
    }

    @Override
    @Transactional
    public EmployeeResponseDto updateMyProfile(Authentication authentication, EmployeeSelfUpdateDto dto) {
        Employee employee = currentEmployee(authentication);
        employeeRepository.findByEmail(dto.getEmail())
                .filter(existing -> !existing.getId().equals(employee.getId()))
                .ifPresent(existing -> { throw new IllegalArgumentException("Employee email already exists"); });
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setGender(dto.getGender());
        return toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public void resetPassword(Long id, EmployeePasswordResetDto dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));
        employee.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        employeeRepository.save(employee);
    }

    @Override
    public List<EmployeeBasicDto> getLeaveBackupEmployees(Authentication authentication) {
        Long currentId = currentEmployee(authentication).getId();
        return employeeRepository.findAll().stream()
                .filter(employee -> Boolean.TRUE.equals(employee.getActive()))
                .filter(employee -> !currentId.equals(employee.getId()))
                .map(employee -> EmployeeBasicDto.builder()
                        .id(employee.getId()).employeeCode(employee.getEmployeeCode())
                        .firstName(employee.getFirstName()).lastName(employee.getLastName())
                        .department(employee.getDepartment()).build())
                .toList();
    }

    private Employee currentEmployee(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Authenticated employee is required");
        }
        String subject = authentication.getName();
        return employeeRepository.findByEmployeeCode(subject)
                .or(() -> employeeRepository.findByEmail(subject))
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));
    }

    private EmployeeResponseDto toResponseDto(Employee e) {
        return EmployeeResponseDto.builder()
                .id(e.getId())
                .employeeCode(e.getEmployeeCode())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .gender(e.getGender())
                .designation(e.getDesignation())
                .salary(e.getSalary())
                .department(e.getDepartment())
                .employmentType(e.getEmploymentType())
                .active(e.getActive())
                .build();
    }
}
