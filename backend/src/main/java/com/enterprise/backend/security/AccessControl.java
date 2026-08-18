package com.enterprise.backend.security;

import com.enterprise.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessControl")
@RequiredArgsConstructor
public class AccessControl {
    private final EmployeeRepository employees;

    public boolean ownsEmployee(Long employeeId, Authentication authentication) {
        if (authentication == null) return false;
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) return true;
        return employees.findByEmployeeCode(authentication.getName())
                .map(employee -> employee.getId().equals(employeeId))
                .orElse(false);
    }
}
