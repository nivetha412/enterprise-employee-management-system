package com.enterprise.backend.service;

import com.enterprise.backend.exception.LoginRateLimitException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {
    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);
    private static final int WINDOW_MINUTES = 15;
    private static final int BLOCK_MINUTES = 15;
    private static final int PAIR_LIMIT = 5;
    private static final int ACCOUNT_LIMIT = 10;
    private static final int IP_LIMIT = 30;
    private static final int CLEANUP_INTERVAL = 100;
    private static final String UPSERT = """
            INSERT INTO login_attempts (attempt_key, attempt_count, window_started_at, blocked_until, updated_at)
            VALUES (?, 1, UTC_TIMESTAMP(6), NULL, UTC_TIMESTAMP(6))
            ON DUPLICATE KEY UPDATE
              attempt_count = IF(window_started_at <= DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 15 MINUTE), 1, attempt_count + 1),
              blocked_until = IF(blocked_until > UTC_TIMESTAMP(6), blocked_until,
                  IF(attempt_count >= ?, DATE_ADD(UTC_TIMESTAMP(6), INTERVAL 15 MINUTE), NULL)),
              window_started_at = IF(window_started_at <= DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 15 MINUTE), UTC_TIMESTAMP(6), window_started_at),
              updated_at = UTC_TIMESTAMP(6)
            """;
    private static final String BLOCKED = "SELECT COUNT(*) FROM login_attempts WHERE attempt_key IN (?, ?, ?) AND blocked_until > UTC_TIMESTAMP(6)";
    private static final String DELETE_KEY = "DELETE FROM login_attempts WHERE attempt_key = ?";

    private final JdbcTemplate jdbcTemplate;
    private final AtomicInteger cleanupCounter = new AtomicInteger();

    public void assertAllowed(String remoteAddress, String identifier) {
        AttemptKeys keys = keys(remoteAddress, identifier);
        Integer blocked = jdbcTemplate.queryForObject(BLOCKED, Integer.class, keys.ip(), keys.account(), keys.pair());
        if (blocked != null && blocked > 0) {
            log.warn("Login throttled ipKey={} accountKey={}", keys.ip(), keys.account());
            throw new LoginRateLimitException(BLOCK_MINUTES * 60);
        }
    }

    public void recordFailure(String remoteAddress, String identifier) {
        AttemptKeys keys = keys(remoteAddress, identifier);
        jdbcTemplate.update(UPSERT, keys.pair(), PAIR_LIMIT);
        jdbcTemplate.update(UPSERT, keys.account(), ACCOUNT_LIMIT);
        jdbcTemplate.update(UPSERT, keys.ip(), IP_LIMIT);
        if (cleanupCounter.incrementAndGet() % CLEANUP_INTERVAL == 0) {
            jdbcTemplate.update("DELETE FROM login_attempts WHERE updated_at < DATE_SUB(UTC_TIMESTAMP(6), INTERVAL 1 DAY)");
        }
    }

    public void recordSuccess(String remoteAddress, String identifier) {
        AttemptKeys keys = keys(remoteAddress, identifier);
        jdbcTemplate.update(DELETE_KEY, keys.pair());
        jdbcTemplate.update(DELETE_KEY, keys.account());
    }

    private AttemptKeys keys(String remoteAddress, String identifier) {
        String ip = remoteAddress == null || remoteAddress.isBlank() ? "unknown" : remoteAddress.trim();
        String account = identifier == null || identifier.isBlank() ? "unknown" : identifier.trim().toLowerCase();
        return new AttemptKeys(hash("ip:" + ip), hash("account:" + account), hash("pair:" + ip + ":" + account));
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private record AttemptKeys(String ip, String account, String pair) {}
}