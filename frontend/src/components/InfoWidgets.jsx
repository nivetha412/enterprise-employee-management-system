import { useState } from "react";
import api from "../services/api";
import { RiCheckboxCircleLine, RiCheckLine, RiCloseLine, RiTeamLine, RiBuildingLine } from "react-icons/ri";

const AVATAR_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#0891b2"];

function Avatar({ name = "", size = 32 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const color = AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.35 + "px", flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

const widgetCard  = { background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" };
const widgetTitle = { fontSize: "13.5px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "3px", display: "flex", alignItems: "center", gap: "8px" };

// Accepts data as props — no internal API calls (avoids duplicate fetches from Dashboard)
export default function InfoWidgets({ leaves = [], employees = [], departments = [], loading = false, onRefresh }) {
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const getEmp = (id) => employees.find(e => e.id === id || e.id === Number(id));

  const pendingLeaves = leaves.filter(lv => lv.status === "PENDING");

  const updateLeaveStatus = async (id, status) => {
    const lv = pendingLeaves.find(l => l.id === id);
    if (!lv) return;
    try {
      await api.put(`/leave/${id}`, {
        employeeId: lv.employeeId, leaveType: lv.leaveType,
        startDate: lv.startDate, endDate: lv.endDate,
        reason: lv.reason, priority: lv.priority,
        ...(lv.backupEmployeeId ? { backupEmployeeId: lv.backupEmployeeId } : {}),
        status,
      });
      if (onRefresh) onRefresh();
      showToast(`Leave ${status.toLowerCase()} successfully`);
    } catch { showToast("Failed to update leave status"); }
  };

  const activeCount   = employees.filter(e => e.active).length;
  const inactiveCount = employees.filter(e => !e.active).length;

  const deptStats = departments.map(d => ({
    name: d.departmentName,
    count: employees.filter(e => (e.department || "").toLowerCase().trim() === (d.departmentName || "").toLowerCase().trim()).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {toast && (
        <div style={{ padding: "10px 16px", background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: "#059669" }}>
          {toast}
        </div>
      )}

      {/* Workforce Overview */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiTeamLine size={16} color="#3b82f6" />
          Workforce Overview
        </div>
        {loading ? (
          <div className="skeleton" style={{ height: 60, borderRadius: 10 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Total Employees", value: employees.length, color: "#1e40af", bg: "#dbeafe" },
              { label: "Active",          value: activeCount,      color: "#059669", bg: "#d1fae5" },
              { label: "Inactive",        value: inactiveCount,    color: "#dc2626", bg: "#fee2e2" },
              { label: "Departments",     value: departments.length, color: "#7c3aed", bg: "#ede9fe" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, background: bg, border: `1px solid ${color}22` }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color }}>{label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Departments by Headcount */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiBuildingLine size={16} color="#7c3aed" />
          Top Departments
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: "20px" }}>
            {departments.length}
          </span>
        </div>
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 32, borderRadius: 8, marginBottom: 8 }} />)
        ) : deptStats.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", textAlign: "center", padding: "16px 0" }}>No department data available</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {deptStats.map((d, i) => {
              const pct = employees.length > 0 ? Math.round((d.count / employees.length) * 100) : 0;
              const color = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"][i % 5];
              return (
                <div key={d.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{d.name}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color }}>{d.count} ({pct}%)</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Leave Approvals */}
      <div style={widgetCard}>
        <div style={{ ...widgetTitle, marginBottom: "14px" }}>
          <RiCheckboxCircleLine size={16} color="#ef4444" />
          Pending Approvals
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 700, color: pendingLeaves.length > 0 ? "#ef4444" : "#059669", background: pendingLeaves.length > 0 ? "#fff5f5" : "#ecfdf5", padding: "2px 8px", borderRadius: "20px" }}>
            {pendingLeaves.length} pending
          </span>
        </div>
        {loading ? (
          [...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 48, borderRadius: 10, marginBottom: 8 }} />)
        ) : pendingLeaves.length === 0 ? (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>No pending approvals</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {pendingLeaves.slice(0, 5).map(lv => {
              const emp = getEmp(lv.employeeId);
              const name = emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${lv.employeeId}`;
              const days = lv.totalDays ?? (lv.startDate && lv.endDate
                ? Math.max(1, Math.round((new Date(lv.endDate) - new Date(lv.startDate)) / 86400000) + 1)
                : "?");
              return (
                <div key={lv.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", border: "1px solid var(--border)", background: "#fafafa" }}>
                  <Avatar name={name} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{(lv.leaveType || "").replace(/_/g, " ")} · {days} day{days !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button
                      onClick={() => updateLeaveStatus(lv.id, "APPROVED")}
                      style={{ padding: "4px 9px", borderRadius: "6px", border: "none", background: "#d1fae5", color: "#059669", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      title="Approve"
                    >
                      <RiCheckLine size={12} />
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(lv.id, "REJECTED")}
                      style={{ padding: "4px 9px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#dc2626", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      title="Reject"
                    >
                      <RiCloseLine size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
            {pendingLeaves.length > 5 && (
              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", textAlign: "center", paddingTop: 4 }}>
                +{pendingLeaves.length - 5} more pending
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
