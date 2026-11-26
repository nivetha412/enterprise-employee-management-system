package com.enterprise.backend.service;

import com.enterprise.backend.exception.LoginRateLimitException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginAttemptServiceTest {
    @Mock
    private JdbcTemplate jdbcTemplate;

    @Test
    void blocksWhenAnySharedRateLimitBucketIsBlocked() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), any(Object[].class))).thenReturn(1);

        var service = new LoginAttemptService(jdbcTemplate);

        assertThrows(LoginRateLimitException.class, () -> service.assertAllowed("192.0.2.4", "admin@example.com"));
    }

    @Test
    void recordsFailuresUsingOnlyHashedKeys() {
        var service = new LoginAttemptService(jdbcTemplate);

        service.recordFailure("192.0.2.4", "admin@example.com");

        verify(jdbcTemplate, org.mockito.Mockito.times(3)).update(anyString(), anyString(), any(Integer.class));
    }
}