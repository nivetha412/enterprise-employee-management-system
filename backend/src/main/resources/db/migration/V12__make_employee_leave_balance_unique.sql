ALTER TABLE employee_leave_balance
    ADD CONSTRAINT uk_employee_leave_balance_employee UNIQUE (employee_id);