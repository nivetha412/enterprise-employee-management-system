INSERT INTO employee_leave_balance (
    employee_id,
    casual_leave_balance,
    sick_leave_balance,
    earned_leave_balance,
    comp_off_balance,
    wfh_balance
)
SELECT
    e.id,
    5,
    10,
    15,
    0,
    0
FROM employees e
LEFT JOIN employee_leave_balance b ON b.employee_id = e.id
WHERE b.employee_id IS NULL;