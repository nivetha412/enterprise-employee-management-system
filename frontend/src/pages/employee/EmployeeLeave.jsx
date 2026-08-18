import { useState, useMemo } from "react";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import { Toast } from "../../styles/ui.jsx";
import { RiAddLine, RiCalendarCheckLine, RiTimeLine, RiCheckLine, RiCloseLine, RiFileTextLine, RiDeleteBinLine, RiEyeLine } from "react-icons/ri";

const LEAVE_TYPES = ["CASUAL_LEAVE","SICK_LEAVE","EARNED_LEAVE","COMP_OFF","WORK_FROM_HOME","LOSS_OF_PAY"];
const PRIORITIES  = ["LOW","MEDIUM","HIGH","CRITICAL"];

const STATUS_CFG = {
  PENDING:  { color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  APPROVED: { color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  REJECTED: { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
};

function fmt(s) { return (s || "").replace(/_/g, " "); }

function ApplyModal({ emp, allEmployees, onClose, onSuccess }) {
  const [form, setForm] = useState({ leaveType: "CASUAL_LEAVE", startDate: "", endDate: "", reason: "", priority: "MEDIUM", backupEmployeeId: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalDays = form.startDate && form.endDate
    ? Math.max(0, Math.floor((new Date(form.endDate) - new Date(form.startDate)) / 86400000) + 1)
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.backupEmployeeId) { setError("Backup employee is required"); return; }
    if (Number(form.backupEmployeeId) === emp?.id) { setError("Backup employee cannot be yourself"); return; }
    setLoading(true);
    try {
      await api.post("/leave/apply", {
        employeeId:       emp.id,
        leaveType:        form.leaveType,
        startDate:        form.startDate,
        endDate:          form.endDate,
        reason:           form.reason,
        priority:         form.priority,
        backupEmployeeId: Number(form.backupEmployeeId),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || "Failed to apply leave");
    } finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", padding: "9px 13px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "13px", outline: "none", color: "#0f172a", background: "#fafafa", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.15s" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "5px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "520px", boxShadow: "0 25px 60px rgba(0,0,0,0.25)", overflow: "hidden", animation: "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", margin: 0 }}>Apply for Leave</h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>Submit a new leave request</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {error && (
            <div style={{ background: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "10px", fontSize: "13px", marginBottom: "16px", border: "1px solid #fecaca", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Leave Type</label>
              <select value={form.leaveType} onChange={e => set("leaveType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{fmt(t)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input type="date" value={form.endDate} min={form.startDate} onChange={e => set("endDate", e.target.value)} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            {totalDays > 0 && (
              <div style={{ gridColumn: "span 2" }}>
                <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "10px 14px", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: "8px" }}>
                  <RiCalendarCheckLine size={16} color="#1e40af" />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e40af" }}>{totalDays} day{totalDays !== 1 ? "s" : ""} requested</span>
                </div>
              </div>
            )}
            <div>
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Backup Employee *</label>
              <select value={form.backupEmployeeId} onChange={e => set("backupEmployeeId", e.target.value)} required style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
                <option value="">Select backup…</option>
                {allEmployees.filter(e => e.id !== emp?.id).map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Reason</label>
              <textarea value={form.reason} onChange={e => set("reason", e.target.value)} required rows={3}
                placeholder="Briefly describe the reason for your leave…"
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 2, padding: "11px", borderRadius: "10px", border: "none", background: loading ? "#a5b4fc" : "linear-gradient(135deg,#1e40af,#2563eb)", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)" }}>
              {loading ? "Submitting…" : "Submit Leave Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ViewModal({ leave, onClose }) {
  const cfg = STATUS_CFG[leave.status] || STATUS_CFG.PENDING;
  const rows = [
    { label: "Leave Type",   value: fmt(leave.leaveType) },
    { label: "Start Date",   value: leave.startDate },
    { label: "End Date",     value: leave.endDate },
    { label: "Total Days",   value: `${leave.totalDays || 1} day(s)` },
    { label: "Priority",     value: leave.priority },
    { label: "Applied Date", value: leave.appliedDate },
    { label: "Reason",       value: leave.reason },
    { label: "Remarks",      value: leave.managerRemarks || "—" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "460px", boxShadow: "0 25px 60px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#2563eb)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", margin: 0 }}>Leave Details</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>#{leave.id} — {fmt(leave.leaveType)}</span>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{leave.status}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {rows.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "12px", padding: "8px 12px", borderRadius: "9px", background: "#f8fafc" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", minWidth: "90px", flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#0f172a" }}>{value || "—"}</span>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ width: "100%", marginTop: "16px", padding: "11px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function LeaveContent() {
  const { emp, leaves, leaveStats, loading, reload } = useEmployee();
  const [allEmployees, setAllEmployees] = useState([]);
  const [showApply,    setShowApply]    = useState(false);
  const [viewLeave,    setViewLeave]    = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toast,        setToast]        = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const openApply = async () => {
    if (!allEmployees.length) {
      try { const r = await api.get("/employees/leave-backups"); setAllEmployees(r.data || []); } catch (e) { void e; }
    }
    setShowApply(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this leave request?")) return;
    try {
      await api.delete(`/leave/${id}`);
      await reload();
      showToast("Leave request cancelled");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to cancel", "error");
    }
  };

  const filtered = useMemo(() =>
    statusFilter === "ALL" ? leaves : leaves.filter(l => l.status === statusFilter),
    [leaves, statusFilter]
  );

  const kpiCards = [
    { icon: RiFileTextLine,      label: "Total",    value: leaveStats.total,    color: "#1e40af", bg: "#eff6ff", border: "#93c5fd" },
    { icon: RiTimeLine,          label: "Pending",  value: leaveStats.pending,  color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
    { icon: RiCheckLine,         label: "Approved", value: leaveStats.approved, color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
    { icon: RiCloseLine,         label: "Rejected", value: leaveStats.rejected, color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
  ];

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      {/* Header */}
      <div className="fade-in" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 40%,#1e40af 70%,#2563eb 100%)", borderRadius: "20px", padding: "24px 28px", marginBottom: "20px", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,64,175,0.3)" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RiCalendarCheckLine size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0 }}>My Leave</h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", marginTop: "2px" }}>Manage your leave requests</p>
            </div>
          </div>
          <button onClick={openApply} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 700, fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 16px rgba(16,185,129,0.4)", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <RiAddLine size={16} /> Apply for Leave
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {kpiCards.map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} style={{ background: bg, borderRadius: "16px", padding: "20px", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={19} color={color} />
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1 }}>{loading ? "…" : value}</div>
            <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px", fontWeight: 600 }}>{label} Requests</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "16px 22px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Leave Requests</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{filtered.length} records</p>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["ALL","PENDING","APPROVED","REJECTED"].map(s => {
              const active = statusFilter === s;
              return (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 12px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 600, cursor: "pointer", border: active ? "none" : "1px solid #e2e8f0", background: active ? "linear-gradient(135deg,#1e40af,#2563eb)" : "#f8fafc", color: active ? "#fff" : "#64748b", transition: "all 0.15s" }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg,#f8fafc,#f1f5f9)" }}>
                {["#","Leave Type","Duration","Days","Priority","Status","Applied","Actions"].map((h, i) => (
                  <th key={i} style={{ padding: "11px 16px", textAlign: "left", fontSize: "10.5px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1.5px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "48px", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                    {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 40, width: "90%", borderRadius: 8 }} />)}
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "56px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>📋</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>No leave requests found</div>
                  <button onClick={openApply} style={{ marginTop: "12px", padding: "8px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e40af,#2563eb)", color: "#fff", fontWeight: 700, fontSize: "12.5px", cursor: "pointer" }}>
                    Apply for Leave
                  </button>
                </td></tr>
              ) : filtered.map((l, idx) => {
                const cfg = STATUS_CFG[l.status] || STATUS_CFG.PENDING;
                const canDelete = l.status === "PENDING";
                return (
                  <tr key={l.id || idx} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fbff"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 16px", color: "#94a3b8", fontSize: "12px", fontWeight: 600 }}>#{l.id}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a" }}>{fmt(l.leaveType)}</div>
                      <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: "1px" }}>{l.reason?.slice(0, 40)}{l.reason?.length > 40 ? "…" : ""}</div>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: "12px", color: "#475569", whiteSpace: "nowrap" }}>
                      {l.startDate} → {l.endDate}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#1e40af", background: "#eff6ff", padding: "3px 10px", borderRadius: "20px", border: "1px solid #93c5fd" }}>
                        {l.totalDays || 1}d
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: l.priority === "HIGH" || l.priority === "CRITICAL" ? "#dc2626" : l.priority === "MEDIUM" ? "#d97706" : "#059669" }}>
                        {l.priority}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color }} />
                        {l.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: "12px", color: "#64748b" }}>{l.appliedDate || "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => setViewLeave(l)} title="View" style={{ width: 30, height: 30, borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                          onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}>
                          <RiEyeLine size={14} color="#1e40af" />
                        </button>
                        {canDelete && (
                          <button onClick={() => handleDelete(l.id)} title="Cancel" style={{ width: 30, height: 30, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}>
                            <RiDeleteBinLine size={14} color="#dc2626" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showApply && <ApplyModal emp={emp} allEmployees={allEmployees} onClose={() => setShowApply(false)} onSuccess={() => { reload(); showToast("Leave request submitted successfully ✓"); }} />}
      {viewLeave  && <ViewModal leave={viewLeave} onClose={() => setViewLeave(null)} />}
    </>
  );
}

export default function EmployeeLeave() {
  return (
    <EmployeeProvider>
      <MainLayout>
        <LeaveContent />
      </MainLayout>
    </EmployeeProvider>
  );
}
