package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

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
                .phone(dto.getPhone())
                .gender(dto.getGender())
                .designation(dto.getDesignation())
                .salary(dto.getSalary())
                .department(dto.getDepartment())
                .employmentType(dto.getEmploymentType())
                .active(true)
                .build();

        return toResponseDto(employeeRepository.save(employee));
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

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPhone(dto.getPhone());
        employee.setGender(dto.getGender());
        employee.setDesignation(dto.getDesignation());
        employee.setSalary(dto.getSalary());
        employee.setDepartment(dto.getDepartment());
        employee.setEmploymentType(dto.getEmploymentType());

        return toResponseDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee Not Found");
        }
        employeeRepository.deleteById(id);
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