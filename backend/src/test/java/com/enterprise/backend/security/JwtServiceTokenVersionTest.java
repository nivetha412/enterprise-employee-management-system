package com.enterprise.backend.security;

import com.enterprise.backend.enums.Role;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JwtServiceTokenVersionTest {
    @Test
    void tokenCarriesAccountVersion() {
        JwtService service = new JwtService("0123456789abcdef0123456789abcdef");
        String token = service.generateToken("EMP001", Role.EMPLOYEE, 7L);

        assertEquals(7L, service.extractTokenVersion(token));
    }
}