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
}