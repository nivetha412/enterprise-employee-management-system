package com.enterprise.backend.service;

import com.enterprise.backend.dto.RegisterUserDto;
import com.enterprise.backend.entity.Employee;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.repository.EmployeeRepository;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.dto.LoginResponseDto;
import com.enterprise.backend.security.JwtService;
import com.enterprise.backend.exception.InvalidCredentialsException;
import com.enterprise.backend.dto.EmployeePasswordChangeDto;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;
    private final LoginAttemptService loginAttemptService;

    public void registerUser(RegisterUserDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new com.enterprise.backend.exception.BusinessRuleException("Email already exists");
        }
        User user = User.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .active(true)
                .build();
        userRepository.save(user);
    }

    public LoginResponseDto login(LoginRequestDto dto) {
        return login(dto, "unknown");
    }

    public LoginResponseDto login(LoginRequestDto dto, String remoteAddress) {
        String identifier = dto.getEmployeeCode() != null && !dto.getEmployeeCode().isBlank()
                ? normalizeEmployeeCode(dto.getEmployeeCode()) : normalizeEmail(dto.getEmail());
        loginAttemptService.assertAllowed(remoteAddress, identifier);
        try {
            LoginResponseDto response = authenticate(dto);
            loginAttemptService.recordSuccess(remoteAddress, identifier);
            return response;
        } catch (InvalidCredentialsException exception) {
            loginAttemptService.recordFailure(remoteAddress, identifier);
            throw exception;
        }
    }

    private LoginResponseDto authenticate(LoginRequestDto dto) {

        // ── EMPLOYEE login: authenticate directly via employeeCode ──────────
        if (dto.getEmployeeCode() != null && !dto.getEmployeeCode().isBlank()) {
            String code = normalizeEmployeeCode(dto.getEmployeeCode());

            Employee employee = employeeRepository.findByEmployeeCodeIgnoreCase(code)
                    .orElseThrow(InvalidCredentialsException::new);

            if (!Boolean.TRUE.equals(employee.getActive())) {
                throw new InvalidCredentialsException();
            }

            if (dto.getPassword() == null || dto.getPassword().isBlank()
                    || employee.getPasswordHash() == null
                    || !passwordEncoder.matches(dto.getPassword(), employee.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }

            String token = jwtService.generateToken(employee.getEmployeeCode(), com.enterprise.backend.enums.Role.EMPLOYEE, tokenVersion(employee.getTokenVersion()));

            return new LoginResponseDto(
                    token,
                    employee.getEmployeeCode(),
                    "EMPLOYEE",
                    employee.getId(),
                    Boolean.TRUE.equals(employee.getMustChangePassword())
            );
        }

        // ── ADMIN login: authenticate via User table (email + password) ─
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new com.enterprise.backend.exception.InvalidCredentialsException();
        }

        String email = normalizeEmail(dto.getEmail());
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new InvalidCredentialsException();
        }

        if (dto.getPassword() == null || dto.getPassword().isBlank() || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), tokenVersion(user.getTokenVersion()));

        Long employeeId = employeeRepository.findByEmail(user.getEmail())
                .map(Employee::getId)
                .orElse(null);

        return new LoginResponseDto(
                token,
                user.getEmail(),
                user.getRole().name(),
                employeeId,
                false
        );
    }

    @Transactional
    public void changeAdminPassword(Authentication authentication, EmployeePasswordChangeDto dto) {
        User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(InvalidCredentialsException::new);
        if (user.getRole() != com.enterprise.backend.enums.Role.ADMIN
                || !Boolean.TRUE.equals(user.getActive())
                || !passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        if (dto.getNewPassword().getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new com.enterprise.backend.exception.BusinessRuleException("New password must be at most 72 UTF-8 bytes");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setTokenVersion(tokenVersion(user.getTokenVersion()) + 1L);
        userRepository.save(user);
    }

    public boolean mustChangePassword(String employeeCode) {
        return employeeRepository.findByEmployeeCodeIgnoreCase(employeeCode)
                .map(employee -> Boolean.TRUE.equals(employee.getMustChangePassword()))
                .orElse(false);
    }

    private long tokenVersion(Long version) {
        return version == null ? 0L : version;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String normalizeEmployeeCode(String employeeCode) {
        return employeeCode == null ? "" : employeeCode.trim().toUpperCase();
    }
}
