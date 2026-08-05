import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [emp,        setEmp]        = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves,     setLeaves]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = useCallback(() => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "EMPLOYEE") { setLoading(false); return; }

    setLoading(true);
    api.get("/employees/me")
      .then(empRes => {
        setEmp(empRes.data);
        const empId = empRes.data?.id;
        if (!empId) { setLoading(false); return; }
        return Promise.all([
          api.get(`/attendance/employee/${empId}`),
          api.get("/leave"),
        ]).then(([attRes, leaveRes]) => {
          setAttendance(attRes.data || []);
          setLeaves((leaveRes.data || []).filter(l => l.employeeId === empId));
        });
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const todayStr    = new Date().toISOString().slice(0, 10);
  const monthStr    = todayStr.slice(0, 7);
  const thisMonth   = attendance.filter(r => r.attendanceDate?.startsWith(monthStr));
  const todayRecord = attendance.find(r => r.attendanceDate === todayStr) || null;

  const attStats = {
    presentDays: thisMonth.filter(r => r.status === "PRESENT").length,
    absentDays:  thisMonth.filter(r => r.status === "ABSENT").length,
    lateDays:    thisMonth.filter(r => r.lateArrival).length,
    leaveDays:   thisMonth.filter(r => r.status === "LEAVE").length,
    totalHours:  parseFloat(thisMonth.reduce((s, r) => s + (r.workingHours || 0), 0).toFixed(1)),
    workingDays: thisMonth.length || 1,
  };

  const leaveStats = {
    pending:  leaves.filter(l => l.status === "PENDING").length,
    approved: leaves.filter(l => l.status === "APPROVED").length,
    rejected: leaves.filter(l => l.status === "REJECTED").length,
    total:    leaves.length,
  };

  return (
    <EmployeeContext.Provider value={{
      emp, attendance, leaves, loading, error,
      todayRecord, attStats, leaveStats, reload: load,
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  // eslint-disable-next-line react-refresh/only-export-components
  return useContext(EmployeeContext);
}
