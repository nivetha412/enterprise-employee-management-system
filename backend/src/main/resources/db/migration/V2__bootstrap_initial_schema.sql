CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT NOT NULL AUTO_INCREMENT,
    employee_code VARCHAR(255) NULL,
    first_name VARCHAR(255) NULL,
    last_name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    password_hash VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    gender VARCHAR(255) NULL,
    designation VARCHAR(255) NULL,
    salary DOUBLE NULL,
    department VARCHAR(255) NULL,
    employment_type VARCHAR(255) NULL,
    active TINYINT(1) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_employees_employee_code (employee_code),
    UNIQUE KEY uk_employees_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    department_code VARCHAR(255) NULL,
    department_name VARCHAR(255) NULL,
    description VARCHAR(1000) NULL,
    manager_name VARCHAR(255) NULL,
    location VARCHAR(255) NULL,
    active TINYINT(1) NULL,
    created_date DATE NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    attendance_date DATE NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    status VARCHAR(255) NULL,
    working_hours DOUBLE NULL,
    late_arrival TINYINT(1) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(50) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    total_days INT NULL,
    reason VARCHAR(1000) NULL,
    priority VARCHAR(50) NULL,
    status VARCHAR(50) NULL,
    backup_employee_id BIGINT NULL,
    manager_remarks VARCHAR(1000) NULL,
    hr_remarks VARCHAR(1000) NULL,
    applied_date DATE NULL,
    approved_date DATE NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS employee_leave_balance (
    id BIGINT NOT NULL AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    casual_leave_balance INT NULL,
    sick_leave_balance INT NULL,
    earned_leave_balance INT NULL,
    comp_off_balance INT NULL,
    wfh_balance INT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE INDEX idx_attendance_employee_date ON attendance (employee_id, attendance_date);
CREATE INDEX idx_leave_requests_employee_status ON leave_requests (employee_id, status);
CREATE INDEX idx_leave_requests_backup_employee ON leave_requests (backup_employee_id);
CREATE INDEX idx_employee_leave_balance_employee ON employee_leave_balance (employee_id);
