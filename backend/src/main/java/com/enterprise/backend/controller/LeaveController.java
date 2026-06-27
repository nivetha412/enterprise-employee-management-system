package com.enterprise.backend.controller;

import com.enterprise.backend.dto.LeaveRequestDto;
import com.enterprise.backend.dto.LeaveResponseDto;
import com.enterprise.backend.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public LeaveResponseDto applyLeave(
            @RequestBody LeaveRequestDto dto) {

        return leaveService.applyLeave(dto);
    }

    @GetMapping
    public List<LeaveResponseDto> getAllLeaves() {

        return leaveService.getAllLeaves();
    }

    @GetMapping("/{id}")
public LeaveResponseDto getLeaveById(
        @PathVariable Long id) {

    return leaveService.getLeaveById(id);
}
@DeleteMapping("/{id}")
public String deleteLeave(
        @PathVariable Long id) {

    leaveService.deleteLeave(id);

    return "Leave Deleted Successfully";
}
@PutMapping("/{id}")
public LeaveResponseDto updateLeave(
        @PathVariable Long id,
        @RequestBody LeaveRequestDto dto) {

    return leaveService.updateLeave(id, dto);
}
}