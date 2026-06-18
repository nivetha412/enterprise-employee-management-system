package com.enterprise.backend.dto;

import lombok.Data;

@Data
public class EmployeeRequestDto {

    private String employeeCode;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String gender;

    private String designation;

    private Double salary;

    private String department;

    private String employmentType;
}