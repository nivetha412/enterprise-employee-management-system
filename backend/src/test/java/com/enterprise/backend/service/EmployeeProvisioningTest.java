package com.enterprise.backend.service;

import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.entity.Department;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.repository.DepartmentRepository;
import com.enterprise.backend.repository.EmployeeLeaveBalanceRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeProvisioningTest {
    @Mock private EmployeeRepository employeeRepository;
    @Mock private EmployeeLeaveBalanceRepository balanceRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private PasswordEncoder passwordEncoder;

    @Test
    void createEmployeeUsesRandomTemporaryPasswordAndStoresOnlyHash() {
        EmployeeServiceImpl service = new EmployeeServiceImpl(
                employeeRepository, balanceRepository, departmentRepository, passwordEncoder);
        Department department = Department.builder().id(3L).departmentName("Engineering").build();
        EmployeeRequestDto request = new EmployeeRequestDto();
        request.setFirstName("Asha");
        request.setLastName("Rao");
        request.setEmail("asha@example.com");
        request.setDesignation("Engineer");
        request.setDepartment("Engineering");
        request.setEmploymentType("FULL_TIME");

        when(employeeRepository.findByEmail("asha@example.com")).thenReturn(Optional.empty());
        when(departmentRepository.findByDepartmentNameIgnoreCase("Engineering")).thenReturn(Optional.of(department));
        when(employeeRepository.findEmployeesWithoutCode()).thenReturn(List.of());
        when(employeeRepository.findMaxEmpCodeSequence()).thenReturn(0L);
        when(employeeRepository.existsByEmployeeCode("EMP001")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("bcrypt-only");
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.createEmployee(request);

        assertEquals("EMP001", response.getEmployee().getEmployeeCode());
        assertNotNull(response.getTemporaryPassword());
        assertEquals(32, response.getTemporaryPassword().length());
        assertNotEquals(response.getEmployee().getEmployeeCode(), response.getTemporaryPassword());
        verify(passwordEncoder).encode(response.getTemporaryPassword());
        ArgumentCaptor<Employee> savedEmployee = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(savedEmployee.capture());
        assertEquals("bcrypt-only", savedEmployee.getValue().getPasswordHash());
        assertTrue(savedEmployee.getValue().getMustChangePassword());
    }
}
