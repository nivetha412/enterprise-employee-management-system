import { RiBarChartLine } from "react-icons/ri";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TREND_DATA = [
  { month: "Jan", pct: 88, hours: 168 },
  { month: "Feb", pct: 92, hours: 152 },
  { month: "Mar", pct: 85, hours: 160 },
  { month: "Apr", pct: 95, hours: 176 },
  { month: "May", pct: 90, hours: 168 },
  { month: "Jun", pct: 94, hours: 142 },
];

function BarChart({ data, valueKey, label, colorFn, maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]));
  return (
    <div>
      <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
        {data.map((d, i) => {
          const h = Math.round((d[valueKey] / max) * 72);
          const color = colorFn(d[valueKey]);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "9px", fontWeight: 700, color }}>{d[valueKey]}{valueKey === "pct" ? "%" : "h"}</span>
              <div style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                height: `${h}px`,
                background: `linear-gradient(180deg, ${color}, ${color}cc)`,
                transition: "height 0.5s ease",
                cursor: "pointer",
                position: "relative",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              />
              <span style={{ fontSize: "8.5px", color: "#94a3b8", fontWeight: 600 }}>{d.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutRing({ pct, color, size = 80 }) {
  const r = (size / 2) - 9;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{pct}%</text>
      <text x={size/2} y={size/2 + 10} textAnchor="middle" fontSize="8" fontWeight="600" fill="#94a3b8">This Month</text>
    </svg>
  );
}

export default function EmpAttendanceAnalytics() {
  const latestPct = TREND_DATA[TREND_DATA.length - 1].pct;
  const pctColor  = latestPct >= 90 ? "#10b981" : latestPct >= 75 ? "#3b82f6" : "#f59e0b";

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(30,64,175,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      border: "1px solid #e8edf5", overflow: "hidden",
    }}>
      <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RiBarChartLine size={15} color="#1e40af" />
        </div>
        <div>
          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Analytics</h3>
          <p style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "1px" }}>6-month performance</p>
        </div>
      </div>

      <div style={{ padding: "18px 22px", display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Donut */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <DonutRing pct={latestPct} color={pctColor} size={90} />
          <span style={{ fontSize: "10.5px", color: "#475569", fontWeight: 600 }}>Attendance Rate</span>
        </div>

        {/* Charts */}
        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <BarChart
            data={TREND_DATA}
            valueKey="pct"
            label="Monthly Attendance %"
            colorFn={v => v >= 90 ? "#10b981" : v >= 75 ? "#3b82f6" : "#f59e0b"}
            maxVal={100}
          />
          <BarChart
            data={TREND_DATA}
            valueKey="hours"
            label="Working Hours"
            colorFn={() => "#8b5cf6"}
          />
        </div>
      </div>
    </div>
  );
}
