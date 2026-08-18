package com.enterprise.backend.service;

import com.enterprise.backend.dto.LeaveRequestDto;
import com.enterprise.backend.dto.LeaveResponseDto;
import com.enterprise.backend.entity.LeaveRequest;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.repository.LeaveRequestRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.entity.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public LeaveResponseDto applyLeave(LeaveRequestDto dto, Authentication authentication) {
        Long employeeId = currentEmployee(authentication).getId();
        validateLeave(dto, employeeId, true, null);

        int totalDays =
                (int) ChronoUnit.DAYS.between(
                        dto.getStartDate(),
                        dto.getEndDate()
                ) + 1;

        LeaveRequest leaveRequest =
                LeaveRequest.builder()

                        .employeeId(employeeId)

                        .leaveType(
                                dto.getLeaveType())

                        .startDate(
                                dto.getStartDate())

                        .endDate(
                                dto.getEndDate())

                        .totalDays(totalDays)

                        .reason(
                                dto.getReason())

                        .priority(
                                dto.getPriority())

                        .backupEmployeeId(
                                dto.getBackupEmployeeId())

                        .status(
                                LeaveStatus.PENDING)

                        .appliedDate(
                                LocalDate.now())

                        .build();

        LeaveRequest savedLeave =
                leaveRequestRepository
                        .save(leaveRequest);

        return mapToDto(savedLeave);
    }

    public List<LeaveResponseDto>
    getAllLeaves() {

        return leaveRequestRepository
                .findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getMyLeaves(Authentication authentication) {
        Long employeeId = currentEmployee(authentication).getId();
        return leaveRequestRepository.findAll().stream()
                .filter(leave -> employeeId.equals(leave.getEmployeeId()))
                .map(this::mapToDto).toList();
    }

public LeaveResponseDto getLeaveById(Long id, Authentication authentication) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    assertAdminOrOwner(leave, authentication);
    return mapToDto(leave);
}
@Transactional
public LeaveResponseDto updateLeave(
        Long id,
        LeaveRequestDto dto, Authentication authentication) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    boolean admin = isAdmin(authentication);
    assertAdminOrOwner(leave, authentication);

    // Only an admin may approve, reject, or cancel another employee's leave.
    if (dto.getStatus() != null && dto.getStatus() != LeaveStatus.PENDING) {
        if (!admin) {
            throw new AccessDeniedException("Only an administrator can change leave status");
        }
        leave.setStatus(dto.getStatus());
        if (dto.getManagerRemarks() != null) {
            leave.setManagerRemarks(dto.getManagerRemarks());
        }
        if (dto.getHrRemarks() != null) {
            leave.setHrRemarks(dto.getHrRemarks());
        }
        if (dto.getStatus() == LeaveStatus.APPROVED) {
            leave.setApprovedDate(LocalDate.now());
        }
        return mapToDto(leaveRequestRepository.save(leave));
    }

    // Regular edit: only allowed while PENDING
    if (leave.getStatus() != LeaveStatus.PENDING) {
        throw new RuntimeException(
                "Only Pending Leave Can Be Updated");
    }

    if (!admin) {
        validateLeave(dto, leave.getEmployeeId(), false, leave.getId());
    }
    int totalDays =
            (int) ChronoUnit.DAYS.between(
                    dto.getStartDate(),
                    dto.getEndDate()) + 1;

    leave.setLeaveType(dto.getLeaveType());
    leave.setStartDate(dto.getStartDate());
    leave.setEndDate(dto.getEndDate());
    leave.setReason(dto.getReason());
    leave.setPriority(dto.getPriority());
    if (dto.getBackupEmployeeId() != null) {
        leave.setBackupEmployeeId(dto.getBackupEmployeeId());
    }
    leave.setTotalDays(totalDays);

    return mapToDto(leaveRequestRepository.save(leave));
}

@Transactional
public void deleteLeave(Long id, Authentication authentication) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    assertAdminOrOwner(leave, authentication);
    if (!isAdmin(authentication) && leave.getStatus() != LeaveStatus.PENDING) {
        throw new AccessDeniedException("Only pending leave requests can be cancelled");
    }
    leaveRequestRepository.delete(leave);
}

    private void validateLeave(LeaveRequestDto dto, Long employeeId, boolean applying, Long excludedLeaveId) {
        if (dto.getLeaveType() == null || dto.getStartDate() == null || dto.getEndDate() == null
                || dto.getReason() == null || dto.getReason().isBlank() || dto.getPriority() == null) {
            throw new IllegalArgumentException("Leave type, dates, reason, and priority are required");
        }
        if (dto.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Leave cannot start in the past");
        }
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        if (applying && dto.getBackupEmployeeId() == null) {
            throw new IllegalArgumentException("Backup employee is required");
        }
        if (dto.getBackupEmployeeId() != null) {
            if (employeeId.equals(dto.getBackupEmployeeId())) {
                throw new IllegalArgumentException("Backup employee cannot be the same employee");
            }
            Employee backup = employeeRepository.findById(dto.getBackupEmployeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Backup employee not found"));
            if (!Boolean.TRUE.equals(backup.getActive())) {
                throw new IllegalArgumentException("Backup employee must be active");
            }
        }
        boolean overlaps = leaveRequestRepository.findAll().stream().anyMatch(existing ->
                employeeId.equals(existing.getEmployeeId())
                        && (excludedLeaveId == null || !excludedLeaveId.equals(existing.getId()))
                        && existing.getStatus() != LeaveStatus.REJECTED
                        && existing.getStatus() != LeaveStatus.CANCELLED
                        && !dto.getEndDate().isBefore(existing.getStartDate())
                        && !dto.getStartDate().isAfter(existing.getEndDate()));
        if (overlaps) {
            throw new IllegalArgumentException("Leave dates conflict with an existing leave request");
        }
    }

    private Employee currentEmployee(Authentication authentication) {
        if (authentication == null) throw new AccessDeniedException("Authentication is required");
        return employeeRepository.findByEmployeeCode(authentication.getName())
                .or(() -> employeeRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new AccessDeniedException("Employee profile is required"));
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private void assertAdminOrOwner(LeaveRequest leave, Authentication authentication) {
        if (isAdmin(authentication)) return;
        if (!currentEmployee(authentication).getId().equals(leave.getEmployeeId())) {
            throw new AccessDeniedException("You do not have access to this leave request");
        }
    }

    private LeaveResponseDto mapToDto(
            LeaveRequest leave) {

        return LeaveResponseDto.builder()

                .id(leave.getId())

                .employeeId(
                        leave.getEmployeeId())

                .leaveType(
                        leave.getLeaveType())

                .startDate(
                        leave.getStartDate())

                .endDate(
                        leave.getEndDate())

                .totalDays(
                        leave.getTotalDays())

                .reason(
                        leave.getReason())

                .priority(
                        leave.getPriority())

                .status(
                        leave.getStatus())

                .backupEmployeeId(
                        leave.getBackupEmployeeId())

                .managerRemarks(
                        leave.getManagerRemarks())

                .hrRemarks(
                        leave.getHrRemarks())

                .appliedDate(
                        leave.getAppliedDate())

                .approvedDate(
                        leave.getApprovedDate())

                .build();
    }
}
