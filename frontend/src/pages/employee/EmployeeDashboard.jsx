import { useState } from "react";
import { RiCalendarCheckLine, RiTimeLine, RiUserLine } from "react-icons/ri";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import { useDomainNav } from "../../context/RoleContext";
import api from "../../services/api";
import { Toast } from "../../styles/ui.jsx";
import EmpDashLeaveCard from "../../components/employee/EmpDashLeaveCard";
import EmpDashProfileCard from "../../components/employee/EmpDashProfileCard";
import EmpWorkdayCard from "../../components/employee/EmpWorkdayCard";
import "./EmployeeDashboard.css";

function Metric({ icon: Icon, label, value, detail, color, bg }) {
  return <div className="employee-metric" style={{ "--metric": color, "--metric-bg": bg }}><div className="employee-metric__icon"><Icon size={19} /></div><div><div className="employee-metric__value">{value}</div><div className="employee-metric__label">{label}</div><div className="employee-metric__detail">{detail}</div></div></div>;
}

function DashboardContent() {
  const { emp, attStats, leaveStats, loading, reload } = useEmployee();
  const navigate = useDomainNav();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const firstName = emp?.firstName || (localStorage.getItem("email") || "Employee").split("@")[0];
  const attendanceRate = attStats.workingDays ? Math.round((attStats.presentDays / attStats.workingDays) * 100) : 0;
  const showToast = (message, type = "success") => { setToast({ message, type }); window.setTimeout(() => setToast({ message: "", type: "success" }), 3200); };
  const updateAttendance = async (endpoint) => {
    if (!emp?.id) return showToast("Your employee profile is still loading. Please try again.", "error");
    setBusy(true);
    try { await api.post(endpoint, { employeeId: emp.id }); await reload(); showToast(endpoint.includes("checkin") ? "Check-in recorded successfully." : "Check-out recorded successfully."); }
    catch (err) { showToast(err?.response?.data?.message || "We couldn't update your attendance. Please try again.", "error"); await reload(); }
    finally { setBusy(false); }
  };
  return <div className="employee-dashboard">
    <Toast message={toast.message} type={toast.type} />
    <header className="employee-dashboard__header"><div><p className="employee-dashboard__eyebrow">Employee workspace</p><h1>Welcome back, {loading ? "…" : firstName}</h1><p>Here is a focused view of your workday and HR essentials.</p></div><div className="employee-dashboard__date">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div></header>
    <section className="employee-dashboard__metrics" aria-label="Monthly overview">
      <Metric icon={RiCalendarCheckLine} label="Present days" value={loading ? "—" : attStats.presentDays} detail="This month" color="#1d8f67" bg="#eaf8f2" />
      <Metric icon={RiTimeLine} label="Attendance rate" value={loading ? "—" : `${attendanceRate}%`} detail={`${attStats.workingDays || 0} recorded days`} color="#315fdb" bg="#edf2ff" />
      <Metric icon={RiCalendarCheckLine} label="Pending leave" value={loading ? "—" : leaveStats.pending} detail="Awaiting review" color="#9563d7" bg="#f5efff" />
      <Metric icon={RiUserLine} label="Leave requests" value={loading ? "—" : leaveStats.total} detail="All submitted requests" color="#c88620" bg="#fff7e8" />
    </section>
    <section className="employee-dashboard__primary"><EmpWorkdayCard busy={busy} onCheckIn={() => updateAttendance("/attendance/checkin")} onCheckOut={() => updateAttendance("/attendance/checkout")} /><aside className="employee-dashboard__actions"><div><p className="employee-dashboard__eyebrow">Quick access</p><h2>Take care of your day</h2></div><button onClick={() => navigate("/leave")}><RiCalendarCheckLine /> Apply for leave</button><button onClick={() => navigate("/attendance")}><RiTimeLine /> View attendance</button><button onClick={() => navigate("/profile")}><RiUserLine /> Update profile</button></aside></section>
    <section className="employee-dashboard__secondary"><EmpDashLeaveCard /><EmpDashProfileCard /></section>
  </div>;
}
export default function EmployeeDashboard() { return <EmployeeProvider><MainLayout><DashboardContent /></MainLayout></EmployeeProvider>; }
