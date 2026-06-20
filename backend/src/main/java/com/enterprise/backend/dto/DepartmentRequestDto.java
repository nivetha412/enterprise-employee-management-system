package com.enterprise.backend.dto;

import lombok.Data;

@Data
public class DepartmentRequestDto {

    private String departmentCode;

    private String departmentName;

    private String description;

    private String managerName;

    private String location;
}