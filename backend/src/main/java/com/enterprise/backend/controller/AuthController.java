package com.enterprise.backend.controller;

import com.enterprise.backend.dto.RegisterUserDto;
import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.dto.LoginResponseDto;
import com.enterprise.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestBody RegisterUserDto dto) {

        System.out.println("REGISTER API HIT");

        authService.registerUser(dto);

        return ResponseEntity.ok("User Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @RequestBody LoginRequestDto dto) {

        return ResponseEntity.ok(authService.login(dto));
    }
}