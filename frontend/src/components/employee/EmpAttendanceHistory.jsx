import { useState, useMemo } from "react";
import { RiSearchLine, RiFilterLine, RiLoginBoxLine, RiLogoutBoxLine, RiCalendarCheckLine, RiDownloadLine } from "react-icons/ri";

const MOCK_HISTORY = [
  { id:1,  date:"2025-06-27", checkIn:"09:01", checkOut:"18:05", hours:9.1,  status:"PRESENT", late:false },
  { id:2,  date:"2025-06-26", checkIn:"09:15", checkOut:"18:00", hours:8.8,  status:"PRESENT", late:false },
  { id:3,  date:"2025-06-25", checkIn:null,    checkOut:null,    hours:0,    status:"HOLIDAY", late:false },
  { id:4,  date:"2025-06-24", checkIn:"09:02", checkOut:"17:58", hours:8.9,  status:"PRESENT", late:false },
  { id:5,  date:"2025-06-23", checkIn:"09:00", checkOut:"18:10", hours:9.2,  status:"PRESENT", late:false },
  { id:6,  date:"2025-06-20", checkIn:"09:45", checkOut:"18:00", hours:8.3,  status:"PRESENT", late:true  },
  { id:7,  date:"2025-06-19", checkIn:"09:32", checkOut:"17:45", hours:8.2,  status:"LATE",    late:true  },
  { id:8,  date:"2025-06-18", checkIn:"09:00", checkOut:"18:00", hours:9.0,  status:"PRESENT", late:false },
  { id:9,  date:"2025-06-17", checkIn:"09:05", checkOut:"18:02", hours:8.9,  status:"PRESENT", late:false },
  { id:10, date:"2025-06-16", checkIn:"09:00", checkOut:"18:00", hours:9.0,  status:"PRESENT", late:false },
  { id:11, date:"2025-06-13", checkIn:null,    checkOut:null,    hours:0,    status:"LEAVE",   late:false },
  { id:12, date:"2025-06-12", checkIn:"09:03", checkOut:"17:55", hours:8.9,  status:"PRESENT", late:false },
  { id:13, date:"2025-06-11", checkIn:"09:00", checkOut:"18:00", hours:9.0,  status:"PRESENT", late:false },
  { id:14, date:"2025-06-10", checkIn:null,    checkOut:null,    hours:0,    status:"ABSENT",  late:false },
  { id:15, date:"2025-06-09", checkIn:"09:01", checkOut:"18:05", hours:9.1,  status:"PRESENT", late:false },
];

const STATUS_CFG = {
  PRESENT: { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  LATE:    { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  ABSENT:  { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  LEAVE:   { color: "#ea580c", bg: "#fff7ed", border: "#fdba74" },
  HOLIDAY: { color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
};

export default function EmpAttendanceHistory({ records = MOCK_HISTORY }) {
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterMonth,  setFilterMonth]  = useState("ALL");

  const months = useMemo(() => {
    const set = new Set(records.map(r => r.date.slice(0, 7)));
    return ["ALL", ...Array.from(set).sort().reverse()];
  }, [records]);

  const filtered = useMemo(() => records.filter(r => {
    const matchSearch = !search || r.date.includes(search) || r.status.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchMonth  = filterMonth  === "ALL" || r.date.startsWith(filterMonth);
    return matchSearch && matchStatus && matchMonth;
  }), [records, search, filterStatus, filterMonth]);

  const inputStyle = {
    padding: "8px 12px", borderRadius: "10px", fontSize: "12.5px",
    border: "1.5px solid #e2e8f0", outline: "none", background: "#f8fafc",
    color: "#0f172a", fontFamily: "inherit", transition: "border-color 0.15s",
  };

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance History</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>{filtered.length} records found</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "7px 14px", borderRadius: "10px", fontSize: "12px",
          fontWeight: 600, cursor: "pointer", border: "1px solid #bfdbfe",
          background: "#eff6ff", color: "#1e40af", transition: "all 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
          onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
        >
          <RiDownloadLine size={13} /> Export
        </button>
      </div>

      {/* Filters */}
      <div style={{ padding: "14px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <RiSearchLine size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by date or status..."
            style={{ ...inputStyle, paddingLeft: "32px", width: "100%" }}
            onFocus={e => e.target.style.borderColor = "#3b82f6"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
          onFocus={e => e.target.style.borderColor = "#3b82f6"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        >
          {months.map(m => <option key={m} value={m}>{m === "ALL" ? "All Months" : m}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
          onFocus={e => e.target.style.borderColor = "#3b82f6"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        >
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
                <th key={i} style={{
                  padding: "11px 18px", textAlign: "left",
                  fontSize: "10.5px", fontWeight: 800, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  borderBottom: "1.5px solid #e2e8f0", whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No records match your filters
              </td></tr>
            ) : filtered.map((r, idx) => {
              const cfg = STATUS_CFG[r.status] || STATUS_CFG.PRESENT;
              const hoursOk = r.hours >= 8;
              return (
                <tr key={r.id} style={{ transition: "background 0.12s", borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Date */}
                  <td style={{ padding: "13px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "9px",
                        background: "#f1f5f9", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                          {new Date(r.date).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                          {new Date(r.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>
                          {new Date(r.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#94a3b8" }}>{r.date}</div>
                      </div>
                    </div>
                  </td>

                  {/* Check-In */}
                  <td style={{ padding: "13px 18px" }}>
                    {r.checkIn ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        color: "#059669", fontWeight: 700, fontSize: "12.5px",
                        background: "#ecfdf5", padding: "4px 10px", borderRadius: "8px",
                        border: "1px solid #6ee7b7",
                      }}>
                        <RiLoginBoxLine size={12} /> {r.checkIn}
                      </span>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>

                  {/* Check-Out */}
                  <td style={{ padding: "13px 18px" }}>
                    {r.checkOut ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        color: "#1e40af", fontWeight: 700, fontSize: "12.5px",
                        background: "#eff6ff", padding: "4px 10px", borderRadius: "8px",
                        border: "1px solid #93c5fd",
                      }}>
                        <RiLogoutBoxLine size={12} /> {r.checkOut}
                      </span>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>

                  {/* Hours */}
                  <td style={{ padding: "13px 18px", minWidth: "120px" }}>
                    {r.hours > 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: 700, fontSize: "13px", color: hoursOk ? "#059669" : "#d97706" }}>
                            {r.hours.toFixed(1)}h
                          </span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>/ 8h</span>
                        </div>
                        <div style={{ height: "4px", borderRadius: "99px", background: "#f1f5f9", width: "80px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: "99px",
                            width: `${Math.min((r.hours / 8) * 100, 100)}%`,
                            background: hoursOk ? "#10b981" : "#f59e0b",
                          }} />
                        </div>
                      </div>
                    ) : <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "13px 18px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: "5px",
                      fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
                    }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.color }} />
                      {r.status}
                    </span>
                  </td>

                  {/* Punctuality */}
                  <td style={{ padding: "13px 18px" }}>
                    {r.status === "PRESENT" || r.status === "LATE" ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "5px",
                        fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                        color: r.late ? "#d97706" : "#059669",
                        background: r.late ? "#fffbeb" : "#ecfdf5",
                        border: `1px solid ${r.late ? "#fcd34d" : "#6ee7b7"}`,
                      }}>
                        {r.late ? "⚠ Late" : "✓ On Time"}
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
