package com.enterprise.backend.exception;

public class AttendanceNotOpenException extends RuntimeException {
    public AttendanceNotOpenException(String message) { super(message); }
}
