import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivities from "../components/RecentActivities";
import DashboardCharts from "../components/DashboardCharts";
import InfoWidgets from "../components/InfoWidgets";
import {
  RiTeamLine, RiBuildingLine, RiUserHeartLine,
  RiTimeLine, RiUserUnfollowLine, RiAlarmWarningLine,
  RiCalendarCheckLine
} from "react-icons/ri";

const CARDS = [
  { key: "totalEmployees",    title: "Total Employees",  icon: RiTeamLine,          color: "#1e40af", description: "All headcount" },
  { key: "activeEmployees",   title: "Active Employees", icon: RiUserHeartLine,     color: "#059669", description: "Currently active" },
  { key: "totalDepartments",  title: "Departments",      icon: RiBuildingLine,      color: "#7c3aed", description: "Across org" },
  { key: "presentToday",      title: "Present Today",    icon: RiTimeLine,          color: "#0891b2", description: "Checked in today" },
  { key: "absentToday",       title: "Absent Today",     icon: RiUserUnfollowLine,  color: "#dc2626", description: "No check-in" },
  { key: "lateToday",         title: "Late Arrivals",    icon: RiAlarmWarningLine,  color: "#d97706", description: "Clocked in late" },
  { key: "pendingLeaves",     title: "Pending Leaves",   icon: RiCalendarCheckLine, color: "#ea580c", description: "Awaiting approval" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span>
      {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      {" · "}
      {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}

export default function Dashboard() {
  const [dashboard,    setDashboard]    = useState(null);
  const [employees,    setEmployees]    = useState([]);
  const [departments,  setDepartments]  = useState([]);
  const [attendance,   setAttendance]   = useState([]);
  const [leaves,       setLeaves]       = useState([]);
  const [loading,      setLoading]      = useState(true);

  const email       = localStorage.getItem("email") || "";
  const displayName = email.split("@")[0] || "Admin";

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rDash, rEmp, rDept, rAtt, rLeave] = await Promise.all([
        api.get("/reports/dashboard"),
        api.get("/employees"),
        api.get("/departments"),
        api.get("/attendance"),
        api.get("/leave"),
      ]);
      setDashboard(rDash.data);
      setEmployees(rEmp.data);
      setDepartments(rDept.data);
      setAttendance(rAtt.data);
      setLeaves(rLeave.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const pendingLeaveCount = leaves.filter(lv => lv.status === "PENDING").length;

  const stats = {
    totalEmployees:   dashboard?.totalEmployees   ?? null,
    activeEmployees:  dashboard?.activeEmployees  ?? null,
    totalDepartments: dashboard?.totalDepartments ?? null,
    presentToday:     dashboard?.presentToday     ?? null,
    absentToday:      dashboard?.absentToday      ?? null,
    lateToday:        dashboard?.lateToday        ?? null,
    pendingLeaves:    pendingLeaveCount            ?? null,
  };

  const attendanceRate = (stats.presentToday != null && stats.totalEmployees)
    ? Math.round((Number(stats.presentToday) / Number(stats.totalEmployees)) * 100)
    : null;

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="fade-in" style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 55%, #2563eb 100%)",
        borderRadius: "16px", padding: "28px 32px",
        marginBottom: "24px", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", right: "120px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "22px" }}>
                {new Date().getHours() < 12 ? "🌅" : new Date().getHours() < 17 ? "☀️" : "🌙"}
              </span>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0 }}>
                {getGreeting()}, {displayName.charAt(0).toUpperCase() + displayName.slice(1)}
              </h1>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", marginBottom: "16px" }}>
              <LiveClock />
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { label: "Total Employees",  value: loading ? "…" : (stats.totalEmployees ?? "—") },
                { label: "Attendance Today", value: loading ? "…" : (attendanceRate != null ? `${attendanceRate}%` : "—") },
                { label: "Pending Actions",  value: loading ? "…" : (stats.pendingLeaves != null ? `${stats.pendingLeaves} leave${stats.pendingLeaves !== 1 ? "s" : ""}` : "—") },
              ].map(item => (
                <div key={item.label} style={{
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
                  borderRadius: "10px", padding: "10px 16px",
                  border: "1px solid rgba(255,255,255,0.15)"
                }}>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff", marginTop: "3px" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "16px", marginBottom: "0" }}>
        {CARDS.map(({ key, title, icon, color, description }) => (
          <DashboardCard
            key={key}
            title={title}
            value={stats[key]}
            icon={icon}
            color={color}
            description={description}
            loading={loading}
          />
        ))}
      </div>

      <QuickActions />

      <div className="dashboard-two-col" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", marginTop: "24px", alignItems: "start" }}>
        <RecentActivities
          attendance={attendance}
          leaves={leaves}
          employees={employees}
          loading={loading}
          onRefresh={loadAll}
        />
        <InfoWidgets
          leaves={leaves}
          employees={employees}
          departments={departments}
          loading={loading}
          onRefresh={loadAll}
        />
      </div>

      <DashboardCharts
        attendance={attendance}
        employees={employees}
        departments={departments}
        leaves={leaves}
      />
    </MainLayout>
  );
}
