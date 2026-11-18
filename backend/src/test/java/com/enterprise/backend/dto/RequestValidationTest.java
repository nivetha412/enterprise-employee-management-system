package com.enterprise.backend.dto;

import com.enterprise.backend.enums.LeavePriority;
import com.enterprise.backend.enums.LeaveType;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RequestValidationTest {
    private static Validator validator;
    private static ValidatorFactory validatorFactory;

    @BeforeAll
    static void createValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void closeValidatorFactory() {
        validatorFactory.close();
    }

    @Test
    void loginRequiresOneIdentifierAndPassword() {
        LoginRequestDto empty = new LoginRequestDto();
        assertFalse(validator.validate(empty).isEmpty());

        LoginRequestDto admin = new LoginRequestDto();
        admin.setEmail("admin@example.com");
        admin.setPassword("a-long-password");
        assertTrue(validator.validate(admin).isEmpty());

        admin.setEmployeeCode("EMP001");
        assertFalse(validator.validate(admin).isEmpty());
    }

    @Test
    void leaveApplicationRequiresBackupButAdminUpdateCanOmitIt() {
        LeaveRequestDto leave = new LeaveRequestDto();
        leave.setLeaveType(LeaveType.CASUAL_LEAVE);
        leave.setStartDate(LocalDate.of(2027, 1, 10));
        leave.setEndDate(LocalDate.of(2027, 1, 10));
        leave.setReason("Personal leave");
        leave.setPriority(LeavePriority.MEDIUM);

        assertFalse(validator.validate(leave, LeaveRequestDto.Apply.class).isEmpty());
        assertTrue(validator.validate(leave).isEmpty());

        leave.setBackupEmployeeId(8L);
        assertTrue(validator.validate(leave, LeaveRequestDto.Apply.class).isEmpty());
    }
}
