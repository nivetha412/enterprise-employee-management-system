import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import QuickActions from "../components/QuickActions";
import RecentActivities from "../components/RecentActivities";
import DashboardCharts from "../components/DashboardCharts";

const cards = [
  { key: "totalEmployees",   title: "Total Employees",   color: "#4f46e5", icon: "👥" },
  { key: "totalDepartments", title: "Departments",        color: "#7c3aed", icon: "🏢" },
  { key: "activeEmployees",  title: "Active",             color: "#059669", icon: "✅" },
  { key: "inactiveEmployees",title: "Inactive",           color: "#dc2626", icon: "❌" },
  { key: "presentToday",     title: "Present Today",      color: "#0891b2", icon: "🟢" },
  { key: "absentToday",      title: "Absent Today",       color: "#ea580c", icon: "🔴" },
  { key: "lateToday",        title: "Late Arrivals",      color: "#d97706", icon: "⏰" },
];

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/reports/dashboard");
      setDashboard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const email = localStorage.getItem("email");

  return (
    <MainLayout>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Welcome back{email ? `, ${email}` : ""} 👋 — Here's what's happening today.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "0" }}>
        {cards.map(({ key, title, color, icon }) => (
          <DashboardCard
            key={key}
            title={title}
            value={dashboard?.[key]}
            color={color}
            icon={icon}
          />
        ))}
      </div>

      <QuickActions />
      <RecentActivities />
      <DashboardCharts />
    </MainLayout>
  );
}

export default Dashboard;
