package com.enterprise.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class DepartmentRequestDto {

    private String departmentCode;

    @NotBlank(message = "Department name is required")
    private String departmentName;

    private String description;

    private String managerName;

    private String location;

    private Boolean active;
}