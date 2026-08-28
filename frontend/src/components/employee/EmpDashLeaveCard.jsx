import { useEffect, useState } from "react";
import { RiCalendarCheckLine, RiTimeLine, RiCheckLine, RiCloseLine, RiAddLine } from "react-icons/ri";
import { useDomainNav } from "../../context/RoleContext";
import { useEmployee } from "../../hooks/useEmployee";
import api from "../../services/api";

const LEAVE_TYPES = [
  { key: "CASUAL_LEAVE",  balanceKey: "casualLeaveBalance", label: "Casual Leave", color: "#3b82f6", bg: "#eff6ff" },
  { key: "SICK_LEAVE",    balanceKey: "sickLeaveBalance", label: "Sick Leave", color: "#10b981", bg: "#ecfdf5" },
  { key: "EARNED_LEAVE",  balanceKey: "earnedLeaveBalance", label: "Earned Leave", color: "#8b5cf6", bg: "#f5f3ff" },
];

export default function EmpDashLeaveCard() {
  const navigate = useDomainNav();
  const { leaveStats, loading } = useEmployee();
  const [balances, setBalances] = useState(null);
  const [balancesLoading, setBalancesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get("/leave/balance/mine")
      .then(response => { if (active) setBalances(response.data); })
      .catch(() => { if (active) setBalances(null); })
      .finally(() => { if (active) setBalancesLoading(false); });
    return () => { active = false; };
  }, []);

  const statCards = [
    { icon: RiCalendarCheckLine, label: "Total",    value: leaveStats.total,    color: "#1e40af", bg: "#eff6ff" },
    { icon: RiTimeLine,          label: "Pending",  value: leaveStats.pending,  color: "#d97706", bg: "#fffbeb" },
    { icon: RiCheckLine,         label: "Approved", value: leaveStats.approved, color: "#059669", bg: "#ecfdf5" },
    { icon: RiCloseLine,         label: "Rejected", value: leaveStats.rejected, color: "#dc2626", bg: "#fef2f2" },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Leave Overview</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Your leave summary</p>
        </div>
        <button onClick={() => navigate("/leave")} style={{
          display: "flex", alignItems: "center", gap: "5px", padding: "6px 13px",
          borderRadius: "10px", fontSize: "11.5px", fontWeight: 700, cursor: "pointer",
          border: "none", background: "linear-gradient(135deg,#1e40af,#2563eb)", color: "#fff",
          boxShadow: "0 4px 12px rgba(37,99,235,0.3)", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(37,99,235,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.3)"; }}
        >
          <RiAddLine size={13} /> Apply
        </button>
      </div>

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          {statCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} style={{ background: bg, borderRadius: "11px", padding: "11px 13px", transition: "transform 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={12} color={color} />
                </div>
                <span style={{ fontSize: "9.5px", color, fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1 }}>{loading ? "…" : value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>Leave Breakdown</div>
          {LEAVE_TYPES.map(({ key, balanceKey, label, color }) => {
            const balance = balances?.[balanceKey];
            return (
              <div key={key} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: color }} />
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#475569" }}>{label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color }}>{balancesLoading ? "..." : balance ?? "—"}</span>
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>d remaining</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
