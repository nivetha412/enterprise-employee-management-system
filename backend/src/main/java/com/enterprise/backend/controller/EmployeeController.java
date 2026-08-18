package com.enterprise.backend.controller;
import com.enterprise.backend.dto.EmployeeRequestDto;
import com.enterprise.backend.dto.EmployeeResponseDto;
import com.enterprise.backend.dto.EmployeeSelfUpdateDto;
import com.enterprise.backend.dto.EmployeePasswordResetDto;
import com.enterprise.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDto> getMe(Authentication authentication) {
        return ResponseEntity.ok(employeeService.getMyProfile(authentication));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<EmployeeResponseDto> updateMe(
            Authentication authentication, @Valid @RequestBody EmployeeSelfUpdateDto dto) {
        return ResponseEntity.ok(employeeService.updateMyProfile(authentication, dto));
    }

    @GetMapping("/leave-backups")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<com.enterprise.backend.dto.EmployeeBasicDto>> getLeaveBackupEmployees(
            Authentication authentication) {
        return ResponseEntity.ok(employeeService.getLeaveBackupEmployees(authentication));
    }

    @GetMapping("/next-code")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getNextCode() {
        return ResponseEntity.ok(employeeService.generateNextCode());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDto> createEmployee(@Valid @RequestBody EmployeeRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.createEmployee(dto));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmployeeResponseDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeResponseDto> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeRequestDto dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id,
            @Valid @RequestBody EmployeePasswordResetDto dto) {
        employeeService.resetPassword(id, dto);
        return ResponseEntity.noContent().build();
    }
}
