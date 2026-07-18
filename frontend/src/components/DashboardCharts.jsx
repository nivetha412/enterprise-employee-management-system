import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const DEPT_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#0891b2", "#0d9488", "#ea580c"];

const card = {
  background: "#fff", padding: "22px 24px", borderRadius: "16px",
  boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)"
};
const chartTitle = { fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" };
const chartSub   = { fontSize: "12px", color: "var(--text-muted)", marginBottom: "18px" };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px", boxShadow: "var(--shadow-md)", fontSize: "12.5px" }}>
      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ color: "var(--text-secondary)" }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function ChartBadge({ label, color }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg-main)", padding: "3px 9px", borderRadius: "20px", border: "1px solid var(--border)" }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function EmptyChart({ message = "No data available" }) {
  return (
    <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "13px", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 32 }}>📊</span>
      {message}
    </div>
  );
}

export default function DashboardCharts() {
  const [attendance,   setAttendance]   = useState([]);
  const [employees,    setEmployees]    = useState([]);
  const [departments,  setDepartments]  = useState([]);
  const [leaves,       setLeaves]       = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/attendance"),
      api.get("/employees"),
      api.get("/departments"),
      api.get("/leave"),
    ]).then(([a, e, d, l]) => {
      setAttendance(a.data);
      setEmployees(e.data);
      setDepartments(d.data);
      setLeaves(l.data);
    }).catch(console.error);
  }, []);

  // ── Attendance Trend: group by date (last 7 dates with records) ────────────
  const attendanceTrend = (() => {
    const byDate = {};
    attendance.forEach(a => {
      const d = a.attendanceDate;
      if (!byDate[d]) byDate[d] = { day: d, present: 0, absent: 0, late: 0 };
      if (a.status === "PRESENT") byDate[d].present++;
      if (a.status === "ABSENT")  byDate[d].absent++;
      if (a.lateArrival)          byDate[d].late++;
    });
    return Object.values(byDate)
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-7)
      .map(d => ({ ...d, day: new Date(d.day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) }));
  })();

  // ── Department Distribution: real employee counts ─────────────────────────
  const deptDistribution = departments.map((dept, i) => {
    const count = employees.filter(e =>
      (e.department || "").toLowerCase().trim() === (dept.departmentName || "").toLowerCase().trim()
    ).length;
    return { name: dept.departmentName, value: count, color: DEPT_COLORS[i % DEPT_COLORS.length] };
  }).filter(d => d.value > 0);

  // ── Employee Growth: group by month of creation (use id as proxy if no date) ─
  // Since Employee entity has no createdDate, we group by department as a distribution instead
  // and show total per department as a bar chart
  const deptBarData = departments.map((dept, i) => ({
    name: dept.departmentName.length > 10 ? dept.departmentName.slice(0, 10) + "…" : dept.departmentName,
    employees: employees.filter(e =>
      (e.department || "").toLowerCase().trim() === (dept.departmentName || "").toLowerCase().trim()
    ).length,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
  })).filter(d => d.employees > 0);

  // ── Leave Analytics: group by leaveType ───────────────────────────────────
  const leaveByType = (() => {
    const map = {};
    leaves.forEach(l => {
      const t = (l.leaveType || "OTHER").replace(/_/g, " ");
      map[t] = (map[t] || 0) + 1;
    });
    return Object.entries(map).map(([type, count], i) => ({
      type: type.length > 12 ? type.slice(0, 12) + "…" : type,
      count,
      color: DEPT_COLORS[i % DEPT_COLORS.length],
    }));
  })();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", marginTop: "24px" }}>

      {/* Attendance Trend */}
      <div style={{ ...card, gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <h3 style={chartTitle}>Attendance Trend</h3>
            <p style={chartSub}>Daily attendance from records ({attendanceTrend.length} days)</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <ChartBadge label="Present" color="#3b82f6" />
            <ChartBadge label="Absent"  color="#ef4444" />
            <ChartBadge label="Late"    color="#f59e0b" />
          </div>
        </div>
        {attendanceTrend.length === 0
          ? <EmptyChart message="No attendance records yet" />
          : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceTrend} barSize={16} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent"  fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                <Bar dataKey="late"    fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>

      {/* Department Distribution */}
      <div style={card}>
        <h3 style={chartTitle}>Department Distribution</h3>
        <p style={chartSub}>Headcount by department</p>
        {deptDistribution.length === 0
          ? <EmptyChart message="No employee-department data yet" />
          : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={deptDistribution} dataKey="value" nameKey="name" outerRadius={80} innerRadius={45} paddingAngle={3}>
                  {deptDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} employees`, name]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid var(--border)", fontSize: "12px" }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11.5px", paddingTop: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )
        }
      </div>

      {/* Employees per Department (bar) */}
      <div style={card}>
        <h3 style={chartTitle}>Employees per Department</h3>
        <p style={chartSub}>Current headcount distribution</p>
        {deptBarData.length === 0
          ? <EmptyChart message="No department data yet" />
          : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptBarData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="employees" radius={[4, 4, 0, 0]} name="Employees">
                  {deptBarData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>

      {/* Leave Analytics */}
      <div style={card}>
        <h3 style={chartTitle}>Leave Analytics</h3>
        <p style={chartSub}>Leave requests by type ({leaves.length} total)</p>
        {leaveByType.length === 0
          ? <EmptyChart message="No leave requests yet" />
          : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leaveByType} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Requests">
                  {leaveByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </div>

    </div>
  );
}
