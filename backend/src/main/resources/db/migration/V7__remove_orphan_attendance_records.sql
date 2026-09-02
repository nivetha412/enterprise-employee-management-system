DELETE FROM attendance
WHERE employee_id IS NULL
   OR employee_id NOT IN (SELECT id FROM employees);

ALTER TABLE attendance
    MODIFY employee_id BIGINT NOT NULL;