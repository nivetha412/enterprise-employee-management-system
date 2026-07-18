import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import { Toast } from "../../styles/ui.jsx";

import EmpAttendanceBanner       from "../../components/employee/EmpAttendanceBanner";
import EmpAttendanceSummaryCards from "../../components/employee/EmpAttendanceSummaryCards";
import EmpAttendanceToday        from "../../components/employee/EmpAttendanceToday";
import EmpAttendanceCalendar     from "../../components/employee/EmpAttendanceCalendar";
import EmpAttendanceHistory      from "../../components/employee/EmpAttendanceHistory";
import EmpAttendanceAnalytics    from "../../components/employee/EmpAttendanceAnalytics";
import EmpAttendanceInsights     from "../../components/employee/EmpAttendanceInsights";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchRecords = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) return;
      const res = await api.get(`/attendance/employee/${employeeId}`);
      setRecords(res.data || []);
    } catch {
      // components handle empty state
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const todayStr    = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find(r => r.attendanceDate === todayStr) || null;

  const thisMonth = records.filter(r => r.attendanceDate?.startsWith(todayStr.slice(0, 7)));
  const stats = {
    presentDays: thisMonth.filter(r => r.status === "PRESENT").length,
    absentDays:  thisMonth.filter(r => r.status === "ABSENT").length,
    lateDays:    thisMonth.filter(r => r.lateArrival).length,
    leaveDays:   thisMonth.filter(r => r.status === "LEAVE").length,
    totalHours:  thisMonth.reduce((s, r) => s + (r.workingHours || 0), 0).toFixed(1),
    workingDays: thisMonth.length || 23,
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) { showToast("Employee profile not linked", "error"); setLoading(false); return; }
      await api.post("/attendance/checkin", { employeeId: Number(employeeId) });
      await fetchRecords();
      showToast("Check-in recorded successfully ✓");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to check in", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) { showToast("Employee profile not linked", "error"); setLoading(false); return; }
      await api.post("/attendance/checkout", { employeeId: Number(employeeId) });
      await fetchRecords();
      showToast("Check-out recorded successfully ✓");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to check out", "error");
    } finally {
      setLoading(false);
    }
  };

  const historyRows = records.length > 0
    ? records.map(r => ({
        id:       r.id,
        date:     r.attendanceDate,
        checkIn:  r.checkInTime,
        checkOut: r.checkOutTime,
        hours:    r.workingHours || 0,
        status:   r.status,
        late:     r.lateArrival || false,
      }))
    : undefined;

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      {/* Hero banner with check-in / check-out */}
      <EmpAttendanceBanner
        todayRecord={todayRecord}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={loading}
      />

      {/* 6 summary stat cards */}
      <EmpAttendanceSummaryCards stats={stats} />

      {/* Row 1: Today detail | Calendar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.6fr",
        gap: "16px", marginBottom: "16px", alignItems: "start",
      }}>
        <EmpAttendanceToday record={todayRecord} />
        <EmpAttendanceCalendar />
      </div>

      {/* Row 2: Analytics | Insights + Holidays + Notifications */}
      <div style={{
        display: "grid", gridTemplateColumns: "1.6fr 1fr",
        gap: "16px", marginBottom: "16px", alignItems: "start",
      }}>
        <EmpAttendanceAnalytics />
        <EmpAttendanceInsights />
      </div>

      {/* Full-width history table */}
      <EmpAttendanceHistory records={historyRows} />

    </MainLayout>
  );
}
