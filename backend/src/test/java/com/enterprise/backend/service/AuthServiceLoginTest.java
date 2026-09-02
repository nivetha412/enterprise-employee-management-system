package com.enterprise.backend.service;

import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.enums.Role;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.repository.UserRepository;
import com.enterprise.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceLoginTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtService, employeeRepository);
    }

    @Test
    void adminLoginShouldNormalizeEmailBeforeLookup() {
        User user = new User();
        user.setEmail("admin@enterprise.com");
        user.setPassword("$2a$10$hashed");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmailIgnoreCase("admin@enterprise.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Admin@123", "$2a$10$hashed")).thenReturn(true);
        when(jwtService.generateToken("admin@enterprise.com", Role.ADMIN)).thenReturn("token-admin");

        var dto = new LoginRequestDto();
        dto.setEmail("ADMIN@Enterprise.com");
        dto.setPassword("Admin@123");

        var response = authService.login(dto);

        assertEquals("token-admin", response.getToken());
        assertEquals("ADMIN", response.getRole());
        verify(userRepository).findByEmailIgnoreCase("admin@enterprise.com");
    }

    @Test
    void employeeLoginShouldNormalizeEmployeeCodeBeforeLookup() {
        Employee employee = new Employee();
        employee.setId(42L);
        employee.setEmployeeCode("EMP001");
        employee.setPasswordHash("$2a$10$hashed");
        employee.setActive(true);

        when(employeeRepository.findByEmployeeCodeIgnoreCase("EMP001")).thenReturn(Optional.of(employee));
        when(passwordEncoder.matches("Emp001", "$2a$10$hashed")).thenReturn(true);
        when(jwtService.generateToken("EMP001", Role.EMPLOYEE)).thenReturn("token-employee");

        var dto = new LoginRequestDto();
        dto.setEmployeeCode("emp001");
        dto.setPassword("Emp001");

        var response = authService.login(dto);

        assertEquals("token-employee", response.getToken());
        assertEquals("EMPLOYEE", response.getRole());
        verify(employeeRepository).findByEmployeeCodeIgnoreCase("EMP001");
    }
}
