ALTER TABLE attendance
    ADD CONSTRAINT fk_attendance_employee
    FOREIGN KEY (employee_id) REFERENCES employees (id);

ALTER TABLE leave_requests
    ADD CONSTRAINT fk_leave_employee
    FOREIGN KEY (employee_id) REFERENCES employees (id),
    ADD CONSTRAINT fk_leave_backup_employee
    FOREIGN KEY (backup_employee_id) REFERENCES employees (id);

ALTER TABLE employee_leave_balance
    ADD CONSTRAINT fk_leave_balance_employee
    FOREIGN KEY (employee_id) REFERENCES employees (id);
