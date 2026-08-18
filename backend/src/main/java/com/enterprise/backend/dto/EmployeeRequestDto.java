package com.enterprise.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    /** Admin-provided one-time initial password. It is BCrypt-hashed and never returned. */
    @Size(min = 12, max = 128, message = "Initial password must be between 12 and 128 characters")
    private String initialPassword;
}
