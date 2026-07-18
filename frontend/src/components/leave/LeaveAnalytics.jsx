import { useMemo } from "react";

const card = { background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
const secTitle = { fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 13 };

const TYPE_COLORS = {
  CASUAL_LEAVE:   "#d97706",
  SICK_LEAVE:     "#dc2626",
  EARNED_LEAVE:   "#2563eb",
  COMP_OFF:       "#7c3aed",
  WORK_FROM_HOME: "#0891b2",
  LOSS_OF_PAY:    "#64748b",
};

// ── SVG Donut ─────────────────────────────────────────────────────────────────
function Donut({ slices, size = 100 }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total === 0) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#94a3b8" }}>No data</div>
  );
  let cum = 0;
  const paths = slices.map(sl => {
    const pct = sl.value / total;
    const a0 = cum * 2 * Math.PI - Math.PI / 2; cum += pct;
    const a1 = cum * 2 * Math.PI - Math.PI / 2;
    const r = size / 2 - 10, cx = size / 2, cy = size / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    return { d: `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${pct > 0.5 ? 1 : 0},1 ${x1},${y1}Z`, color: sl.color };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth={1.5} />)}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 26} fill="#fff" />
    </svg>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>{label}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color, flexShrink: 0, marginLeft: 8 }}>{value}</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: color, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

// ── Monthly trend bars ────────────────────────────────────────────────────────
function MonthBars({ data }) {
  if (!data.length || data.every(d => d.count === 0))
    return <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, color: "#94a3b8" }}>No leave data for this period</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  const H = 70;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: H + 20, gap: 4 }}>
      {data.map((d, i) => {
        const barH = d.count > 0 ? Math.max((d.count / max) * H, 4) : 0;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
            title={`${d.label}: ${d.count} requests`}>
            <div style={{ width: "65%", height: H, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              {barH > 0 && <div style={{ height: barH, background: "linear-gradient(180deg,#a78bfa,#7c3aed)", borderRadius: "3px 3px 0 0", transition: "height 0.4s" }} />}
            </div>
            <div style={{ fontSize: 8.5, color: "#94a3b8", marginTop: 3, textAlign: "center" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({ icon, text, sub, color, bg }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 9, background: bg, border: `1px solid ${color}18`, marginBottom: 6 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</div>
        {sub && <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LeaveAnalytics({ leaves, employees, departments, today }) {
  // Leave type distribution
  const typeData = useMemo(() => {
    const counts = {};
    leaves.forEach(l => { counts[l.leaveType] = (counts[l.leaveType] || 0) + 1; });
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count, color: TYPE_COLORS[type] || "#94a3b8" }))
      .sort((a, b) => b.count - a.count);
  }, [leaves]);

  const typeTotal = typeData.reduce((s, d) => s + d.count, 0);
  const maxType   = Math.max(...typeData.map(d => d.count), 1);

  // Monthly trend — last 6 months
  const monthlyData = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today); d.setMonth(d.getMonth() - (5 - i));
    const ym = d.toISOString().slice(0, 7);
    const count = leaves.filter(l => String(l.appliedDate || l.startDate || "").startsWith(ym)).length;
    return { label: d.toLocaleDateString("en-US", { month: "short" }), count };
  }), [leaves, today]);

  // Dept-wise leave count
  const deptData = useMemo(() =>
    departments.map(d => {
      const ids = new Set(employees.filter(e => (e.department || "").toLowerCase() === d.departmentName.toLowerCase()).map(e => e.id));
      const count = leaves.filter(l => ids.has(l.employeeId) || ids.has(Number(l.employeeId))).length;
      return { name: d.departmentName, count };
    }).filter(d => d.count > 0).sort((a, b) => b.count - a.count).slice(0, 7),
    [leaves, employees, departments]
  );
  const maxDept = Math.max(...deptData.map(d => d.count), 1);

  // Employees currently on leave
  const onLeaveNow = useMemo(() =>
    leaves.filter(l =>
      l.status === "APPROVED" &&
      String(l.startDate) <= today &&
      String(l.endDate)   >= today
    ).map(l => ({ ...l, emp: employees.find(e => e.id === l.employeeId || e.id === Number(l.employeeId)) })),
    [leaves, employees, today]
  );

  // Returning today
  const returningToday = useMemo(() =>
    leaves.filter(l => l.status === "APPROVED" && String(l.endDate) === today)
      .map(l => employees.find(e => e.id === l.employeeId || e.id === Number(l.employeeId))).filter(Boolean),
    [leaves, employees, today]
  );

  // Notifications
  const newRequests  = leaves.filter(l => l.status === "PENDING").length;
  const pendingCount = newRequests;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14, marginBottom: 18 }}>

      {/* Monthly Trend — 8 cols */}
      <div style={{ ...card, gridColumn: "span 8" }}>
        <div style={secTitle}>Monthly Leave Trend · Last 6 Months</div>
        <MonthBars data={monthlyData} />
      </div>

      {/* Leave Type Pie — 4 cols */}
      <div style={{ ...card, gridColumn: "span 4" }}>
        <div style={secTitle}>Leave Type Distribution</div>
        {typeTotal === 0
          ? <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "24px 0" }}>No leave data yet</div>
          : <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Donut size={96} slices={typeData.map(d => ({ value: d.count, color: d.color }))} />
              <div style={{ flex: 1 }}>
                {typeData.slice(0, 5).map(d => (
                  <div key={d.type} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                      <span style={{ fontSize: 11, color: "#475569" }}>{d.type.replace(/_/g, " ")}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.color, background: d.color + "18", padding: "1px 7px", borderRadius: 20 }}>
                      {Math.round((d.count / typeTotal) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
        }
      </div>

      {/* Dept-wise — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={secTitle}>Department-wise Leave Analysis</div>
        {deptData.length === 0
          ? <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No department data</div>
          : deptData.map(d => <HBar key={d.name} label={d.name} value={d.count} max={maxDept} color="#7c3aed" />)
        }
      </div>

      {/* On Leave Now — 6 cols */}
      <div style={{ ...card, gridColumn: "span 6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
          <div style={secTitle}>Employees Currently On Leave</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", background: "#ede9fe", padding: "2px 8px", borderRadius: 20, marginBottom: 13 }}>{onLeaveNow.length}</span>
        </div>
        {onLeaveNow.length === 0
          ? <div style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "20px 0" }}>No employees on leave today</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 220, overflowY: "auto" }}>
              {onLeaveNow.map((l, i) => {
                const name = l.emp ? `${l.emp.firstName} ${l.emp.lastName}` : `Employee #${l.employeeId}`;
                const tc   = TYPE_COLORS[l.leaveType] || "#64748b";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#faf5ff", border: "1px solid #ede9fe" }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#ede9fe,#7c3aed33)",
                      color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800,
                    }}>
                      {name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                      <div style={{ fontSize: 10.5, color: "#64748b" }}>{l.emp?.department || "—"} · Returns {String(l.endDate)}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: tc, background: tc + "18", padding: "2px 7px", borderRadius: 20, flexShrink: 0 }}>
                      {(l.leaveType || "").replace(/_/g, " ")}
                    </span>
                  </div>
                );
              })}
            </div>
        }
      </div>

      {/* Notifications — full width */}
      <div style={{ ...card, gridColumn: "span 12" }}>
        <div style={secTitle}>Notifications & Alerts</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>
          {pendingCount > 0
            ? <NotifRow icon="🔔" text={`${pendingCount} leave request${pendingCount > 1 ? "s" : ""} awaiting approval`} sub="Review and take action from the table above" color="#d97706" bg="#fef3c7" />
            : <NotifRow icon="✅" text="No pending leave requests" sub="All requests have been processed" color="#059669" bg="#f0fdf4" />
          }
          {returningToday.length > 0
            ? <NotifRow icon="👋" text={`${returningToday.length} employee${returningToday.length > 1 ? "s" : ""} returning today`} sub={returningToday.slice(0, 2).map(e => `${e.firstName} ${e.lastName}`).join(", ")} color="#0891b2" bg="#f0f9ff" />
            : <NotifRow icon="📅" text="No employees returning today" sub="Check the on-leave list for upcoming returns" color="#64748b" bg="#f8fafc" />
          }
          {onLeaveNow.length > 0
            ? <NotifRow icon="🏖️" text={`${onLeaveNow.length} employee${onLeaveNow.length > 1 ? "s" : ""} currently on leave`} sub="Workforce availability may be reduced" color="#7c3aed" bg="#faf5ff" />
            : <NotifRow icon="🏢" text="Full workforce available today" sub="No approved leaves active today" color="#059669" bg="#f0fdf4" />
          }
        </div>
      </div>

    </div>
  );
}
