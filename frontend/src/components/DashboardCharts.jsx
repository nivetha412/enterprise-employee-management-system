import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

const attendanceData = [
  { name: "Present", value: 20 },
  { name: "Absent",  value: 5  },
  { name: "Late",    value: 3  },
];

const departmentData = [
  { name: "IT",      value: 12 },
  { name: "HR",      value: 5  },
  { name: "Finance", value: 4  },
  { name: "Sales",   value: 6  },
];

const BAR_COLORS  = ["#4f46e5", "#dc2626", "#d97706"];
const PIE_COLORS  = ["#4f46e5", "#7c3aed", "#059669", "#d97706"];

const cardStyle = {
  background: "#fff",
  padding: "22px 24px",
  borderRadius: "14px",
  flex: "1 1 340px",
  boxShadow: "var(--shadow-sm)",
  border: "1px solid var(--border)"
};

const titleStyle = {
  fontSize: "14px", fontWeight: 700,
  color: "var(--text-primary)", marginBottom: "18px"
};

function CustomBarTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: "8px", padding: "8px 14px",
        boxShadow: "var(--shadow-md)", fontSize: "13px"
      }}>
        <strong>{label}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
}

function DashboardCharts() {
  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "24px", flexWrap: "wrap" }}>

      <div style={cardStyle}>
        <h3 style={titleStyle}>📊 Attendance Summary</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={attendanceData} barSize={40}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {attendanceData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h3 style={titleStyle}>🏢 Department Distribution</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
            >
              {departmentData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "13px" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default DashboardCharts;
