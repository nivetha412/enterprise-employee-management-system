package com.enterprise.backend.service;

import com.enterprise.backend.dto.LeaveRequestDto;
import com.enterprise.backend.dto.LeaveResponseDto;
import com.enterprise.backend.entity.LeaveRequest;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.repository.LeaveRequestRepository;
import com.enterprise.backend.repository.EmployeeLeaveBalanceRepository;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.entity.EmployeeLeaveBalance;
import com.enterprise.backend.dto.EmployeeLeaveBalanceResponseDto;
import com.enterprise.backend.exception.LeaveConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.time.Clock;
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
    private final EmployeeLeaveBalanceRepository employeeLeaveBalanceRepository;
    private final Clock businessClock;

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
                                LocalDate.now(businessClock))

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
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToDto).toList();
    }

    public EmployeeLeaveBalanceResponseDto getMyLeaveBalance(Authentication authentication) {
        Long employeeId = currentEmployee(authentication).getId();
        EmployeeLeaveBalance balance = employeeLeaveBalanceRepository.findFirstByEmployeeId(employeeId)
                .orElse(null);
        return EmployeeLeaveBalanceResponseDto.builder()
                .casualLeaveBalance(balance != null ? balance.getCasualLeaveBalance() : 0)
                .sickLeaveBalance(balance != null ? balance.getSickLeaveBalance() : 0)
                .earnedLeaveBalance(balance != null ? balance.getEarnedLeaveBalance() : 0)
                .compOffBalance(balance != null ? balance.getCompOffBalance() : 0)
                .wfhBalance(balance != null ? balance.getWfhBalance() : 0)
                .build();
    }

public LeaveResponseDto getLeaveById(Long id, Authentication authentication) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new com.enterprise.backend.exception.ResourceNotFoundException("Leave request was not found"));

    assertAdminOrOwner(leave, authentication);
    return mapToDto(leave);
}
@Transactional
public LeaveResponseDto updateLeave(
        Long id,
        LeaveRequestDto dto, Authentication authentication) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findByIdForUpdate(id)
                    .orElseThrow(() ->
                            new com.enterprise.backend.exception.ResourceNotFoundException("Leave request was not found"));

    boolean admin = isAdmin(authentication);
    assertAdminOrOwner(leave, authentication);

    // Only an admin may approve, reject, or cancel another employee's leave.
    if (dto.getStatus() != null && dto.getStatus() != LeaveStatus.PENDING) {
        if (!admin) {
            throw new AccessDeniedException("Only an administrator can change leave status");
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Only pending leave requests can be approved or rejected");
        }
        if (dto.getStatus() == LeaveStatus.APPROVED) {
            deductLeaveBalance(leave);
        }
        leave.setStatus(dto.getStatus());
        if (dto.getManagerRemarks() != null) {
            leave.setManagerRemarks(dto.getManagerRemarks());
        }
        if (dto.getHrRemarks() != null) {
            leave.setHrRemarks(dto.getHrRemarks());
        }
        if (dto.getStatus() == LeaveStatus.APPROVED) {
            leave.setApprovedDate(LocalDate.now(businessClock));
        }
        return mapToDto(leaveRequestRepository.save(leave));
    }

    // Regular edit: only allowed while PENDING
    if (leave.getStatus() != LeaveStatus.PENDING) {
        throw new com.enterprise.backend.exception.BusinessRuleException(
                "Only Pending Leave Can Be Updated");
    }

    validateLeave(dto, leave.getEmployeeId(), false, leave.getId());
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
                    .findByIdForUpdate(id)
                    .orElseThrow(() ->
                            new com.enterprise.backend.exception.ResourceNotFoundException("Leave request was not found"));

    assertAdminOrOwner(leave, authentication);
    if (!isAdmin(authentication) && leave.getStatus() != LeaveStatus.PENDING) {
        throw new AccessDeniedException("Only pending leave requests can be cancelled");
    }
    if (!isAdmin(authentication)) {
        leave.setStatus(LeaveStatus.CANCELLED);
        leaveRequestRepository.save(leave);
        return;
    }
    if (isAdmin(authentication) && leave.getStatus() == LeaveStatus.APPROVED) {
        restoreLeaveBalance(leave);
    }
    leaveRequestRepository.delete(leave);
}

    private void validateLeave(LeaveRequestDto dto, Long employeeId, boolean applying, Long excludedLeaveId) {
        if (dto.getLeaveType() == null || dto.getStartDate() == null || dto.getEndDate() == null
                || dto.getReason() == null || dto.getReason().isBlank() || dto.getPriority() == null) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Leave type, dates, reason, and priority are required");
        }
        if (dto.getStartDate().isBefore(LocalDate.now(businessClock))) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Leave cannot start in the past");
        }
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Start date cannot be after end date");
        }
        if (applying && dto.getBackupEmployeeId() == null) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Backup employee is required");
        }
        if (dto.getBackupEmployeeId() != null) {
            if (employeeId.equals(dto.getBackupEmployeeId())) {
                throw new com.enterprise.backend.exception.BusinessRuleException("Backup employee cannot be the same employee");
            }
            Employee backup = employeeRepository.findById(dto.getBackupEmployeeId())
                    .orElseThrow(() -> new com.enterprise.backend.exception.ResourceNotFoundException("Backup employee was not found"));
            if (!Boolean.TRUE.equals(backup.getActive())) {
                throw new com.enterprise.backend.exception.BusinessRuleException("Backup employee must be active");
            }
        }
        boolean overlaps = leaveRequestRepository
            .findByEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                employeeId, dto.getEndDate(), dto.getStartDate())
            .stream().anyMatch(existing ->
                (excludedLeaveId == null || !excludedLeaveId.equals(existing.getId()))
                        && existing.getStatus() != LeaveStatus.REJECTED
                        && existing.getStatus() != LeaveStatus.CANCELLED
            );
        if (overlaps) {
            throw new LeaveConflictException("Leave dates conflict with an existing leave request");
        }
    }

    private EmployeeLeaveBalance lockBalance(Long employeeId) {
        List<EmployeeLeaveBalance> balances = employeeLeaveBalanceRepository.lockAllByEmployeeId(employeeId);
        if (balances.isEmpty()) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Leave balance is not available for this employee");
        }
        if (balances.size() > 1) {
            throw new com.enterprise.backend.exception.BusinessRuleException(
                    "Multiple leave balance records require data reconciliation before this operation");
        }
        return balances.get(0);
    }

    private void deductLeaveBalance(LeaveRequest leave) {
        EmployeeLeaveBalance balance = lockBalance(leave.getEmployeeId());
        int days = leave.getTotalDays();
        Integer remaining;
        switch (leave.getLeaveType()) {
            case CASUAL_LEAVE -> {
                remaining = balance.getCasualLeaveBalance();
                if (remaining == null || remaining < days) throw new com.enterprise.backend.exception.BusinessRuleException("Insufficient casual leave balance");
                balance.setCasualLeaveBalance(remaining - days);
            }
            case SICK_LEAVE -> {
                remaining = balance.getSickLeaveBalance();
                if (remaining == null || remaining < days) throw new com.enterprise.backend.exception.BusinessRuleException("Insufficient sick leave balance");
                balance.setSickLeaveBalance(remaining - days);
            }
            case EARNED_LEAVE -> {
                remaining = balance.getEarnedLeaveBalance();
                if (remaining == null || remaining < days) throw new com.enterprise.backend.exception.BusinessRuleException("Insufficient earned leave balance");
                balance.setEarnedLeaveBalance(remaining - days);
            }
            case COMP_OFF -> {
                remaining = balance.getCompOffBalance();
                if (remaining == null || remaining < days) throw new com.enterprise.backend.exception.BusinessRuleException("Insufficient comp-off balance");
                balance.setCompOffBalance(remaining - days);
            }
            case WORK_FROM_HOME -> {
                remaining = balance.getWfhBalance();
                if (remaining == null || remaining < days) throw new com.enterprise.backend.exception.BusinessRuleException("Insufficient work-from-home balance");
                balance.setWfhBalance(remaining - days);
            }
            case LOSS_OF_PAY -> { return; }
        }
        employeeLeaveBalanceRepository.save(balance);
    }

    private void restoreLeaveBalance(LeaveRequest leave) {
        EmployeeLeaveBalance balance = lockBalance(leave.getEmployeeId());
        int days = leave.getTotalDays();
        switch (leave.getLeaveType()) {
            case CASUAL_LEAVE -> balance.setCasualLeaveBalance((balance.getCasualLeaveBalance() == null ? 0 : balance.getCasualLeaveBalance()) + days);
            case SICK_LEAVE -> balance.setSickLeaveBalance((balance.getSickLeaveBalance() == null ? 0 : balance.getSickLeaveBalance()) + days);
            case EARNED_LEAVE -> balance.setEarnedLeaveBalance((balance.getEarnedLeaveBalance() == null ? 0 : balance.getEarnedLeaveBalance()) + days);
            case COMP_OFF -> balance.setCompOffBalance((balance.getCompOffBalance() == null ? 0 : balance.getCompOffBalance()) + days);
            case WORK_FROM_HOME -> balance.setWfhBalance((balance.getWfhBalance() == null ? 0 : balance.getWfhBalance()) + days);
            case LOSS_OF_PAY -> { return; }
        }
        employeeLeaveBalanceRepository.save(balance);
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
