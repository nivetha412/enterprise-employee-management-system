package com.enterprise.backend.service;

import com.enterprise.backend.dto.DepartmentRequestDto;
import com.enterprise.backend.dto.DepartmentResponseDto;

import java.util.List;

public interface DepartmentService {

    DepartmentResponseDto createDepartment(
            DepartmentRequestDto dto);

    List<DepartmentResponseDto> getAllDepartments();
    DepartmentResponseDto getDepartmentById(Long id);
    DepartmentResponseDto updateDepartment(Long id,DepartmentRequestDto dto);
void deleteDepartment(Long id);
}