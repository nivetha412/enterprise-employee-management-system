import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useEmployee } from "../../hooks/useEmployee";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const STATUS_DOT = {
  PRESENT: "#10b981",
  ABSENT:  "#ef4444",
  LATE:    "#f59e0b",
  LEAVE:   "#8b5cf6",
};

const STATUS_BG = {
  PRESENT: "#ecfdf5",
  ABSENT:  "#fef2f2",
  LATE:    "#fffbeb",
  LEAVE:   "#f5f3ff",
};

export default function EmpDashCalendar() {
  const { attendance } = useEmployee();
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells       = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const pad = n => String(n).padStart(2, "0");
  const attMap = {};
  attendance.forEach(r => { if (r.attendanceDate) attMap[r.attendanceDate] = r.status; });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const isToday = d => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const counts = {};
  cells.forEach(d => {
    if (!d) return;
    const key = `${year}-${pad(month + 1)}-${pad(d)}`;
    const s   = attMap[key];
    if (s) counts[s] = (counts[s] || 0) + 1;
  });

  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance Calendar</h3>
          <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{MONTHS[month]} {year}</p>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {[{ fn: prev, I: RiArrowLeftSLine }, { fn: next, I: RiArrowRightSLine }].map(({ fn, I }, i) => (
            <button key={i} onClick={fn} style={{ width: 28, height: 28, borderRadius: 7, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
              <I size={16} color="#475569" />
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px", marginBottom: "4px" }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: "9.5px", fontWeight: 700, color: i === 0 || i === 6 ? "#f87171" : "#94a3b8", padding: "3px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" }}>
          {cells.map((d, i) => {
            const key    = d ? `${year}-${pad(month + 1)}-${pad(d)}` : null;
            const status = key ? attMap[key] : null;
            const dot    = status ? STATUS_DOT[status] : null;
            const bg     = status ? STATUS_BG[status] : null;
            const tod    = isToday(d);
            const col    = i % 7;
            const isWknd = col === 0 || col === 6;
            return (
              <div key={i} title={status || ""} style={{
                textAlign: "center", padding: "5px 2px", fontSize: "11px",
                fontWeight: tod ? 800 : 400, borderRadius: "7px", minHeight: "30px",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px",
                background: tod ? "linear-gradient(135deg,#1e40af,#3b82f6)" : bg || "transparent",
                color: tod ? "#fff" : d ? (isWknd ? "#f87171" : "#0f172a") : "transparent",
                boxShadow: tod ? "0 2px 8px rgba(30,64,175,0.3)" : "none",
                cursor: d ? "pointer" : "default",
                transition: "transform 0.12s",
              }}
                onMouseEnter={e => { if (d && !tod) e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                {d || ""}
                {dot && !tod && <span style={{ width: 4, height: 4, borderRadius: "50%", background: dot, display: "block" }} />}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
          {Object.entries(STATUS_DOT).map(([s, c]) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "block" }} />
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 500 }}>
                {s.charAt(0) + s.slice(1).toLowerCase()} {counts[s] ? `(${counts[s]})` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
