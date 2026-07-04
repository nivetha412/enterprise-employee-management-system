package com.enterprise.backend.dto;

import com.enterprise.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {

    private String token;

    private String email;

    private Role role;

    private Long employeeId;

}