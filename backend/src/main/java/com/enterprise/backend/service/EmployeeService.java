package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;

import java.util.List;

public interface EmployeeService {

    EmployeeResponseDto createEmployee(EmployeeRequestDto dto);

    List<EmployeeResponseDto> getAllEmployees();
  

    EmployeeResponseDto getEmployeeById(Long id);
 
    EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto dto);
    
     void deleteEmployee(Long id);

    String generateNextCode();

}