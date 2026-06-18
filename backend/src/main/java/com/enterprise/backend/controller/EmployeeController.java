package com.enterprise.backend.controller;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public EmployeeResponseDto createEmployee(
            @RequestBody EmployeeRequestDto dto) {

        return employeeService.createEmployee(dto);
    }

    @GetMapping
    public List<EmployeeResponseDto> getAllEmployees() {

        return employeeService.getAllEmployees();
    }
}