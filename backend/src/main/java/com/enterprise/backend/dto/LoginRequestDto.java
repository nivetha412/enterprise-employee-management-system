package com.enterprise.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class LoginRequestDto {

    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email is too long")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(max = 72, message = "Password is too long")
    private String password;

    // Used when an employee logs in with their employee code
    @Size(max = 50, message = "Employee code is too long")
    private String employeeCode;

    @AssertTrue(message = "Provide either an email or an employee code")
    public boolean isLoginIdentifierProvided() {
        return hasText(email) ^ hasText(employeeCode);
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

}
