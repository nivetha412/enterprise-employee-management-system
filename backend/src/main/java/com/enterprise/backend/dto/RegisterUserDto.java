package com.enterprise.backend.dto;

import com.enterprise.backend.enums.Role;
import lombok.Data;

@Data
public class RegisterUserDto {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private Role role;
}