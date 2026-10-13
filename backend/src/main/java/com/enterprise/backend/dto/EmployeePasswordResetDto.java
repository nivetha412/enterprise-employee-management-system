package com.enterprise.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeePasswordResetDto {
    @NotBlank(message = "Password is required")
    private String password;
}
