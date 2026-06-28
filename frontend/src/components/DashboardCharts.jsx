import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from "recharts";

const attendanceTrend = [
  { day: "Mon", present: 42, absent: 8, late: 5 },
  { day: "Tue", present: 45, absent: 5, late: 3 },
  { day: "Wed", present: 40, absent: 9, late: 7 },
  { day: "Thu", present: 47, absent: 3, late: 2 },
  { day: "Fri", present: 44, absent: 6, late: 4 },
  { day: "Sat", present: 20, absent: 28, late: 2 },
];

const departmentData = [
  { name: "Engineering", value: 18, color: "#3b82f6" },
  { name: "HR",          value: 7,  color: "#8b5cf6" },
  { name: "Finance",     value: 9,  color: "#10b981" },
  { name: "Sales",       value: 12, color: "#f59e0b" },
  { name: "Marketing",   value: 6,  color: "#ef4444" },
];

const growthData = [
  { month: "Jul", employees: 38 },
  { month: "Aug", employees: 42 },
  { month: "Sep", employees: 44 },
  { month: "Oct", employees: 47 },
  { month: "Nov", employees: 50 },
  { month: "Dec", employees: 52 },
];

const leaveData = [
  { type: "Sick",      count: 12, color: "#ef4444" },
  { type: "Annual",    count: 20, color: "#3b82f6" },
  { type: "Casual",    count: 8,  color: "#f59e0b" },
  { type: "Maternity", count: 3,  color: "#8b5cf6" },
  { type: "Unpaid",    count: 2,  color: "#94a3b8" },
];

const card = {
  background: "#fff", padding: "22px 24px", borderRadius: "16px",
  boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)"
};

const chartTitle = {
  fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px"
};

const chartSub = {
  fontSize: "12px", color: "var(--text-muted)", marginBottom: "18px"
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: "10px", padding: "10px 14px",
      boxShadow: "var(--shadow-md)", fontSize: "12.5px"
    }}>
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
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)",
      background: "var(--bg-main)", padding: "3px 9px",
      borderRadius: "20px", border: "1px solid var(--border)"
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

export default function DashboardCharts() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px", marginTop: "24px" }}>

      {/* Attendance Trend */}
      <div style={{ ...card, gridColumn: "span 2" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <h3 style={chartTitle}>Attendance Trend</h3>
            <p style={chartSub}>Weekly attendance overview</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <ChartBadge label="Present" color="#3b82f6" />
            <ChartBadge label="Absent" color="#ef4444" />
            <ChartBadge label="Late" color="#f59e0b" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={attendanceTrend} barSize={16} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
            <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Distribution */}
      <div style={card}>
        <h3 style={chartTitle}>Department Distribution</h3>
        <p style={chartSub}>Headcount by department</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              innerRadius={45}
              paddingAngle={3}
            >
              {departmentData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} employees`, name]}
              contentStyle={{ borderRadius: "10px", border: "1px solid var(--border)", fontSize: "12px" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11.5px", paddingTop: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Employee Growth */}
      <div style={card}>
        <h3 style={chartTitle}>Employee Growth</h3>
        <p style={chartSub}>Headcount trend last 6 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={growthData}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="employees" stroke="#3b82f6" strokeWidth={2.5} fill="url(#growthGrad)" name="Employees" dot={{ fill: "#3b82f6", r: 4, strokeWidth: 2, stroke: "#fff" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Leave Analytics */}
      <div style={card}>
        <h3 style={chartTitle}>Leave Analytics</h3>
        <p style={chartSub}>Leave requests by type this month</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={leaveData} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="type" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={65} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Requests">
              {leaveData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
