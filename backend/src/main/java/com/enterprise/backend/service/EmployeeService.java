package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.dto.EmployeeSelfUpdateDto;
import com.enterprise.backend.dto.EmployeePasswordResetDto;
import com.enterprise.backend.dto.EmployeeBasicDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface EmployeeService {

    EmployeeResponseDto createEmployee(EmployeeRequestDto dto);

    List<EmployeeResponseDto> getAllEmployees();
  

    EmployeeResponseDto getEmployeeById(Long id);
 
    EmployeeResponseDto updateEmployee(Long id, EmployeeRequestDto dto);
    
     void deleteEmployee(Long id);

    String generateNextCode();

    EmployeeResponseDto getMyProfile(Authentication authentication);

    EmployeeResponseDto updateMyProfile(Authentication authentication, EmployeeSelfUpdateDto dto);

    void resetPassword(Long id, EmployeePasswordResetDto dto);

    List<EmployeeBasicDto> getLeaveBackupEmployees(Authentication authentication);

}
