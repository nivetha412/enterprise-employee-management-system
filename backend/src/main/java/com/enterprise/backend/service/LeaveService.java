package com.enterprise.backend.service;

import com.enterprise.backend.dto.LeaveRequestDto;
import com.enterprise.backend.dto.LeaveResponseDto;
import com.enterprise.backend.entity.LeaveRequest;
import com.enterprise.backend.enums.LeaveStatus;
import com.enterprise.backend.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveResponseDto applyLeave(
            LeaveRequestDto dto) {

        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new RuntimeException("Start date cannot be after end date");
        }

        // backupEmployeeId is required only when applying (not when admin approves/rejects)
        if (dto.getBackupEmployeeId() == null) {
            throw new RuntimeException("Backup Employee Required");
        }

        if (dto.getEmployeeId().equals(dto.getBackupEmployeeId())) {
            throw new RuntimeException("Backup employee cannot be same employee");
        }

        int totalDays =
                (int) ChronoUnit.DAYS.between(
                        dto.getStartDate(),
                        dto.getEndDate()
                ) + 1;

        LeaveRequest leaveRequest =
                LeaveRequest.builder()

                        .employeeId(
                                dto.getEmployeeId())

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
public LeaveResponseDto getLeaveById(Long id) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    return mapToDto(leave);
}
public LeaveResponseDto updateLeave(
        Long id,
        LeaveRequestDto dto) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    // Admin approve/reject: only update status + remarks, skip field edits
    if (dto.getStatus() != null && dto.getStatus() != LeaveStatus.PENDING) {
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

public void deleteLeave(Long id) {

    LeaveRequest leave =
            leaveRequestRepository
                    .findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Leave Not Found"));

    leaveRequestRepository.delete(leave);
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