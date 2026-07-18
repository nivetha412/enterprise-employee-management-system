import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { RiAddLine, RiDownloadLine, RiRefreshLine, RiBuilding2Line, RiTimeLine, RiUserStarLine, RiArrowRightLine } from "react-icons/ri";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#0891b2", "#dc2626", "#0d9488", "#ea580c"];

function QuickActionBtn({ icon, label, sub, color, bg, border, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 14px", borderRadius: 12,
      border: `1.5px solid ${border}`, background: bg,
      cursor: "pointer", fontFamily: "var(--font)",
      transition: "all 0.15s", width: "100%", textAlign: "left",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{sub}</div>}
      </div>
      <RiArrowRightLine size={14} color={color} />
    </button>
  );
}

function PanelCard({ title, icon, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function DeptSidePanel({ departments, getDeptEmployees, onAdd, onExport, onRefresh }) {
  const chartData = departments
    .map((d, i) => ({ name: d.departmentName, value: getDeptEmployees(d).length, color: COLORS[i % COLORS.length] }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalEmp = chartData.reduce((s, d) => s + d.value, 0);

  // Recent activity: last 5 departments sorted by id desc (newest first)
  const recentDepts = [...departments].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Distribution Chart */}
      <PanelCard title="Department Distribution" icon={<RiBuilding2Line size={15} color="#2563eb" />}>
        {chartData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8", fontSize: 12.5 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📊</div>
            No employee data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={3} dataKey="value">
                  {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, fontFamily: "var(--font)" }}
                  formatter={(v, n) => [`${v} employee${v !== 1 ? "s" : ""}`, n]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
              {chartData.map((d, i) => {
                const pct = totalEmp > 0 ? Math.round((d.value / totalEmp) * 100) : 0;
                return (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 11.5, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{d.name}</span>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{d.value} ({pct}%)</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: d.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PanelCard>

      {/* Recent Department Activity */}
      <PanelCard title="Recent Departments" icon={<RiTimeLine size={15} color="#7c3aed" />}>
        {recentDepts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 12.5 }}>No departments yet</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentDepts.map((d, i) => {
              const empCount = getDeptEmployees(d).length;
              const color = COLORS[i % COLORS.length];
              return (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <RiBuilding2Line size={15} color={color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.departmentName}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {empCount} employee{empCount !== 1 ? "s" : ""}{d.departmentCode ? ` · ${d.departmentCode}` : ""}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: d.active !== false ? "#dcfce7" : "#fee2e2",
                    color: d.active !== false ? "#16a34a" : "#dc2626",
                  }}>
                    {d.active !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </PanelCard>

      {/* Quick Actions */}
      <PanelCard title="Quick Actions" icon={<RiUserStarLine size={15} color="#059669" />}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <QuickActionBtn
            icon={<RiAddLine size={16} />}
            label="Add New Department"
            sub="Create a new department"
            color="#2563eb" bg="#eff6ff" border="#bfdbfe"
            onClick={onAdd}
          />
          <QuickActionBtn
            icon={<RiDownloadLine size={16} />}
            label="Export to CSV"
            sub="Download department report"
            color="#059669" bg="#ecfdf5" border="#6ee7b7"
            onClick={onExport}
          />
          <QuickActionBtn
            icon={<RiRefreshLine size={16} />}
            label="Refresh Data"
            sub="Sync with latest records"
            color="#7c3aed" bg="#f5f3ff" border="#ddd6fe"
            onClick={onRefresh}
          />
        </div>
      </PanelCard>

    </div>
  );
}
