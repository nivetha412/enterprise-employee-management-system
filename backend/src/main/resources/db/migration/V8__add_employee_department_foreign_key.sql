-- Preserve the legacy department text while introducing the canonical relation.
ALTER TABLE employees
    ADD COLUMN department_id BIGINT NULL;

-- Backfill only unambiguous, name-matching legacy assignments. Employees whose
-- legacy text has no matching department remain unassigned for manual review.
UPDATE employees e
JOIN departments d
  ON LOWER(TRIM(d.department_name)) = LOWER(TRIM(e.department))
SET e.department_id = d.id
WHERE e.department IS NOT NULL
  AND TRIM(e.department) <> '';

CREATE INDEX idx_employees_department_id ON employees (department_id);

ALTER TABLE employees
    ADD CONSTRAINT fk_employee_department
    FOREIGN KEY (department_id) REFERENCES departments (id);
