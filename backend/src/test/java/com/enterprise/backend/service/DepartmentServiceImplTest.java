package com.enterprise.backend.service;

import com.enterprise.backend.dto.DepartmentRequestDto;
import com.enterprise.backend.entity.Department;
import com.enterprise.backend.repository.DepartmentRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    @Test
    void blocksDeletionWhenEmployeesAreAssigned() {
        Department department = Department.builder().id(7L).departmentName("Engineering").build();
        when(departmentRepository.findById(7L)).thenReturn(Optional.of(department));
        when(employeeRepository.countByDepartmentEntityId(7L)).thenReturn(1L);

        assertThrows(IllegalArgumentException.class, () -> departmentService.deleteDepartment(7L));

        verify(departmentRepository, never()).delete(department);
    }

    @Test
    void updatesLegacyDisplayTextWhenDepartmentIsRenamed() {
        Department department = Department.builder().id(7L).departmentName("Engineering").build();
        DepartmentRequestDto request = new DepartmentRequestDto();
        request.setDepartmentName("Product Engineering");
        when(departmentRepository.findById(7L)).thenReturn(Optional.of(department));
        when(departmentRepository.save(department)).thenReturn(department);

        departmentService.updateDepartment(7L, request);

        verify(employeeRepository).updateLegacyDepartmentNameByDepartmentEntityId(7L, "Product Engineering");
    }
}
