-- V5 adds a mandatory attendance -> employee foreign key. Clean legacy orphan
-- rows before that constraint is created, otherwise V5 cannot be applied.
DELETE FROM attendance
WHERE employee_id IS NULL
   OR employee_id NOT IN (SELECT id FROM employees);
