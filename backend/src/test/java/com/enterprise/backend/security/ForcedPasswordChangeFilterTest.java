package com.enterprise.backend.security;

import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.enums.Role;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ForcedPasswordChangeFilterTest {
    @Mock private JwtService jwtService;
    @Mock private UserRepository userRepository;
    @Mock private EmployeeRepository employeeRepository;
    @Mock private FilterChain chain;

    @AfterEach
    void clearSecurityContext() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    void blocksEmployeeFeaturesUntilPasswordIsChanged() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userRepository, employeeRepository);
        Employee employee = Employee.builder().employeeCode("EMP001").active(true).mustChangePassword(true).build();
        when(jwtService.extractEmail("token")).thenReturn("EMP001");
        when(jwtService.extractRole("token")).thenReturn(Role.EMPLOYEE);
        when(employeeRepository.findByEmployeeCodeIgnoreCase("EMP001")).thenReturn(Optional.of(employee));

        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/attendance/employee/1");
        request.setServletPath("/api/attendance/employee/1");
        request.addHeader("Authorization", "Bearer token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);

        assertEquals(403, response.getStatus());
        verify(chain, never()).doFilter(any(), any());
    }

    @Test
    void allowsPasswordChangeEndpointWhilePasswordIsTemporary() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userRepository, employeeRepository);
        Employee employee = Employee.builder().employeeCode("EMP001").active(true).mustChangePassword(true).build();
        when(jwtService.extractEmail("token")).thenReturn("EMP001");
        when(jwtService.extractRole("token")).thenReturn(Role.EMPLOYEE);
        when(employeeRepository.findByEmployeeCodeIgnoreCase("EMP001")).thenReturn(Optional.of(employee));

        MockHttpServletRequest request = new MockHttpServletRequest("PUT", "/api/employees/me/password");
        request.setServletPath("/api/employees/me/password");
        request.addHeader("Authorization", "Bearer token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, chain);

        verify(chain).doFilter(any(), any());
        assertEquals(200, response.getStatus());
    }
}
