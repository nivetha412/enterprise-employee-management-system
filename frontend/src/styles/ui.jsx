// ─── Enterprise Design System ────────────────────────────────────────────────

export const s = {

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 24px rgba(30,64,175,0.07), 0 1px 4px rgba(0,0,0,0.05)",
    border: "1px solid rgba(255,255,255,0.9)",
    marginBottom: "20px",
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitle: {
    fontSize: "21px", fontWeight: 800,
    color: "#0f172a", marginBottom: "2px",
    letterSpacing: "-0.03em",
  },
  pageSubtitle: {
    fontSize: "13px", color: "#64748b", marginBottom: "0",
  },

  // ── Section titles ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: "14px", fontWeight: 700,
    color: "#0f172a", marginBottom: "16px",
    display: "flex", alignItems: "center", gap: "8px",
  },

  // ── Labels ────────────────────────────────────────────────────────────────
  label: {
    display: "block", fontSize: "11px",
    fontWeight: 700, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.07em",
    marginBottom: "5px",
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  input: {
    width: "100%", padding: "9px 13px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "11px", fontSize: "13.5px",
    outline: "none", color: "#0f172a",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(8px)",
    transition: "border-color 0.18s, box-shadow 0.18s",
    fontFamily: "var(--font)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  select: {
    padding: "9px 13px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "11px", fontSize: "13.5px",
    outline: "none", color: "#0f172a",
    background: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    minWidth: "200px", fontFamily: "var(--font)",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%)",
    color: "#fff", border: "none",
    borderRadius: "11px", fontSize: "13px",
    fontWeight: 700, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    transition: "opacity 0.18s, transform 0.18s, box-shadow 0.18s",
    fontFamily: "var(--font)",
    boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
    letterSpacing: "-0.01em",
  },
  btnSuccess: {
    padding: "7px 14px",
    background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    color: "#059669",
    border: "1px solid #6ee7b7",
    borderRadius: "9px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)",
    boxShadow: "0 1px 4px rgba(5,150,105,0.12)",
  },
  btnDanger: {
    padding: "7px 14px",
    background: "linear-gradient(135deg,#fff5f5,#fee2e2)",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "9px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)",
    boxShadow: "0 1px 4px rgba(220,38,38,0.1)",
  },
  btnWarning: {
    padding: "7px 14px",
    background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    color: "#d97706",
    border: "1px solid #fde68a",
    borderRadius: "9px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)",
    boxShadow: "0 1px 4px rgba(217,119,6,0.1)",
  },
  btnGhost: {
    padding: "7px 14px",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(8px)",
    color: "#475569",
    border: "1.5px solid #e2e8f0",
    borderRadius: "11px", fontSize: "13px",
    fontWeight: 500, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    transition: "all 0.15s", fontFamily: "var(--font)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  table: {
    width: "100%", borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    padding: "11px 14px", textAlign: "left",
    fontSize: "10.5px", fontWeight: 800,
    color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.08em",
    background: "linear-gradient(180deg,#f8fafc,#f1f5f9)",
    borderBottom: "1.5px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "13px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a", verticalAlign: "middle",
  },

  // ── Badges ────────────────────────────────────────────────────────────────
  badge: (color, bg) => ({
    display: "inline-flex", alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px", fontWeight: 700,
    color, background: bg,
    whiteSpace: "nowrap",
    boxShadow: `0 1px 4px ${color}22`,
    letterSpacing: "0.01em",
  }),
};

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, meta, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px", marginBottom: "24px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {icon && (
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 6px 20px rgba(30,64,175,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}>
            {icon}
          </div>
        )}
        <div>
          <h1 style={s.pageTitle}>{title}</h1>
          <p style={s.pageSubtitle}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {meta}{children}
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, color = "#1e40af", bg = "#eff6ff", icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderRadius: "16px", padding: "16px 20px",
      border: "1px solid rgba(255,255,255,0.95)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      display: "flex", alignItems: "center", gap: "14px",
      minWidth: "140px", flex: "1 1 140px",
      transition: "transform 0.18s, box-shadow 0.18s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${color}18, 0 2px 8px rgba(0,0,0,0.06)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)"; }}
    >
      <div style={{
        width: "42px", height: "42px", borderRadius: "12px",
        background: `linear-gradient(135deg, ${bg}, ${color}22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: "18px",
        boxShadow: `0 4px 12px ${color}25`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "22px", fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.03em" }}>{value}</div>
        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px", fontWeight: 600, letterSpacing: "0.01em" }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, subtitle }) {
  return (
    <div style={{ padding: "56px 24px", textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "20px",
        background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "32px", margin: "0 auto 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
      }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>{title}</div>
      {subtitle && <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>{subtitle}</div>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "success" }) {
  if (!message) return null;
  const cfg = {
    success: { grad: "linear-gradient(135deg,#ecfdf5,#d1fae5)", color: "#059669", border: "#6ee7b7", icon: "✓", shadow: "rgba(5,150,105,0.2)" },
    error:   { grad: "linear-gradient(135deg,#fff5f5,#fee2e2)", color: "#dc2626", border: "#fecaca", icon: "✕", shadow: "rgba(220,38,38,0.2)" },
  };
  const c = cfg[type] || cfg.success;
  return (
    <div style={{
      position: "fixed", top: "84px", right: "24px", zIndex: 9999,
      background: c.grad, color: c.color,
      border: `1px solid ${c.border}`,
      borderRadius: "14px", padding: "13px 20px", fontSize: "13px",
      fontWeight: 700, boxShadow: `0 8px 32px ${c.shadow}`,
      display: "flex", alignItems: "center", gap: "10px",
      animation: "fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)",
      backdropFilter: "blur(12px)",
    }}>
      <span style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: c.color, color: "#fff", fontSize: "11px",
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800,
        flexShrink: 0,
      }}>{c.icon}</span>
      {message}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name = "", size = 34, color = "#1e40af", bg = "#dbeafe" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}, ${color}33)`,
      color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.34 + "px", flexShrink: 0,
      letterSpacing: "-0.02em",
      boxShadow: `0 2px 8px ${color}30`,
      border: `1.5px solid ${color}22`,
    }}>
      {initials || "?"}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, count, countColor = "#1e40af", countBg = "#eff6ff", children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "10px", marginBottom: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{title}</span>
        {count !== undefined && (
          <span style={{
            fontSize: "11px", fontWeight: 700, color: countColor,
            background: countBg, padding: "2px 9px", borderRadius: "20px",
            boxShadow: `0 1px 4px ${countColor}22`,
          }}>{count}</span>
        )}
      </div>
      {children && <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({ label, error, children, span }) {
  return (
    <div style={span ? { gridColumn: `span ${span}` } : {}}>
      {label && <label style={s.label}>{label}</label>}
      {children}
      {error && (
        <span style={{ color: "#dc2626", fontSize: "11px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#dc2626", display: "inline-block", flexShrink: 0 }} />
          {error}
        </span>
      )}
    </div>
  );
}
