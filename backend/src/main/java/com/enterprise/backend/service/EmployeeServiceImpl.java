package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeeResponseDto createEmployee(EmployeeRequestDto dto) {

        Employee employee = Employee.builder()
                .employeeCode(dto.getEmployeeCode())
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

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeResponseDto.builder()
                .id(savedEmployee.getId())
                .employeeCode(savedEmployee.getEmployeeCode())
                .firstName(savedEmployee.getFirstName())
                .lastName(savedEmployee.getLastName())
                .email(savedEmployee.getEmail())
                .designation(savedEmployee.getDesignation())
                .department(savedEmployee.getDepartment())
                .active(savedEmployee.getActive())
                .build();
    }

    @Override
    public List<EmployeeResponseDto> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(employee -> EmployeeResponseDto.builder()
                        .id(employee.getId())
                        .employeeCode(employee.getEmployeeCode())
                        .firstName(employee.getFirstName())
                        .lastName(employee.getLastName())
                        .email(employee.getEmail())
                        .designation(employee.getDesignation())
                        .department(employee.getDepartment())
                        .active(employee.getActive())
                        .build())
                .toList();
    }

      @Override
public EmployeeResponseDto getEmployeeById(Long id) {

    Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

    return EmployeeResponseDto.builder()
            .id(employee.getId())
            .employeeCode(employee.getEmployeeCode())
            .firstName(employee.getFirstName())
            .lastName(employee.getLastName())
            .email(employee.getEmail())
            .designation(employee.getDesignation())
            .department(employee.getDepartment())
            .active(employee.getActive())
            .build();
}


@Override
public EmployeeResponseDto updateEmployee(
        Long id,
        EmployeeRequestDto dto) {

    Employee employee = employeeRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Employee Not Found"));

    employee.setEmployeeCode(dto.getEmployeeCode());
    employee.setFirstName(dto.getFirstName());
    employee.setLastName(dto.getLastName());
    employee.setEmail(dto.getEmail());
    employee.setPhone(dto.getPhone());
    employee.setGender(dto.getGender());
    employee.setDesignation(dto.getDesignation());
    employee.setSalary(dto.getSalary());
    employee.setDepartment(dto.getDepartment());
    employee.setEmploymentType(dto.getEmploymentType());

    Employee updatedEmployee =
            employeeRepository.save(employee);

    return EmployeeResponseDto.builder()
            .id(updatedEmployee.getId())
            .employeeCode(updatedEmployee.getEmployeeCode())
            .firstName(updatedEmployee.getFirstName())
            .lastName(updatedEmployee.getLastName())
            .email(updatedEmployee.getEmail())
            .designation(updatedEmployee.getDesignation())
            .department(updatedEmployee.getDepartment())
            .active(updatedEmployee.getActive())
            .build();
}

  @Override
public void deleteEmployee(Long id) {

    Employee employee = employeeRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Employee Not Found"));

    employeeRepository.delete(employee);
}
}