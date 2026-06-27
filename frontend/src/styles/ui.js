export const s = {
  pageTitle: {
    fontSize: "22px", fontWeight: 700,
    color: "var(--text-primary)", marginBottom: "4px"
  },
  pageSubtitle: {
    fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px"
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "var(--shadow-sm)",
    border: "1px solid var(--border)",
    marginBottom: "24px"
  },
  sectionTitle: {
    fontSize: "14px", fontWeight: 700,
    color: "var(--text-primary)", marginBottom: "16px"
  },
  label: {
    display: "block", fontSize: "12px",
    fontWeight: 600, color: "var(--text-secondary)",
    textTransform: "uppercase", letterSpacing: "0.05em",
    marginBottom: "6px"
  },
  input: {
    width: "100%", padding: "9px 13px",
    border: "1.5px solid var(--border)",
    borderRadius: "8px", fontSize: "13.5px",
    outline: "none", color: "var(--text-primary)",
    background: "#fafafa", transition: "border-color 0.2s"
  },
  select: {
    padding: "9px 13px",
    border: "1.5px solid var(--border)",
    borderRadius: "8px", fontSize: "13.5px",
    outline: "none", color: "var(--text-primary)",
    background: "#fafafa", cursor: "pointer",
    minWidth: "200px"
  },
  btnPrimary: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "#fff", border: "none",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: 600, cursor: "pointer"
  },
  btnSuccess: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #059669, #047857)",
    color: "#fff", border: "none",
    borderRadius: "8px", fontSize: "13px",
    fontWeight: 600, cursor: "pointer"
  },
  btnDanger: {
    padding: "6px 13px",
    background: "var(--danger-bg)",
    color: "var(--danger)",
    border: "1px solid #fecaca",
    borderRadius: "6px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer"
  },
  btnWarning: {
    padding: "6px 13px",
    background: "var(--warning-bg)",
    color: "var(--warning)",
    border: "1px solid #fde68a",
    borderRadius: "6px", fontSize: "12px",
    fontWeight: 600, cursor: "pointer",
    marginRight: "6px"
  },
  table: {
    width: "100%", borderCollapse: "collapse",
    fontSize: "13.5px"
  },
  th: {
    padding: "11px 14px", textAlign: "left",
    fontSize: "11px", fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase", letterSpacing: "0.06em",
    background: "var(--bg-main)",
    borderBottom: "1px solid var(--border)"
  },
  td: {
    padding: "13px 14px",
    borderBottom: "1px solid var(--border)",
    color: "var(--text-primary)", verticalAlign: "middle"
  },
  badge: (color, bg) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px", fontWeight: 600,
    color, background: bg
  })
};
