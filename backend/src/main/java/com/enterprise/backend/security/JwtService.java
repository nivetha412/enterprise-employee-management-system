package com.enterprise.backend.security;

import com.enterprise.backend.enums.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final byte[] secretKey;

    public JwtService(@Value("${app.jwt.secret}") String secret) {
        this.secretKey = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    @PostConstruct
    void validateSecret() {
        if (secretKey.length < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 bytes");
        }
    }

    public String generateToken(String subject, Role role) {
        return generateToken(subject, role, 0L);
    }

    public String generateToken(String subject, Role role, long tokenVersion) {
        return Jwts.builder()
                .subject(subject)
                .claim("role", role.name())
                .claim("tokenVersion", tokenVersion)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(
                        io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                                secretKey
                        ),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    public String generateToken(String subject) {
        return generateToken(subject, Role.EMPLOYEE);
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secretKey))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public long extractTokenVersion(String token) {
        Object version = Jwts.parser()
                .verifyWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secretKey))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("tokenVersion");

        if (version == null) return 0L;
        if (version instanceof Number number) return number.longValue();
        throw new IllegalArgumentException("Invalid token version");
    }

    public Role extractRole(String token) {
        String role = Jwts.parser()
                .verifyWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(secretKey))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);

        if (role == null || role.isBlank()) {
            return null;
        }

        return Role.valueOf(role.trim().toUpperCase());
    }
}
