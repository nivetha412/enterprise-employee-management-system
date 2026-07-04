import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const MOCK_DATA = {
  "2025-06-02": "present", "2025-06-03": "present", "2025-06-04": "present",
  "2025-06-05": "late",    "2025-06-06": "present", "2025-06-09": "present",
  "2025-06-10": "absent",  "2025-06-11": "present", "2025-06-12": "present",
  "2025-06-13": "leave",   "2025-06-16": "present", "2025-06-17": "present",
  "2025-06-18": "present", "2025-06-19": "late",    "2025-06-20": "present",
  "2025-06-23": "present", "2025-06-24": "present", "2025-06-25": "holiday",
  "2025-06-26": "present", "2025-06-27": "present",
};

const STATUS_STYLE = {
  present: { bg: "#dcfce7", color: "#16a34a", border: "#86efac", label: "Present" },
  absent:  { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5", label: "Absent"  },
  late:    { bg: "#fef3c7", color: "#d97706", border: "#fcd34d", label: "Late"    },
  leave:   { bg: "#fed7aa", color: "#ea580c", border: "#fdba74", label: "Leave"   },
  holiday: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd", label: "Holiday" },
  weekend: { bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0", label: "Weekend" },
};

const LEGEND = ["present","absent","late","leave","holiday","weekend"];

export default function EmpAttendanceCalendar({ attendanceMap = MOCK_DATA }) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const allCells    = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const pad = (n) => String(n).padStart(2, "0");
  const getStatus = (day) => {
    if (!day) return null;
    const key = `${year}-${pad(month + 1)}-${pad(day)}`;
    if (attendanceMap[key]) return attendanceMap[key];
    const col = (firstDay + day - 1) % 7;
    if (col === 0 || col === 6) return "weekend";
    return null;
  };

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const counts = {};
  allCells.forEach(d => { const s = getStatus(d); if (s) counts[s] = (counts[s] || 0) + 1; });

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Attendance Calendar</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "2px" }}>Monthly overview</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{MONTHS[month]} {year}</span>
          {[{ fn: prev, Icon: RiArrowLeftSLine }, { fn: next, Icon: RiArrowRightSLine }].map(({ fn, Icon }, i) => (
            <button key={i} onClick={fn} style={{
              width: "28px", height: "28px", borderRadius: "7px",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
            >
              <Icon size={16} color="#475569" />
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{
              textAlign: "center", fontSize: "10px", fontWeight: 700,
              color: i === 0 || i === 6 ? "#f87171" : "#94a3b8", padding: "4px 0",
            }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {allCells.map((d, i) => {
            const status = getStatus(d);
            const cfg    = status ? STATUS_STYLE[status] : null;
            const tod    = isToday(d);
            return (
              <div key={i} title={cfg ? cfg.label : ""} style={{
                textAlign: "center", padding: "6px 2px",
                fontSize: "11.5px", fontWeight: tod ? 800 : 500,
                borderRadius: "8px", minHeight: "30px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: tod ? "linear-gradient(135deg,#1e40af,#3b82f6)" : cfg ? cfg.bg : "transparent",
                color: tod ? "#fff" : cfg ? cfg.color : d ? "#0f172a" : "transparent",
                border: tod ? "none" : cfg ? `1px solid ${cfg.border}50` : "1px solid transparent",
                cursor: d ? "pointer" : "default",
                transition: "transform 0.15s",
                boxShadow: tod ? "0 2px 8px rgba(30,64,175,0.3)" : "none",
              }}
                onMouseEnter={e => { if (d && !tod) e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                {d || ""}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
          {LEGEND.map(s => {
            const cfg = STATUS_STYLE[s];
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: cfg.bg, border: `1px solid ${cfg.border}` }} />
                <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: 500 }}>{cfg.label}</span>
                {counts[s] && <span style={{ fontSize: "10px", color: cfg.color, fontWeight: 700 }}>({counts[s]})</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
