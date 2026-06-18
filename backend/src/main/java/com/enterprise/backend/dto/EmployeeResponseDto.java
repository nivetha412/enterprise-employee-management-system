package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EmployeeResponseDto {

    private Long id;

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String designation;

    private String department;

    private Boolean active;
}