package com.enterprise.backend.exception;

public class LoginRateLimitException extends RuntimeException {
    private final int retryAfterSeconds;

    public LoginRateLimitException(int retryAfterSeconds) {
        super("Too many login attempts. Try again later.");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}