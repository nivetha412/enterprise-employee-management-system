// ─── Shared Enterprise Design System ────────────────────────────────────────

export const s = {

  // ── Page header ──────────────────────────────────────────────────────────
  pageTitle: {
    fontSize: "20px", fontWeight: 700,
    color: "var(--text-primary)", marginBottom: "2px",
    letterSpacing: "-0.02em"
  },
  pageSubtitle: {
    fontSize: "13px", color: "var(--text-muted)", marginBottom: "0"
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    border: "1px solid var(--border)",
    marginBottom: "20px"
  },

  // ── Section titles ────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: "14px", fontWeight: 700,
    color: "var(--text-primary)", marginBottom: "16px",
    display: "flex", alignItems: "center", gap: "8px"
  },

  // ── Form labels ───────────────────────────────────────────────────────────
  label: {
    display: "block", fontSize: "11.5px",
    fontWeight: 600, color: "var(--text-secondary)",
    textTransform: "uppercase", letterSpacing: "0.06em",
    marginBottom: "5px"
  },

  // ── Inputs ────────────────────────────────────────────────────────────────
  input: {
    width: "100%", padding: "9px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: "10px", fontSize: "13.5px",
    outline: "none", color: "var(--text-primary)",
    background: "#fff", transition: "border-color 0.18s, box-shadow 0.18s",
    fontFamily: "var(--font)"
  },
  select: {
    padding: "9px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: "10px", fontSize: "13.5px",
    outline: "none", color: "var(--text-primary)",
    background: "#fff", cursor: "pointer",
    minWidth: "200px", fontFamily: "var(--font)",
    transition: "border-color 0.18s"
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  btnPrimary: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #1e40af, #2563eb)",
    color: "#fff", border: "none",
    borderRadius: "10px", fontSize: "13px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    transition: "opacity 0.18s, transform 0.18s",
    fontFamily: "var(--font)"
  },
  btnSuccess: {
    padding: "7px 14px",
    background: "#ecfdf5",
    color: "#059669",
    border: "1px solid #6ee7b7",
    borderRadius: "8px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)"
  },
  btnDanger: {
    padding: "7px 14px",
    background: "#fff5f5",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "8px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)"
  },
  btnWarning: {
    padding: "7px 14px",
    background: "#fffbeb",
    color: "#d97706",
    border: "1px solid #fde68a",
    borderRadius: "8px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "5px",
    transition: "all 0.15s", fontFamily: "var(--font)"
  },
  btnGhost: {
    padding: "7px 14px",
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1.5px solid var(--border)",
    borderRadius: "10px", fontSize: "13px",
    fontWeight: 500, cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: "6px",
    transition: "all 0.15s", fontFamily: "var(--font)"
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  table: {
    width: "100%", borderCollapse: "collapse",
    fontSize: "13px"
  },
  th: {
    padding: "10px 14px", textAlign: "left",
    fontSize: "10.5px", fontWeight: 700,
    color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.07em",
    background: "#f8fafc",
    borderBottom: "1px solid var(--border)",
    whiteSpace: "nowrap"
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f1f5f9",
    color: "var(--text-primary)", verticalAlign: "middle"
  },

  // ── Badges ────────────────────────────────────────────────────────────────
  badge: (color, bg) => ({
    display: "inline-flex", alignItems: "center",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px", fontWeight: 600,
    color, background: bg,
    whiteSpace: "nowrap"
  }),
};

// ─── Page Header Component ────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle, meta, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px", marginBottom: "20px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {icon && (
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px",
            background: "linear-gradient(135deg, #1e40af, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: "0 4px 12px rgba(30,64,175,0.3)"
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
        {meta}
        {children}
      </div>
    </div>
  );
}

// ─── Stat Mini Card ───────────────────────────────────────────────────────────
export function StatCard({ label, value, color = "#1e40af", bg = "#eff6ff", icon }) {
  return (
    <div style={{
      background: "#fff", borderRadius: "12px", padding: "14px 18px",
      border: "1px solid var(--border)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      display: "flex", alignItems: "center", gap: "12px",
      minWidth: "130px", flex: "1 1 130px"
    }}>
      <div style={{
        width: "36px", height: "36px", borderRadius: "10px",
        background: bg, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0, fontSize: "16px"
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "20px", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, subtitle }) {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>{title}</div>
      {subtitle && <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{subtitle}</div>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type = "success" }) {
  if (!message) return null;
  const cfg = {
    success: { bg: "#ecfdf5", color: "#059669", border: "#6ee7b7", icon: "✓" },
    error:   { bg: "#fff5f5", color: "#dc2626", border: "#fecaca", icon: "✕" },
  };
  const c = cfg[type] || cfg.success;
  return (
    <div style={{
      position: "fixed", top: "80px", right: "24px", zIndex: 9999,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: "12px", padding: "12px 18px", fontSize: "13px",
      fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", gap: "8px",
      animation: "fadeInUp 0.3s ease"
    }}>
      <span style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: c.color, color: "#fff", fontSize: "11px",
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
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
      background: bg, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.35 + "px", flexShrink: 0,
      letterSpacing: "-0.02em"
    }}>
      {initials || "?"}
    </div>
  );
}

// ─── Section Header (inside card) ────────────────────────────────────────────
export function SectionHeader({ title, count, countColor = "#1e40af", countBg = "#eff6ff", children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "10px", marginBottom: "16px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{title}</span>
        {count !== undefined && (
          <span style={{
            fontSize: "11px", fontWeight: 700, color: countColor,
            background: countBg, padding: "2px 8px", borderRadius: "20px"
          }}>{count}</span>
        )}
      </div>
      {children && <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{children}</div>}
    </div>
  );
}

// ─── Field wrapper with label + error ────────────────────────────────────────
export function Field({ label, error, children, span }) {
  return (
    <div style={span ? { gridColumn: `span ${span}` } : {}}>
      {label && <label style={s.label}>{label}</label>}
      {children}
      {error && (
        <span style={{ color: "var(--danger)", fontSize: "11px", marginTop: "3px", display: "block" }}>
          {error}
        </span>
      )}
    </div>
  );
}
