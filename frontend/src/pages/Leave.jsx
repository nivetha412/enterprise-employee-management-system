import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s, Toast, PageHeader, StatCard, EmptyState, SectionHeader, Avatar } from "../styles/ui.jsx";
import {
  RiCalendarCheckLine, RiAddLine, RiCheckLine, RiCloseLine,
  RiDeleteBinLine, RiTimeLine, RiUserLine, RiFilterLine
} from "react-icons/ri";

const STATUS_CFG = {
  PENDING:  { color: "#d97706", bg: "#fef3c7", dot: "#d97706" },
  APPROVED: { color: "#059669", bg: "#d1fae5", dot: "#059669" },
  REJECTED: { color: "#dc2626", bg: "#fee2e2", dot: "#dc2626" },
};

const TYPE_CFG = {
  ANNUAL:   { color: "#1e40af", bg: "#dbeafe" },
  SICK:     { color: "#dc2626", bg: "#fee2e2" },
  CASUAL:   { color: "#d97706", bg: "#fef3c7" },
  MATERNITY:{ color: "#7c3aed", bg: "#ede9fe" },
  UNPAID:   { color: "#64748b", bg: "#f1f5f9" },
};

const LEAVE_TYPES = ["ANNUAL", "SICK", "CASUAL", "MATERNITY", "UNPAID"];

function Leave() {
  const [leaves, setLeaves]       = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm]           = useState({ employeeId: "", leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" });
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType]     = useState("");
  const [toast, setToast]         = useState({ message: "", type: "success" });
  const role = localStorage.getItem("role");

  useEffect(() => { fetchLeaves(); fetchEmployees(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load leave requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (e) { console.error(e); }
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    if (!form.employeeId || !form.startDate || !form.endDate) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/leaves", {
        employeeId: Number(form.employeeId),
        leaveType:  form.leaveType,
        startDate:  form.startDate,
        endDate:    form.endDate,
        reason:     form.reason,
      });
      setForm({ employeeId: "", leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" });
      fetchLeaves();
      showToast("Leave request submitted successfully");
    } catch (e) {
      console.error(e);
      showToast("Failed to submit leave request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
      fetchLeaves();
      showToast(`Leave ${status.toLowerCase()} successfully`);
    } catch (e) {
      console.error(e);
      showToast("Failed to update status", "error");
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave request?")) return;
    try {
      await api.delete(`/leaves/${id}`);
      fetchLeaves();
      showToast("Leave request deleted");
    } catch (e) {
      console.error(e);
      showToast("Failed to delete", "error");
    }
  };

  const canApprove = role === "ADMIN" || role === "HR";

  // Derived stats
  const pendingCount  = leaves.filter(l => l.status === "PENDING").length;
  const approvedCount = leaves.filter(l => l.status === "APPROVED").length;
  const rejectedCount = leaves.filter(l => l.status === "REJECTED").length;

  const filtered = leaves.filter(lv => {
    const matchStatus = !filterStatus || lv.status === filterStatus;
    const matchType   = !filterType   || lv.leaveType === filterType;
    return matchStatus && matchType;
  });

  const getEmp = (id) => employees.find(e => e.id === id || e.id === Number(id));

  const calcDays = (start, end) => {
    if (!start || !end) return "—";
    return Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
  };

  const onFocus = e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"; };
  const onBlur  = e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      {/* Page Header */}
      <PageHeader
        icon={<RiCalendarCheckLine size={22} color="#fff" />}
        title="Leave Management"
        subtitle="Submit, review, and manage employee leave requests"
      />

      {/* Stat Row */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <StatCard label="Total Requests" value={leaves.length}   color="#1e40af" bg="#dbeafe" icon={<RiCalendarCheckLine color="#1e40af" size={18} />} />
        <StatCard label="Pending"        value={pendingCount}    color="#d97706" bg="#fef3c7" icon={<RiTimeLine color="#d97706" size={18} />} />
        <StatCard label="Approved"       value={approvedCount}   color="#059669" bg="#d1fae5" icon={<RiCheckLine color="#059669" size={18} />} />
        <StatCard label="Rejected"       value={rejectedCount}   color="#dc2626" bg="#fee2e2" icon={<RiCloseLine color="#dc2626" size={18} />} />
      </div>

      {/* Submit Form */}
      <div style={s.card}>
        <SectionHeader title="New Leave Request" count="Submit" countColor="#1e40af" countBg="#dbeafe" />
        <form onSubmit={submitLeave}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginBottom: "16px" }}>

            <div>
              <label style={s.label}>Employee *</label>
              <div style={{ position: "relative" }}>
                <RiUserLine size={14} color="var(--text-muted)"
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <select
                  style={{ ...s.select, width: "100%", paddingLeft: "30px" }}
                  value={form.employeeId}
                  onChange={e => setForm(f => ({ ...f, employeeId: e.target.value }))}
                  onFocus={onFocus} onBlur={onBlur}
                  required
                >
                  <option value="">— Select Employee —</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={s.label}>Leave Type</label>
              <select
                style={{ ...s.select, width: "100%" }}
                value={form.leaveType}
                onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))}
                onFocus={onFocus} onBlur={onBlur}
              >
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={s.label}>Start Date *</label>
              <input type="date" style={s.input}
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                onFocus={onFocus} onBlur={onBlur}
                required />
            </div>

            <div>
              <label style={s.label}>End Date *</label>
              <input type="date" style={s.input}
                value={form.endDate}
                min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                onFocus={onFocus} onBlur={onBlur}
                required />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={s.label}>Reason</label>
              <input type="text" style={s.input}
                placeholder="Brief reason for leave (optional)…"
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Duration preview */}
          {form.startDate && form.endDate && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "8px 14px", borderRadius: "10px",
              background: "#eff6ff", border: "1px solid #bfdbfe",
              fontSize: "12.5px", fontWeight: 600, color: "#1e40af",
              marginBottom: "14px"
            }}>
              <RiCalendarCheckLine size={14} />
              {calcDays(form.startDate, form.endDate)} day{calcDays(form.startDate, form.endDate) !== 1 ? "s" : ""} requested
            </div>
          )}

          <div style={{ paddingTop: "4px" }}>
            <button type="submit" style={s.btnPrimary} disabled={submitting}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              <RiAddLine size={15} />
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Leave Table */}
      <div style={s.card}>
        <SectionHeader title="Leave Requests" count={filtered.length} countColor="#1e40af" countBg="#dbeafe">
          <select style={{ ...s.select, minWidth: "130px", fontSize: "13px" }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select style={{ ...s.select, minWidth: "130px", fontSize: "13px" }}
            value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </SectionHeader>

        <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Employee", "Type", "Duration", "Days", "Reason", "Status", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} style={s.td}>
                        <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: j === 1 ? "130px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}>
                  <EmptyState
                    icon="📋"
                    title={filterStatus || filterType ? "No requests match your filters" : "No leave requests yet"}
                    subtitle={filterStatus || filterType ? "Try adjusting your filters" : "Submit a leave request using the form above"}
                  />
                </td></tr>
              ) : filtered.map(lv => {
                const sc  = STATUS_CFG[lv.status] || STATUS_CFG.PENDING;
                const tc  = TYPE_CFG[lv.leaveType] || { color: "#64748b", bg: "#f1f5f9" };
                const emp = getEmp(lv.employeeId);
                const days = calcDays(lv.startDate, lv.endDate);
                return (
                  <tr key={lv.id}
                    style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                    <td style={s.td}>
                      <span style={{
                        fontWeight: 700, fontSize: "11.5px", color: "var(--text-muted)",
                        background: "#f1f5f9", padding: "2px 7px", borderRadius: "5px"
                      }}>#{lv.id}</span>
                    </td>

                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {emp ? (
                          <>
                            <Avatar name={`${emp.firstName} ${emp.lastName}`} size={30} />
                            <div>
                              <div style={{ fontSize: "12.5px", fontWeight: 600 }}>{emp.firstName} {emp.lastName}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.designation || `ID: ${lv.employeeId}`}</div>
                            </div>
                          </>
                        ) : (
                          <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>Employee #{lv.employeeId}</span>
                        )}
                      </div>
                    </td>

                    <td style={s.td}>
                      <span style={s.badge(tc.color, tc.bg)}>{lv.leaveType}</span>
                    </td>

                    <td style={s.td}>
                      <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 500 }}>
                        {lv.startDate}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        → {lv.endDate}
                      </div>
                    </td>

                    <td style={s.td}>
                      <span style={{
                        fontWeight: 700, fontSize: "13px",
                        color: "#1e40af", background: "#dbeafe",
                        padding: "2px 8px", borderRadius: "6px"
                      }}>
                        {days}d
                      </span>
                    </td>

                    <td style={{ ...s.td, maxWidth: "160px" }}>
                      <span style={{
                        fontSize: "12px", color: "var(--text-secondary)",
                        display: "block", overflow: "hidden",
                        textOverflow: "ellipsis", whiteSpace: "nowrap"
                      }}>
                        {lv.reason || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No reason</span>}
                      </span>
                    </td>

                    <td style={s.td}>
                      <span style={s.badge(sc.color, sc.bg)}>
                        <span style={{
                          width: "5px", height: "5px", borderRadius: "50%",
                          background: sc.dot, display: "inline-block", marginRight: "4px"
                        }} />
                        {lv.status}
                      </span>
                    </td>

                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "nowrap" }}>
                        {canApprove && lv.status === "PENDING" && (
                          <>
                            <button
                              style={s.btnSuccess}
                              onClick={() => updateStatus(lv.id, "APPROVED")}
                              onMouseEnter={e => { e.currentTarget.style.background = "#d1fae5"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "#ecfdf5"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                              <RiCheckLine size={13} /> Approve
                            </button>
                            <button
                              style={s.btnDanger}
                              onClick={() => updateStatus(lv.id, "REJECTED")}
                              onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "translateY(0)"; }}
                            >
                              <RiCloseLine size={13} /> Reject
                            </button>
                          </>
                        )}
                        <button
                          style={s.btnDanger}
                          onClick={() => deleteLeave(lv.id)}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "translateY(0)"; }}
                        >
                          <RiDeleteBinLine size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)", textAlign: "right" }}>
            Showing {filtered.length} of {leaves.length} requests
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Leave;
