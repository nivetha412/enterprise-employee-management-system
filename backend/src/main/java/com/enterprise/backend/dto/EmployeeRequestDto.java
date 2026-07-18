package com.enterprise.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeRequestDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String phone;

    private String gender;

    @NotBlank(message = "Designation is required")
    private String designation;

    private Double salary;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    // Optional: used by bulk activate/deactivate
    private Boolean active;
}