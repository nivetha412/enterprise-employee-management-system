package com.enterprise.backend.service;

import com.enterprise.backend.dto.DepartmentRequestDto;
import com.enterprise.backend.dto.DepartmentResponseDto;
import com.enterprise.backend.entity.Department;
import com.enterprise.backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentResponseDto createDepartment(
            DepartmentRequestDto dto) {

        Department department = Department.builder()
                .departmentCode(dto.getDepartmentCode())
                .departmentName(dto.getDepartmentName())
                .description(dto.getDescription())
                .managerName(dto.getManagerName())
                .location(dto.getLocation())
                .active(true)
                .createdDate(LocalDate.now())
                .build();

        Department savedDepartment =
                departmentRepository.save(department);

        return DepartmentResponseDto.builder()
                .id(savedDepartment.getId())
                .departmentCode(savedDepartment.getDepartmentCode())
                .departmentName(savedDepartment.getDepartmentName())
                .description(savedDepartment.getDescription())
                .managerName(savedDepartment.getManagerName())
                .location(savedDepartment.getLocation())
                .active(savedDepartment.getActive())
                .createdDate(savedDepartment.getCreatedDate())
                .build();
    }

    @Override
    public List<DepartmentResponseDto> getAllDepartments() {

        return departmentRepository.findAll()
                .stream()
                .map(department -> DepartmentResponseDto.builder()
                        .id(department.getId())
                        .departmentCode(department.getDepartmentCode())
                        .departmentName(department.getDepartmentName())
                        .description(department.getDescription())
                        .managerName(department.getManagerName())
                        .location(department.getLocation())
                        .active(department.getActive())
                        .createdDate(department.getCreatedDate())
                        .build())
                .toList();
    }

    @Override
public DepartmentResponseDto getDepartmentById(Long id) {

    Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

    return DepartmentResponseDto.builder()
            .id(department.getId())
            .departmentCode(department.getDepartmentCode())
            .departmentName(department.getDepartmentName())
            .description(department.getDescription())
            .managerName(department.getManagerName())
            .location(department.getLocation())
            .active(department.getActive())
            .createdDate(department.getCreatedDate())
            .build();
}
@Override
public DepartmentResponseDto updateDepartment(
        Long id,
        DepartmentRequestDto dto) {

    Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

    department.setDepartmentCode(dto.getDepartmentCode());
    department.setDepartmentName(dto.getDepartmentName());
    department.setDescription(dto.getDescription());
    department.setManagerName(dto.getManagerName());
    department.setLocation(dto.getLocation());

    Department updatedDepartment =
            departmentRepository.save(department);

    return DepartmentResponseDto.builder()
            .id(updatedDepartment.getId())
            .departmentCode(updatedDepartment.getDepartmentCode())
            .departmentName(updatedDepartment.getDepartmentName())
            .description(updatedDepartment.getDescription())
            .managerName(updatedDepartment.getManagerName())
            .location(updatedDepartment.getLocation())
            .active(updatedDepartment.getActive())
            .createdDate(updatedDepartment.getCreatedDate())
            .build();
}

@Override
public void deleteDepartment(Long id) {

    Department department = departmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

    departmentRepository.delete(department);
}
}