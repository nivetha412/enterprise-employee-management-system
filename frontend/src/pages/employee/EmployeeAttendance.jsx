import { useState } from "react";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import { Toast } from "../../styles/ui.jsx";
import EmpAttBanner   from "../../components/employee/EmpAttBanner";
import EmpAttKPICards from "../../components/employee/EmpAttKPICards";
import EmpAttCalendar from "../../components/employee/EmpAttCalendar";
import EmpAttHistory  from "../../components/employee/EmpAttHistory";
import EmpAttTodayCard from "../../components/employee/EmpAttTodayCard";

function AttendanceContent() {
  const { attendance, attStats, todayRecord, loading, reload } = useEmployee();
  const [busy,  setBusy]  = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const handleCheckIn = async () => {
    setBusy(true);
    try {
      const empId = localStorage.getItem("employeeId");
      if (!empId) { showToast("Employee profile not linked", "error"); return; }
      await api.post("/attendance/checkin", { employeeId: Number(empId) });
      await reload();
      showToast("Check-in recorded successfully ✓");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to check in", "error");
    } finally { setBusy(false); }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    try {
      const empId = localStorage.getItem("employeeId");
      if (!empId) { showToast("Employee profile not linked", "error"); return; }
      await api.post("/attendance/checkout", { employeeId: Number(empId) });
      await reload();
      showToast("Check-out recorded successfully ✓");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to check out", "error");
    } finally { setBusy(false); }
  };

  const handleExport = () => {
    const rows = [
      ["Date", "Check-In", "Check-Out", "Hours", "Status", "Late"],
      ...attendance.map(r => [
        r.attendanceDate, r.checkInTime || "", r.checkOutTime || "",
        r.workingHours?.toFixed(1) || "", r.status, r.lateArrival ? "Yes" : "No",
      ]),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `my_attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <EmpAttBanner
        todayRecord={todayRecord}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        loading={busy}
      />
      <EmpAttKPICards stats={attStats} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "20px", marginBottom: "20px" }}
        className="emp-grid-2">
        <EmpAttTodayCard record={todayRecord} />
        <EmpAttCalendar attendance={attendance} />
      </div>
      <EmpAttHistory records={attendance} onExport={handleExport} loading={loading} />
    </>
  );
}

export default function EmployeeAttendance() {
  return (
    <EmployeeProvider>
      <MainLayout>
        <AttendanceContent />
      </MainLayout>
    </EmployeeProvider>
  );
}
