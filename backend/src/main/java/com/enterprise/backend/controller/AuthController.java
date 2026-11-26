package com.enterprise.backend.controller;

import com.enterprise.backend.dto.RegisterUserDto;
import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.dto.LoginResponseDto;
import com.enterprise.backend.dto.EmployeePasswordChangeDto;
import com.enterprise.backend.service.AuthService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.web.csrf.CsrfToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @org.springframework.beans.factory.annotation.Value("${app.auth.cookie-secure:false}")
    private boolean authCookieSecure;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @Valid @RequestBody RegisterUserDto dto) {

        authService.registerUser(dto);

        return ResponseEntity.ok("User Registered Successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto, HttpServletRequest request, HttpServletResponse response) {
        LoginResponseDto result = authService.login(dto, request.getRemoteAddr());
        ResponseCookie cookie = ResponseCookie.from("EMS_ACCESS", result.getToken())
                .httpOnly(true).secure(authCookieSecure)
                .sameSite(authCookieSecure ? "None" : "Lax")
                .path("/api").maxAge(Duration.ofHours(24)).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        result.setToken(null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/csrf")
    public Map<String, String> csrf(CsrfToken csrfToken) {
        return Map.of("token", csrfToken.getToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("EMS_ACCESS", "")
                .httpOnly(true).secure(authCookieSecure)
                .sameSite(authCookieSecure ? "None" : "Lax")
                .path("/api").maxAge(Duration.ZERO).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> changeAdminPassword(Authentication authentication,
            @Valid @RequestBody EmployeePasswordChangeDto dto) {
        authService.changeAdminPassword(authentication, dto);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring(5))
                .findFirst()
                .orElse(null);

        if (role == null || role.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No valid role found for authenticated user");
        }

        boolean mustChangePassword = "EMPLOYEE".equals(role)
                && employeeServiceMustChangePassword(authentication.getName());
        return ResponseEntity.ok(Map.of("role", role, "mustChangePassword", mustChangePassword));
    }

    private boolean employeeServiceMustChangePassword(String employeeCode) {
        return authService.mustChangePassword(employeeCode);
    }
}
