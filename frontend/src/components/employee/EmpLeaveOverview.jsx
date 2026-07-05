import { useState, useEffect } from "react";
import { RiCalendarCheckLine, RiTimeLine, RiCheckLine, RiCloseLine, RiAddLine } from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";
import { useEmployee } from "../../hooks/useEmployee";
import api from "../../services/api";

const LEAVE_TYPES_META = [
  { type: "Annual Leave", key: "annual", total: 15, color: "#3b82f6", bg: "#eff6ff" },
  { type: "Sick Leave",   key: "sick",   total: 10, color: "#10b981", bg: "#ecfdf5" },
  { type: "Casual Leave", key: "casual", total: 5,  color: "#8b5cf6", bg: "#f5f3ff" },
];

export default function EmpLeaveOverview() {
  const navigate    = useDomainNav();
  const { emp }     = useEmployee();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!emp?.id) return;
    api.get(`/leaves/employee/${emp.id}/summary`)
      .then(res => setData(res.data))
      .catch(() => setData(null));
  }, [emp?.id]);

  const balance  = data?.balance  ?? 0;
  const pending  = data?.pending  ?? 0;
  const approved = data?.approved ?? 0;
  const rejected = data?.rejected ?? 0;

  const LEAVE_STATS = [
    { label: "Balance",  value: balance,  unit: "days",     color: "#1e40af", bg: "#eff6ff", border: "#93c5fd", icon: RiCalendarCheckLine },
    { label: "Pending",  value: pending,  unit: "awaiting", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", icon: RiTimeLine },
    { label: "Approved", value: approved, unit: "days",     color: "#059669", bg: "#ecfdf5", border: "#6ee7b7", icon: RiCheckLine },
    { label: "Rejected", value: rejected, unit: "day",      color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: RiCloseLine },
  ];

  const leaveTypes = LEAVE_TYPES_META.map(lt => ({
    ...lt,
    used: data?.breakdown?.[lt.key] ?? 0,
  }));

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "18px 22px 14px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Leave Overview</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Annual leave summary</p>
        </div>
        <button
          onClick={() => navigate("/leave")}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "7px 14px", borderRadius: "10px", fontSize: "11.5px",
            fontWeight: 700, cursor: "pointer", border: "none",
            background: "linear-gradient(135deg, #1e40af, #2563eb)", color: "#fff",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(37,99,235,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.3)"; }}
        >
          <RiAddLine size={13} /> Apply Leave
        </button>
      </div>

      <div style={{ padding: "18px 22px" }}>
        {/* Stat grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "18px" }}>
          {LEAVE_STATS.map(({ label, value, unit, color, bg, border, icon: Icon }) => (
            <div key={label} style={{
              background: bg, borderRadius: "12px", padding: "12px 14px",
              border: `1px solid ${border}50`,
              transition: "transform 0.15s, box-shadow 0.15s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={13} color={color} />
                </div>
                <span style={{ fontSize: "10px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
              </div>
              <div style={{ fontSize: "24px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: "10px", color: color + "80", marginTop: "2px", fontWeight: 600 }}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Leave type breakdown */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
          <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
            Leave Breakdown
          </div>
          {leaveTypes.map(({ type, used, total, color, bg }) => (
            <div key={type} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>{type}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color }}>{used}</span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>/ {total} days</span>
                </div>
              </div>
              <div style={{ height: "6px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "99px",
                  width: `${Math.min((used / total) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                  transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
