package com.enterprise.backend.service;

import com.enterprise.backend.dto.RegisterUserDto;
import com.enterprise.backend.entity.User;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.enterprise.backend.dto.LoginRequestDto;
import com.enterprise.backend.dto.LoginResponseDto;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid Password");
    }

    return new LoginResponseDto(
            "TEMP_TOKEN",
            user.getEmail(),
            user.getRole()
    );
}
}