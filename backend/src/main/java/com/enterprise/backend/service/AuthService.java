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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmployeeRepository employeeRepository;

    public void registerUser(RegisterUserDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
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

        // ── EMPLOYEE login: authenticate directly via employeeCode ──────────
        // employeeCode is both the username and the password (e.g. EMP001/EMP001)
        if (dto.getEmployeeCode() != null && !dto.getEmployeeCode().isBlank()) {
            String code = dto.getEmployeeCode().trim();

            Employee employee = employeeRepository.findByEmployeeCode(code)
                    .orElseThrow(() -> new RuntimeException("Employee not found: " + code));

            if (!Boolean.TRUE.equals(employee.getActive())) {
                throw new IllegalArgumentException("This employee account is inactive. Please contact HR.");
            }

            if (dto.getPassword() == null || dto.getPassword().isBlank()
                    || employee.getPasswordHash() == null
                    || !passwordEncoder.matches(dto.getPassword(), employee.getPasswordHash())) {
                throw new IllegalArgumentException("Invalid employee code or password");
            }

            // Use employeeCode as the JWT subject (no User record needed)
            String token = jwtService.generateToken(code);

            return new LoginResponseDto(
                    token,
                    code,
                    "EMPLOYEE",
                    employee.getId()
            );
        }

        // ── ADMIN login: authenticate via User table (email + password) ─
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepository.findByEmail(dto.getEmail().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        // Check if this admin/HR user also has an employee record
        Long employeeId = employeeRepository.findByEmail(user.getEmail())
                .map(Employee::getId)
                .orElse(null);

        return new LoginResponseDto(
                token,
                user.getEmail(),
                user.getRole().name(),
                employeeId
        );
    }
}
