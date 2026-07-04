import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s, Toast, PageHeader, StatCard, EmptyState, SectionHeader, Field, Avatar } from "../styles/ui.jsx";
import {
  RiTeamLine, RiUserAddLine, RiSearchLine,
  RiEditLine, RiDeleteBinLine, RiUserHeartLine, RiUserUnfollowLine,
  RiCloseLine, RiCheckLine, RiDownloadLine, RiEyeLine,
  RiUserLine, RiMailLine, RiPhoneLine, RiCalendarLine, RiIdCardLine,
  RiBuilding2Line, RiBriefcaseLine, RiTimeLine, RiFileTextLine,
  RiAwardLine, RiArrowUpLine, RiExchangeLine, RiBookOpenLine,
  RiMapPinLine, RiFilePdfLine, RiFileUserLine, RiBankCardLine,
  RiShieldUserLine, RiMailSendLine, RiMedalLine, RiUploadLine
} from "react-icons/ri";

const emptyForm = {
  firstName: "", lastName: "", email: "",
  phone: "", gender: "", designation: "", salary: "",
  department: "", employmentType: ""
};

const EMP_TYPE_COLORS = {
  FULL_TIME: { color: "#1e40af", bg: "#dbeafe" },
  PART_TIME: { color: "#7c3aed", bg: "#ede9fe" },
  CONTRACT:  { color: "#d97706", bg: "#fef3c7" },
  INTERN:    { color: "#0891b2", bg: "#cffafe" },
};

const AVATAR_PALETTE = [
  { color: "#1e40af", bg: "#dbeafe" }, { color: "#7c3aed", bg: "#ede9fe" },
  { color: "#059669", bg: "#d1fae5" }, { color: "#d97706", bg: "#fef3c7" },
  { color: "#0891b2", bg: "#cffafe" }, { color: "#dc2626", bg: "#fee2e2" },
];

function getAvatarStyle(name = "") {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

// ─── Employee Profile Drawer ─────────────────────────────────────────────────
const TIMELINE_EVENTS = [
  { icon: <RiMapPinLine size={14} />,    label: "Joined Company",      color: "#1e40af", bg: "#dbeafe",  desc: "Started as a new team member" },
  { icon: <RiArrowUpLine size={14} />,   label: "Promoted",            color: "#7c3aed", bg: "#ede9fe",  desc: "Elevated to a higher role" },
  { icon: <RiExchangeLine size={14} />,  label: "Transferred",         color: "#d97706", bg: "#fef3c7",  desc: "Moved to a new department" },
  { icon: <RiBookOpenLine size={14} />,  label: "Training Completed",  color: "#0891b2", bg: "#cffafe",  desc: "Completed professional training" },
  { icon: <RiAwardLine size={14} />,     label: "Current Position",    color: "#059669", bg: "#d1fae5",  desc: "Present role & responsibilities" },
];

const DOCUMENTS = [
  { icon: <RiFileUserLine size={16} />,  label: "Resume",        color: "#1e40af", bg: "#dbeafe" },
  { icon: <RiBankCardLine size={16} />,  label: "ID Card",       color: "#7c3aed", bg: "#ede9fe" },
  { icon: <RiFilePdfLine size={16} />,   label: "PAN",           color: "#d97706", bg: "#fef3c7" },
  { icon: <RiShieldUserLine size={16} />,label: "Aadhar",        color: "#dc2626", bg: "#fee2e2" },
  { icon: <RiMailSendLine size={16} />,  label: "Offer Letter",  color: "#059669", bg: "#d1fae5" },
  { icon: <RiMedalLine size={16} />,     label: "Certificates", color: "#0891b2", bg: "#cffafe" },
];

function EmployeeDrawer({ emp, onClose }) {
  const [activeTab, setActiveTab] = useState("profile");
  if (!emp) return null;
  const av = getAvatarStyle(emp.firstName);
  const typeStyle = EMP_TYPE_COLORS[emp.employmentType] || { color: "#64748b", bg: "#f1f5f9" };
  const initials = `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase();

  const InfoRow = ({ icon, label, value }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
      borderRadius: 12, background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 8,
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(3px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(30,64,175,0.15)" }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "—"}</div>
      </div>
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#e2e8f0,transparent)" }} />
      {children}
      <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg,#e2e8f0,transparent)" }} />
    </div>
  );

  const tabs = [
    { id: "profile",   label: "Profile",   icon: <RiUserLine size={13} /> },
    { id: "timeline",  label: "Timeline",  icon: <RiTimeLine size={13} /> },
    { id: "documents", label: "Documents", icon: <RiFileTextLine size={13} /> },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: "420px",
        background: "#f8fafc", zIndex: 1001,
        boxShadow: "-12px 0 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.28s cubic-bezier(0.16,1,0.3,1)"
      }}>

        {/* ── Gradient Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 40%, #2563eb 70%, #3b82f6 100%)",
          padding: "24px 20px 0", position: "relative", overflow: "hidden", flexShrink: 0
        }}>
          {/* decorative circles */}
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", top: 20, right: 40, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

          {/* close */}
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 10, width: 32, height: 32, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            transition: "background 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <RiCloseLine size={16} />
          </button>

          {/* avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%",
              background: `linear-gradient(135deg, ${av.bg}, ${av.color}33)`,
              color: av.color, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800, flexShrink: 0,
              border: "3px solid rgba(255,255,255,0.4)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
            }}>{initials}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                {emp.firstName} {emp.lastName}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{emp.designation || "—"}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: typeStyle.color, background: "rgba(255,255,255,0.92)", padding: "2px 9px", borderRadius: 20 }}>
                  {emp.employmentType?.replace("_", " ") || "—"}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: emp.active ? "#059669" : "#dc2626", background: "rgba(255,255,255,0.92)", padding: "2px 9px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: emp.active ? "#059669" : "#dc2626", display: "inline-block" }} />
                  {emp.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: "9px 4px", border: "none", cursor: "pointer",
                background: activeTab === t.id ? "rgba(255,255,255,0.18)" : "transparent",
                color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 700, borderRadius: "10px 10px 0 0",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                transition: "all 0.15s", fontFamily: "var(--font)",
                borderBottom: activeTab === t.id ? "2px solid #fff" : "2px solid transparent"
              }}
                onMouseEnter={e => { if (activeTab !== t.id) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { if (activeTab !== t.id) e.currentTarget.style.background = "transparent"; }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div>
              <SectionLabel>Personal Information</SectionLabel>
              <InfoRow icon={<RiIdCardLine size={15} color="#1e40af" />}  label="Employee ID"   value={emp.employeeCode} />
              <InfoRow icon={<RiUserLine size={15} color="#7c3aed" />}    label="Gender"        value={emp.gender} />
              <InfoRow icon={<RiCalendarLine size={15} color="#d97706" />} label="Date of Birth" value={emp.dateOfBirth || emp.dob} />
              <InfoRow icon={<RiPhoneLine size={15} color="#059669" />}   label="Phone"         value={emp.phone} />
              <InfoRow icon={<RiMailLine size={15} color="#0891b2" />}    label="Email"         value={emp.email} />
              <SectionLabel>Work Information</SectionLabel>
              <InfoRow icon={<RiBuilding2Line size={15} color="#1e40af" />} label="Department"  value={emp.department} />
              <InfoRow icon={<RiBriefcaseLine size={15} color="#7c3aed" />} label="Designation" value={emp.designation} />
              {emp.salary && <InfoRow icon={<span style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>₹</span>} label="Salary" value={`$${Number(emp.salary).toLocaleString()}`} />}
            </div>
          )}

          {/* ── TIMELINE TAB ── */}
          {activeTab === "timeline" && (
            <div style={{ paddingTop: 4 }}>
              <div style={{ position: "relative", paddingLeft: 36 }}>
                {/* vertical line */}
                <div style={{ position: "absolute", left: 15, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg,#3b82f6,#8b5cf6,#06b6d4,#10b981)", borderRadius: 2 }} />

                {TIMELINE_EVENTS.map((ev, i) => (
                  <div key={i} style={{
                    position: "relative", marginBottom: i < TIMELINE_EVENTS.length - 1 ? 20 : 0,
                    background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: 14, padding: "14px 16px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    transition: "transform 0.18s, box-shadow 0.18s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
                  >
                    {/* dot */}
                    <div style={{
                      position: "absolute", left: -28, top: "50%", transform: "translateY(-50%)",
                      width: 30, height: 30, borderRadius: "50%",
                      background: `linear-gradient(135deg,${ev.bg},${ev.color}22)`,
                      border: `2px solid ${ev.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: ev.color, boxShadow: `0 0 0 3px ${ev.bg}`
                    }}>
                      {ev.icon}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{ev.label}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: ev.color,
                        background: ev.bg, padding: "2px 8px", borderRadius: 20
                      }}>
                        {i === 0 ? "Start" : i === TIMELINE_EVENTS.length - 1 ? "Now" : `Step ${i + 1}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>{ev.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DOCUMENTS TAB ── */}
          {activeTab === "documents" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 4 }}>
                {DOCUMENTS.map((doc, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: 14, padding: "16px 14px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
                    cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${doc.color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.07)"; }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `linear-gradient(135deg,${doc.bg},${doc.color}22)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: doc.color, marginBottom: 10,
                      boxShadow: `0 4px 12px ${doc.color}33`
                    }}>{doc.icon}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{doc.label}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{
                        flex: 1, padding: "5px 0", fontSize: 10.5, fontWeight: 600,
                        background: doc.bg, color: doc.color,
                        border: `1px solid ${doc.color}33`, borderRadius: 8, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                        fontFamily: "var(--font)", transition: "opacity 0.15s"
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        <RiDownloadLine size={11} /> View
                      </button>
                      <button style={{
                        flex: 1, padding: "5px 0", fontSize: 10.5, fontWeight: 600,
                        background: "#f8fafc", color: "#64748b",
                        border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                        fontFamily: "var(--font)", transition: "opacity 0.15s"
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        <RiUploadLine size={11} /> Upload
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Bulk Actions Bar ─────────────────────────────────────────────────────────
function BulkActionsBar({ count, onDelete, onExport, onAssignDept, onAssignManager, onActivate, onDeactivate, onClear }) {
  if (count === 0) return null;
  const btn = (label, icon, onClick, color = "#1e40af", bg = "#dbeafe") => (
    <button onClick={onClick} style={{ padding: "6px 13px", background: bg, color, border: `1px solid ${color}33`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font)" }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      {icon}{label}
    </button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "10px 16px", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", marginRight: 4 }}>{count} selected</span>
      {btn("Delete", <RiDeleteBinLine size={13} />, onDelete, "#dc2626", "#fee2e2")}
      {btn("Export", <RiDownloadLine size={13} />, onExport, "#059669", "#d1fae5")}
      {btn("Assign Dept", <RiBuilding2Line size={13} />, onAssignDept, "#7c3aed", "#ede9fe")}
      {btn("Assign Manager", <RiUserLine size={13} />, onAssignManager, "#d97706", "#fef3c7")}
      {btn("Activate", <RiUserHeartLine size={13} />, onActivate, "#059669", "#d1fae5")}
      {btn("Deactivate", <RiUserUnfollowLine size={13} />, onDeactivate, "#dc2626", "#fee2e2")}
      <button onClick={onClear} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}><RiCloseLine size={16} /></button>
    </div>
  );
}

function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept]             = useState("");
  const [filterType, setFilterType]             = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterStatus, setFilterStatus]         = useState("");
  const [filterGender, setFilterGender]         = useState("");
  const [toast, setToast]           = useState({ message: "", type: "success" });
  const [errors, setErrors]         = useState({});
  const [showForm, setShowForm]     = useState(false);
  const [viewEmp, setViewEmp]       = useState(null);
  const [nextCode, setNextCode]     = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDept, setBulkDept]     = useState("");
  const [bulkManager, setBulkManager] = useState("");
  const [showBulkDeptModal, setShowBulkDeptModal] = useState(false);
  const [showBulkManagerModal, setShowBulkManagerModal] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())      e.firstName      = "Required";
    if (!form.lastName.trim())       e.lastName       = "Required";
    if (!form.email.trim())          e.email          = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.designation.trim())    e.designation    = "Required";
    if (!form.department.trim())     e.department     = "Required";
    if (!form.employmentType.trim()) e.employmentType = "Required";
    if (form.salary && isNaN(Number(form.salary))) e.salary = "Must be a number";
    if (form.salary && Number(form.salary) <= 0)   e.salary = "Must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setErrors({}); setShowForm(false); setNextCode(""); };

  const fetchNextCode = async () => {
    try {
      const res = await api.get("/employees/next-code");
      setNextCode(res.data);
    } catch { setNextCode("Auto Generated"); }
  };

  const createEmployee = async () => {
    if (!validate()) return;
    try {
      await api.post("/employees", {
        firstName:      form.firstName,
        lastName:       form.lastName,
        email:          form.email,
        phone:          form.phone          || "",
        gender:         form.gender         || "",
        designation:    form.designation,
        salary:         form.salary ? Number(form.salary) : null,
        department:     form.department,
        employmentType: form.employmentType,
      });
      resetForm();
      fetchEmployees();
      showToast("Employee added successfully");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.errors?.[0] || "Failed to add employee", "error");
    }
  };

  const editEmployee = (emp) => {
    setEditingId(emp.id);
    setForm({
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",         email: emp.email || "",
      phone: emp.phone || "",               gender: emp.gender || "",
      designation: emp.designation || "",   salary: emp.salary ?? "",
      department: emp.department || "",     employmentType: emp.employmentType || ""
    });
    setErrors({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateEmployee = async () => {
    if (!validate()) return;
    try {
      await api.put(`/employees/${editingId}`, {
        firstName:      form.firstName,
        lastName:       form.lastName,
        email:          form.email,
        phone:          form.phone          || "",
        gender:         form.gender         || "",
        designation:    form.designation,
        salary:         form.salary ? Number(form.salary) : null,
        department:     form.department,
        employmentType: form.employmentType,
      });
      resetForm();
      fetchEmployees();
      showToast("Employee updated successfully");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.errors?.[0] || "Failed to update employee", "error");
    }
  };

  const deleteEmployee = async (id, name) => {
    if (!window.confirm(`Delete employee "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
      showToast("Employee deleted successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete employee", "error");
    }
  };

  const DEPARTMENTS   = ["IT", "HR", "Finance", "Sales", "Marketing"];
  const DESIGNATIONS  = ["Developer", "Manager", "HR", "Tester"];

  const filtered = employees.filter(emp => {
    const matchSearch = !search ||
      `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.employeeCode}`
        .toLowerCase().includes(search.toLowerCase());
    const matchDept        = !filterDept        || emp.department   === filterDept;
    const matchType        = !filterType        || emp.employmentType === filterType;
    const matchDesignation = !filterDesignation || emp.designation  === filterDesignation;
    const matchStatus      = !filterStatus      || (filterStatus === "Active" ? emp.active : !emp.active);
    const matchGender      = !filterGender      || emp.gender       === filterGender;
    return matchSearch && matchDept && matchType && matchDesignation && matchStatus && matchGender;
  });

  const activeCount   = employees.filter(e => e.active).length;
  const inactiveCount = employees.filter(e => !e.active).length;
  const deptCount     = [...new Set(employees.map(e => e.department).filter(Boolean))].length;

  // ── Bulk action handlers (defined after filtered) ───────────────────────
  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(e => e.id));

  const bulkDelete = async () => {
    const count = selectedIds.length;
    if (!window.confirm(`Delete ${count} employee(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/employees/${id}`)));
      setSelectedIds([]);
      fetchEmployees();
      showToast(`${count} employee(s) deleted`);
    } catch { showToast("Bulk delete failed", "error"); }
  };

  const bulkExport = () => {
    const rows = employees.filter(e => selectedIds.includes(e.id));
    const csv = [
      ["Code","First Name","Last Name","Email","Phone","Gender","Department","Designation","Type","Salary","Status"].join(","),
      ...rows.map(e => [e.employeeCode,e.firstName,e.lastName,e.email,e.phone,e.gender,e.department,e.designation,e.employmentType,e.salary,e.active?"Active":"Inactive"].join(","))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "employees_export.csv";
    a.click();
    showToast(`${rows.length} employee(s) exported`);
  };

  const toDto = (emp) => ({
    firstName:      emp.firstName      || "",
    lastName:       emp.lastName       || "",
    email:          emp.email          || "",
    phone:          emp.phone          || "",
    gender:         emp.gender         || "",
    designation:    emp.designation    || "",
    salary:         emp.salary         ?? null,
    department:     emp.department     || "",
    employmentType: emp.employmentType || "",
  });

  const bulkSetActive = async (active) => {
    const count = selectedIds.length;
    try {
      await Promise.all(selectedIds.map(id => {
        const emp = employees.find(e => e.id === id);
        return api.put(`/employees/${id}`, toDto(emp));
      }));
      setSelectedIds([]);
      fetchEmployees();
      showToast(`${count} employee(s) ${active ? "activated" : "deactivated"}`);
    } catch { showToast("Operation failed", "error"); }
  };

  const bulkAssignDept = async () => {
    if (!bulkDept.trim()) return;
    const count = selectedIds.length;
    try {
      await Promise.all(selectedIds.map(id => {
        const emp = employees.find(e => e.id === id);
        return api.put(`/employees/${id}`, { ...toDto(emp), department: bulkDept });
      }));
      setSelectedIds([]); setShowBulkDeptModal(false); setBulkDept("");
      fetchEmployees();
      showToast(`Department assigned to ${count} employee(s)`);
    } catch { showToast("Operation failed", "error"); }
  };

  const bulkAssignManager = async () => {
    if (!bulkManager.trim()) return;
    const count = selectedIds.length;
    try {
      await Promise.all(selectedIds.map(id => {
        const emp = employees.find(e => e.id === id);
        return api.put(`/employees/${id}`, toDto(emp));
      }));
      setSelectedIds([]); setShowBulkManagerModal(false); setBulkManager("");
      fetchEmployees();
      showToast(`Manager assigned to ${count} employee(s)`);
    } catch { showToast("Operation failed", "error"); }
  };

  const inputStyle = (field) => ({
    ...s.input,
    borderColor: errors[field] ? "var(--danger)" : "var(--border)",
    boxShadow: errors[field] ? "0 0 0 3px rgba(220,38,38,0.08)" : "none"
  });

  const onFocus = e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"; };
  const onBlur  = e => { e.target.style.borderColor = errors[e.target.name] ? "var(--danger)" : "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      {/* Page Header */}
      <PageHeader
        icon={<RiTeamLine size={22} color="#fff" />}
        title="Employee Directory"
        subtitle={`${employees.length} total employees across ${deptCount} departments`}
      >
        <button
          style={s.btnPrimary}
          onClick={() => { resetForm(); setShowForm(true); fetchNextCode(); }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <RiUserAddLine size={15} /> Add Employee
        </button>
      </PageHeader>

      {/* Stat Row */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <StatCard label="Total Employees" value={employees.length} color="#1e40af" bg="#dbeafe" icon={<RiTeamLine color="#1e40af" size={18} />} />
        <StatCard label="Active"          value={activeCount}      color="#059669" bg="#d1fae5" icon={<RiUserHeartLine color="#059669" size={18} />} />
        <StatCard label="Inactive"        value={inactiveCount}    color="#dc2626" bg="#fee2e2" icon={<RiUserUnfollowLine color="#dc2626" size={18} />} />
        <StatCard label="Departments"     value={deptCount}        color="#7c3aed" bg="#ede9fe" icon="🏢" />
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div style={{ ...s.card, border: editingId ? "1.5px solid #fde68a" : "1.5px solid #bfdbfe" }}>
          <SectionHeader
            title={editingId ? "Edit Employee" : "Add New Employee"}
            countColor={editingId ? "#d97706" : "#1e40af"}
            countBg={editingId ? "#fef3c7" : "#dbeafe"}
            count={editingId ? "Editing" : "New"}
          >
            <button style={s.btnGhost} onClick={resetForm}>
              <RiCloseLine size={14} /> Cancel
            </button>
          </SectionHeader>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
            <Field label="Employee Code">
              <div style={{ position: "relative" }}>
                <div style={{
                  ...s.input,
                  background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
                  border: "1.5px dashed #7dd3fc",
                  color: "#0369a1",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "0.06em",
                  fontSize: "13.5px",
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingRight: "10px"
                }}>
                  <span>{editingId ? employees.find(e => e.id === editingId)?.employeeCode : (nextCode || "Generating…")}</span>
                  <span style={{
                    fontSize: "9.5px", fontWeight: 700, color: "#0891b2",
                    background: "#cffafe", border: "1px solid #a5f3fc",
                    padding: "2px 7px", borderRadius: "20px",
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    fontFamily: "var(--font)"
                  }}>Auto Generated</span>
                </div>
              </div>
            </Field>
            <Field label="First Name *" error={errors.firstName}>
              <input name="firstName" style={inputStyle("firstName")} placeholder="John"
                value={form.firstName} onChange={e => handleChange("firstName", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Last Name *" error={errors.lastName}>
              <input name="lastName" style={inputStyle("lastName")} placeholder="Doe"
                value={form.lastName} onChange={e => handleChange("lastName", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input name="email" type="email" style={inputStyle("email")} placeholder="john@company.com"
                value={form.email} onChange={e => handleChange("email", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Phone">
              <input name="phone" style={s.input} placeholder="+1 234 567 8900"
                value={form.phone} onChange={e => handleChange("phone", e.target.value)}
                onFocus={onFocus} onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
            </Field>
            <Field label="Gender">
              <select name="gender" style={{ ...s.select, width: "100%" }}
                value={form.gender} onChange={e => handleChange("gender", e.target.value)}
                onFocus={onFocus} onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Designation *" error={errors.designation}>
              <select name="designation"
                style={{ ...s.select, width: "100%", borderColor: errors.designation ? "var(--danger)" : "var(--border)" }}
                value={form.designation} onChange={e => handleChange("designation", e.target.value)}
                onFocus={onFocus} onBlur={e => { e.target.style.borderColor = errors.designation ? "var(--danger)" : "var(--border)"; e.target.style.boxShadow = "none"; }}>
                <option value="">Select</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Salary" error={errors.salary}>
              <input name="salary" type="number" style={inputStyle("salary")} placeholder="50000"
                value={form.salary} onChange={e => handleChange("salary", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Department *" error={errors.department}>
              <select name="department"
                style={{ ...s.select, width: "100%", borderColor: errors.department ? "var(--danger)" : "var(--border)" }}
                value={form.department} onChange={e => handleChange("department", e.target.value)}
                onFocus={onFocus} onBlur={e => { e.target.style.borderColor = errors.department ? "var(--danger)" : "var(--border)"; e.target.style.boxShadow = "none"; }}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Employment Type *" error={errors.employmentType}>
              <select name="employmentType"
                style={{ ...s.select, width: "100%", borderColor: errors.employmentType ? "var(--danger)" : "var(--border)" }}
                value={form.employmentType} onChange={e => handleChange("employmentType", e.target.value)}
                onFocus={onFocus} onBlur={e => { e.target.style.borderColor = errors.employmentType ? "var(--danger)" : "var(--border)"; e.target.style.boxShadow = "none"; }}>
                <option value="">Select</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </select>
            </Field>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            {editingId ? (
              <>
                <button style={s.btnPrimary} onClick={updateEmployee}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <RiCheckLine size={14} /> Update Employee
                </button>
                <button style={s.btnGhost} onClick={resetForm}>
                  <RiCloseLine size={14} /> Cancel
                </button>
              </>
            ) : (
              <button style={s.btnPrimary} onClick={createEmployee}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <RiUserAddLine size={14} /> Add Employee
              </button>
            )}
          </div>
        </div>
      )}

      {/* Employee Profile Drawer */}
      <EmployeeDrawer emp={viewEmp} onClose={() => setViewEmp(null)} />

      {/* Bulk Dept Modal */}
      {showBulkDeptModal && (
        <>
          <div onClick={() => setShowBulkDeptModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 28, zIndex: 1001, width: 340, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Assign Department</div>
            <select style={{ ...s.select, width: "100%" }} value={bulkDept} onChange={e => setBulkDept(e.target.value)}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={s.btnPrimary} onClick={bulkAssignDept}><RiCheckLine size={13} /> Assign</button>
              <button style={s.btnGhost} onClick={() => setShowBulkDeptModal(false)}><RiCloseLine size={13} /> Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Bulk Manager Modal */}
      {showBulkManagerModal && (
        <>
          <div onClick={() => setShowBulkManagerModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 28, zIndex: 1001, width: 340, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Assign Manager</div>
            <input style={s.input} placeholder="Manager name" value={bulkManager} onChange={e => setBulkManager(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button style={s.btnPrimary} onClick={bulkAssignManager}><RiCheckLine size={13} /> Assign</button>
              <button style={s.btnGhost} onClick={() => setShowBulkManagerModal(false)}><RiCloseLine size={13} /> Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Table Card */}
      <div style={s.card}>
        <BulkActionsBar
          count={selectedIds.length}
          onDelete={bulkDelete}
          onExport={bulkExport}
          onAssignDept={() => setShowBulkDeptModal(true)}
          onAssignManager={() => setShowBulkManagerModal(true)}
          onActivate={() => bulkSetActive(true)}
          onDeactivate={() => bulkSetActive(false)}
          onClear={() => setSelectedIds([])}
        />
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>All Employees</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", background: "#eff6ff", padding: "2px 8px", borderRadius: 20 }}>{filtered.length}</span>
          </div>
          {(filterDept || filterDesignation || filterStatus || filterGender || filterType || search) && (
            <button onClick={() => { setSearch(""); setFilterDept(""); setFilterDesignation(""); setFilterStatus(""); setFilterGender(""); setFilterType(""); }}
              style={{ ...s.btnGhost, fontSize: 12, padding: "5px 12px" }}>
              <RiCloseLine size={13} /> Clear Filters
            </button>
          )}
        </div>
        {/* Filter row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 180 }}>
            <RiSearchLine size={14} color="var(--text-muted)"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input style={{ ...s.input, paddingLeft: 32, fontSize: 13 }}
              placeholder="Search name, email, code…"
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={onFocus}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }} />
          </div>
          <select style={{ ...s.select, flex: "1 1 130px", minWidth: 120, fontSize: 13 }}
            value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select style={{ ...s.select, flex: "1 1 130px", minWidth: 120, fontSize: 13 }}
            value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)}>
            <option value="">All Designations</option>
            {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select style={{ ...s.select, flex: "1 1 110px", minWidth: 100, fontSize: 13 }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select style={{ ...s.select, flex: "1 1 110px", minWidth: 100, fontSize: 13 }}
            value={filterGender} onChange={e => setFilterGender(e.target.value)}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select style={{ ...s.select, flex: "1 1 120px", minWidth: 110, fontSize: 13 }}
            value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
          </select>
        </div>

        <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: 36, paddingRight: 0 }}>
                  <input type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: "pointer", width: 15, height: 15 }}
                  />
                </th>
              {["Code", "Employee", "Contact", "Department", "Designation", "Type", "Salary", "Status", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(10)].map((_, j) => (
                      <td key={j} style={s.td}>
                        <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: j === 2 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10}>
                  <EmptyState
                    icon="👥"
                    title={search || filterDept || filterType || filterDesignation || filterStatus || filterGender ? "No employees match your filters" : "No employees yet"}
                    subtitle={search || filterDept || filterType || filterDesignation || filterStatus || filterGender ? "Try adjusting your search or filters" : "Add your first employee to get started"}
                  />
                </td></tr>
              ) : filtered.map(emp => {
                const av = getAvatarStyle(emp.firstName);
                const typeStyle = EMP_TYPE_COLORS[emp.employmentType] || { color: "#64748b", bg: "#f1f5f9" };
                return (
                  <tr key={emp.id}
                    style={{ transition: "background 0.12s", background: selectedIds.includes(emp.id) ? "#eff6ff" : "transparent" }}
                    onMouseEnter={e => { if (!selectedIds.includes(emp.id)) e.currentTarget.style.background = "#f8fafc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = selectedIds.includes(emp.id) ? "#eff6ff" : "transparent"; }}>
                    <td style={{ ...s.td, paddingRight: 0, width: 36 }}>
                      <input type="checkbox"
                        checked={selectedIds.includes(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        style={{ cursor: "pointer", width: 15, height: 15 }}
                      />
                    </td>

                    <td style={s.td}>
                      <span style={{
                        fontFamily: "monospace", fontSize: "11.5px", fontWeight: 600,
                        background: "#f1f5f9", color: "#475569",
                        padding: "3px 8px", borderRadius: "6px", letterSpacing: "0.04em"
                      }}>
                        {emp.employeeCode || "—"}
                      </span>
                    </td>

                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Avatar name={`${emp.firstName} ${emp.lastName}`} size={34} color={av.color} bg={av.bg} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          {emp.gender && (
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{emp.gender}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={s.td}>
                      <div style={{ fontSize: "12.5px", color: "var(--text-primary)" }}>{emp.email}</div>
                      {emp.phone && <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{emp.phone}</div>}
                    </td>

                    <td style={s.td}>
                      <span style={{
                        fontSize: "12.5px", fontWeight: 500,
                        color: "var(--text-primary)"
                      }}>
                        {emp.department || "—"}
                      </span>
                    </td>

                    <td style={s.td}>
                      <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                        {emp.designation || "—"}
                      </span>
                    </td>

                    <td style={s.td}>
                      {emp.employmentType ? (
                        <span style={s.badge(typeStyle.color, typeStyle.bg)}>
                          {emp.employmentType.replace("_", " ")}
                        </span>
                      ) : "—"}
                    </td>

                    <td style={s.td}>
                      <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-primary)" }}>
                        {emp.salary ? `$${emp.salary.toLocaleString()}` : "—"}
                      </span>
                    </td>

                    <td style={s.td}>
                      <span style={s.badge(
                        emp.active ? "#059669" : "#dc2626",
                        emp.active ? "#d1fae5" : "#fee2e2"
                      )}>
                        <span style={{
                          width: "5px", height: "5px", borderRadius: "50%",
                          background: emp.active ? "#059669" : "#dc2626",
                          display: "inline-block", marginRight: "4px"
                        }} />
                        {emp.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={{ ...s.btnGhost, padding: "7px 12px", fontSize: 12 }} onClick={() => setViewEmp(emp)}
                          onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#93c5fd"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                          <RiEyeLine size={13} /> View
                        </button>
                        <button style={s.btnWarning} onClick={() => editEmployee(emp)}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fffbeb"; e.currentTarget.style.transform = "translateY(0)"; }}>
                          <RiEditLine size={13} /> Edit
                        </button>
                        <button style={s.btnDanger} onClick={() => deleteEmployee(emp.id, `${emp.firstName} ${emp.lastName}`)}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "translateY(0)"; }}>
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
            Showing {filtered.length} of {employees.length} employees
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Employees;
