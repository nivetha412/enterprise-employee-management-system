import { useState, useMemo } from "react";
import { RiSearchLine, RiDownloadLine, RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";

const STATUS_CFG = {
  PRESENT: { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  LATE:    { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  ABSENT:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  LEAVE:   { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  HOLIDAY: { color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
};

const inp = {
  padding: "8px 12px", borderRadius: "10px", fontSize: "12.5px",
  border: "1.5px solid #e2e8f0", outline: "none", background: "#f8fafc",
  color: "#0f172a", fontFamily: "inherit", transition: "border-color 0.15s",
};

export default function EmpAttHistory({ records = [], onExport, loading }) {
  const [search,  setSearch]  = useState("");
  const [status,  setStatus]  = useState("ALL");
  const [month,   setMonth]   = useState("ALL");

  const months = useMemo(() => {
    const set = new Set(records.map(r => r.attendanceDate?.slice(0, 7)).filter(Boolean));
    return ["ALL", ...Array.from(set).sort().reverse()];
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const st = r.lateArrival && r.status === "PRESENT" ? "LATE" : r.status;
      if (search && !r.attendanceDate?.includes(search) && !st.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== "ALL" && st !== status) return false;
      if (month  !== "ALL" && !r.attendanceDate?.startsWith(month)) return false;
      return true;
    }).sort((a, b) => (b.attendanceDate || "").localeCompare(a.attendanceDate || ""));
  }, [records, search, status, month]);

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance History</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{filtered.length} records</p>
        </div>
        <button onClick={onExport} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1e40af", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
          onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}>
          <RiDownloadLine size={13} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: "12px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <RiSearchLine size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search date or status…"
            style={{ ...inp, paddingLeft: "32px", width: "100%" }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ ...inp, cursor: "pointer" }}
          onFocus={e => e.target.style.borderColor = "#3b82f6"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
          {months.map(m => <option key={m} value={m}>{m === "ALL" ? "All Months" : m}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ ...inp, cursor: "pointer" }}
          onFocus={e => e.target.style.borderColor = "#3b82f6"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
          {["ALL","PRESENT","LATE","ABSENT","LEAVE","HOLIDAY"].map(s => (
            <option key={s} value={s}>{s === "ALL" ? "All Status" : s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg,#f8fafc,#f1f5f9)" }}>
              {["Date","Check-In","Check-Out","Hours Worked","Status","Punctuality"].map((h, i) => (
                <th key={i} style={{ padding: "11px 18px", textAlign: "left", fontSize: "10.5px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1.5px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                  {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40, width: "90%", borderRadius: 8 }} />)}
                </div>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "56px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>📭</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>No records match your filters</div>
              </td></tr>
            ) : filtered.map((r, idx) => {
              const st  = r.lateArrival && r.status === "PRESENT" ? "LATE" : r.status;
              const cfg = STATUS_CFG[st] || STATUS_CFG.PRESENT;
              const hoursOk = (r.workingHours || 0) >= 8;
              return (
                <tr key={r.id || idx} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                          {new Date(r.attendanceDate).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                          {new Date(r.attendanceDate).getDate()}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>
                          {new Date(r.attendanceDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>{r.attendanceDate}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    {r.checkInTime ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#059669", fontWeight: 700, fontSize: "12.5px", background: "#ecfdf5", padding: "4px 10px", borderRadius: "8px", border: "1px solid #6ee7b7" }}>
                        <RiLoginBoxLine size={12} /> {r.checkInTime}
                      </span>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    {r.checkOutTime ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#1e40af", fontWeight: 700, fontSize: "12.5px", background: "#eff6ff", padding: "4px 10px", borderRadius: "8px", border: "1px solid #93c5fd" }}>
                        <RiLogoutBoxLine size={12} /> {r.checkOutTime}
                      </span>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 18px", minWidth: "120px" }}>
                    {r.workingHours > 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 700, fontSize: "13px", color: hoursOk ? "#059669" : "#d97706" }}>{r.workingHours.toFixed(1)}h</span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>/ 8h</span>
                        </div>
                        <div style={{ height: "4px", borderRadius: "99px", background: "#f1f5f9", width: "80px", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "99px", width: `${Math.min((r.workingHours / 8) * 100, 100)}%`, background: hoursOk ? "#10b981" : "#f59e0b" }} />
                        </div>
                      </div>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color }} />
                      {st}
                    </span>
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    {st === "PRESENT" || st === "LATE" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", color: r.lateArrival ? "#d97706" : "#059669", background: r.lateArrival ? "#fffbeb" : "#ecfdf5", border: `1px solid ${r.lateArrival ? "#fcd34d" : "#6ee7b7"}` }}>
                        {r.lateArrival ? "⚠ Late" : "✓ On Time"}
                      </span>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
