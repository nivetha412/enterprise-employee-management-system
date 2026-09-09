package com.enterprise.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DepartmentControllerAuthorizationTest {

    @Test
    void readEndpointsRequireAdminRole() throws NoSuchMethodException {
        assertEquals("hasRole('ADMIN')", DepartmentController.class
                .getMethod("getAllDepartments")
                .getAnnotation(PreAuthorize.class)
                .value());
        assertEquals("hasRole('ADMIN')", DepartmentController.class
                .getMethod("getDepartmentById", Long.class)
                .getAnnotation(PreAuthorize.class)
                .value());
    }
}
