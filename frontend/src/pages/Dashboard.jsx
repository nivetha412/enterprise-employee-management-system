import { useCallback, useEffect, useState } from "react";
import {
  RiBuildingLine, RiCalendarCheckLine, RiRefreshLine,
  RiTeamLine, RiTimeLine, RiUserAddLine, RiUserHeartLine,
} from "react-icons/ri";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { useDomainNav } from "../context/RoleContext";
import "./Dashboard.css";

const METRICS = [
  { key: "totalEmployees", label: "Total employees", detail: "Organisation headcount", icon: RiTeamLine, color: "#315fbd", bg: "#edf3ff" },
  { key: "activeEmployees", label: "Active employees", detail: "Currently active", icon: RiUserHeartLine, color: "#16855f", bg: "#eaf8f1" },
  { key: "totalDepartments", label: "Departments", detail: "Across the organisation", icon: RiBuildingLine, color: "#7652b5", bg: "#f2edff" },
  { key: "presentToday", label: "Present today", detail: "Checked in today", icon: RiTimeLine, color: "#167eaa", bg: "#eaf8fc" },
  { key: "pendingLeaves", label: "Pending leave", detail: "Requires a decision", icon: RiCalendarCheckLine, color: "#b7791f", bg: "#fff6e5" },
];

function MetricCard({ metric, value, loading }) {
  const Icon = metric.icon;
  return <article className="admin-metric"><span style={{ color: metric.color, background: metric.bg }}><Icon /></span><div><strong>{loading ? "—" : value ?? "—"}</strong><p>{metric.label}</p><small>{metric.detail}</small></div></article>;
}

export default function Dashboard() {
  const navigate = useDomainNav();
  const [report, setReport] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayName = (localStorage.getItem("email") || "Admin").split("@")[0];

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [reportResult, leaveResult] = await Promise.allSettled([api.get("/reports/dashboard"), api.get("/leave")]);
      setReport(reportResult.status === "fulfilled" ? reportResult.value.data : null);
      setPendingLeaves(leaveResult.status === "fulfilled" ? (leaveResult.value.data || []).filter(leave => leave.status === "PENDING").length : null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  const values = { ...report, pendingLeaves };
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return <MainLayout><div className="admin-dashboard">
    <header className="admin-dashboard__header">
      <div><p>Admin workspace</p><h1>Good day, {displayName.charAt(0).toUpperCase() + displayName.slice(1)}</h1><span>{today} · A focused view of your organisation</span></div>
      <button onClick={loadDashboard} disabled={loading} className="admin-dashboard__refresh"><RiRefreshLine /> Refresh</button>
    </header>
    <section className="admin-dashboard__metrics" aria-label="Organisation snapshot">{METRICS.map(metric => <MetricCard key={metric.key} metric={metric} value={values[metric.key]} loading={loading} />)}</section>
    <section className="admin-dashboard__actions"><div><p>Common tasks</p><h2>Manage your workforce</h2></div><button onClick={() => navigate("/employees")}><RiUserAddLine /><span>Add employee</span><small>Create an employee profile</small></button><button onClick={() => navigate("/leave")}><RiCalendarCheckLine /><span>Review leave</span><small>{pendingLeaves == null ? "View leave requests" : `${pendingLeaves} request${pendingLeaves === 1 ? "" : "s"} pending`}</small></button><button onClick={() => navigate("/attendance")}><RiTimeLine /><span>Attendance</span><small>Review today’s attendance</small></button><button onClick={() => navigate("/departments")}><RiBuildingLine /><span>Departments</span><small>Manage organisation units</small></button></section>
  </div></MainLayout>;
}
