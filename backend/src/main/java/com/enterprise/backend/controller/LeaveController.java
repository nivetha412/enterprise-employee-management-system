package com.enterprise.backend.controller;

import com.enterprise.backend.dto.LeaveRequestDto;
import com.enterprise.backend.dto.LeaveResponseDto;
import com.enterprise.backend.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public LeaveResponseDto applyLeave(
            @RequestBody LeaveRequestDto dto, Authentication authentication) {

        return leaveService.applyLeave(dto, authentication);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<LeaveResponseDto> getAllLeaves() {

        return leaveService.getAllLeaves();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public List<LeaveResponseDto> getMyLeaves(Authentication authentication) {
        return leaveService.getMyLeaves(authentication);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
public LeaveResponseDto getLeaveById(
        @PathVariable Long id, Authentication authentication) {

    return leaveService.getLeaveById(id, authentication);
}
@DeleteMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public String deleteLeave(
        @PathVariable Long id, Authentication authentication) {

    leaveService.deleteLeave(id, authentication);

    return "Leave Deleted Successfully";
}
@PutMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public LeaveResponseDto updateLeave(
        @PathVariable Long id,
        @RequestBody LeaveRequestDto dto, Authentication authentication) {

    return leaveService.updateLeave(id, dto, authentication);
}
}
