package com.enterprise.backend.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() { super("Invalid login ID or password"); }
}
