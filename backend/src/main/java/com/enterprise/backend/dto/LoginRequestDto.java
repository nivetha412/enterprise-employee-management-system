package com.enterprise.backend.dto;

import lombok.Data;

@Data
public class LoginRequestDto {

    private String email;

    private String password;

    // Used when an employee logs in with their employee code
    private String employeeCode;

}