package com.enterprise.backend.controller;

import com.enterprise.backend.dto.DepartmentRequestDto;
import com.enterprise.backend.dto.DepartmentResponseDto;
import com.enterprise.backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DepartmentResponseDto createDepartment(
            @RequestBody DepartmentRequestDto dto) {

        return departmentService.createDepartment(dto);
    }

    @GetMapping
    public List<DepartmentResponseDto> getAllDepartments() {

        return departmentService.getAllDepartments();
    }
    @GetMapping("/{id}")
public DepartmentResponseDto getDepartmentById(
        @PathVariable Long id) {

    return departmentService.getDepartmentById(id);
}

@PutMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public DepartmentResponseDto updateDepartment(
        @PathVariable Long id,
        @RequestBody DepartmentRequestDto dto) {

    return departmentService.updateDepartment(id, dto);
}

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public String deleteDepartment(
        @PathVariable Long id) {

    departmentService.deleteDepartment(id);

    return "Department Deleted Successfully";
}
}
