/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [emp,        setEmp]        = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves,     setLeaves]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");
    if (!token || role !== "EMPLOYEE") { setLoading(false); return; }

    setLoading(true);
    setError(null);
    try {
      const employeeResponse = await api.get("/employees/me");
      const employee = employeeResponse.data;
      const empId = employee?.id;

      if (!empId) throw new Error("Employee profile could not be resolved");
      setEmp(employee);

      const [attendanceResult, leaveResult] = await Promise.allSettled([
        api.get(`/attendance/employee/${empId}`),
        api.get("/leave/mine"),
      ]);

      setAttendance(attendanceResult.status === "fulfilled" ? attendanceResult.value.data || [] : []);
      setLeaves(leaveResult.status === "fulfilled" ? leaveResult.value.data || [] : []);
      if (attendanceResult.status === "rejected" || leaveResult.status === "rejected") setError("Some dashboard data could not be loaded. Please retry.");
    } catch (err) {
      setError(err?.userMessage || err?.message || "Dashboard data could not be loaded. Please retry.");
      setEmp(null);
      setAttendance([]);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const monthStr    = todayStr.slice(0, 7);
  const thisMonth   = attendance.filter(r => r.attendanceDate?.startsWith(monthStr));
  const todayRecord = attendance
    .filter(r => r.attendanceDate === todayStr)
    .reduce((latest, record) => !latest || record.id > latest.id ? record : latest, null);

  const attStats = {
    presentDays: thisMonth.filter(r => r.status === "PRESENT").length,
    absentDays:  thisMonth.filter(r => r.status === "ABSENT").length,
    lateDays:    thisMonth.filter(r => r.lateArrival).length,
    leaveDays:   thisMonth.filter(r => r.status === "LEAVE").length,
    totalHours:  parseFloat(thisMonth.reduce((s, r) => s + (r.workingHours || 0), 0).toFixed(1)),
    workingDays: thisMonth.length,
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
  return useContext(EmployeeContext);
}
