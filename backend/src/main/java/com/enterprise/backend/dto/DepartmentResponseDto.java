package com.enterprise.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DepartmentResponseDto {

    private Long id;

    private String departmentCode;

    private String departmentName;

    private String description;

    private String managerName;

    private String location;

    private Boolean active;

    private LocalDate createdDate;
}