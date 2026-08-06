import { useState } from "react";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import { Toast } from "../../styles/ui.jsx";
import EmpAttBanner from "../../components/employee/EmpAttBanner";
import EmpAttKPICards from "../../components/employee/EmpAttKPICards";
import EmpAttCalendar from "../../components/employee/EmpAttCalendar";
import EmpAttHistory from "../../components/employee/EmpAttHistory";
import EmpAttTodayCard from "../../components/employee/EmpAttTodayCard";
import "./EmployeeAttendance.css";

function AttendanceContent() {
  const { emp, attendance, attStats, todayRecord, loading, reload } = useEmployee();
  const [busy, setBusy] = useState(false); const [toast, setToast] = useState({ message: "", type: "success" });
  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast({ message: "", type: "success" }), 3000); };
  const updateAttendance = async endpoint => { setBusy(true); try { const empId = emp?.id || localStorage.getItem("employeeId"); if (!empId) { showToast("Employee profile not linked", "error"); return; } await api.post(endpoint, { employeeId: Number(empId) }); await reload(); showToast(endpoint.includes("checkin") ? "Check-in recorded successfully" : "Check-out recorded successfully"); } catch (err) { showToast(err?.response?.data?.message || "Unable to update attendance", "error"); } finally { setBusy(false); } };
  const handleExport = () => { const rows = [["Date", "Check-In", "Check-Out", "Hours", "Status", "Late"], ...attendance.map(record => [record.attendanceDate, record.checkInTime || "", record.checkOutTime || "", record.workingHours?.toFixed(1) || "", record.status, record.lateArrival ? "Yes" : "No"])]; const blob = new Blob([rows.map(row => row.map(value => `"${value}"`).join(",")).join("\n")], { type: "text/csv" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `my_attendance_${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url); };
  return <div className="employee-attendance"><Toast message={toast.message} type={toast.type} /><EmpAttBanner todayRecord={todayRecord} onCheckIn={() => updateAttendance("/attendance/checkin")} onCheckOut={() => updateAttendance("/attendance/checkout")} loading={busy} /><EmpAttKPICards stats={attStats} /><div className="employee-attendance__overview"><EmpAttTodayCard record={todayRecord} /><EmpAttCalendar attendance={attendance} /></div><EmpAttHistory records={attendance} onExport={handleExport} loading={loading} /></div>;
}
export default function EmployeeAttendance() { return <EmployeeProvider><MainLayout><AttendanceContent /></MainLayout></EmployeeProvider>; }
