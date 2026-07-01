import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s, Toast, PageHeader, StatCard, EmptyState, SectionHeader, Field, Avatar } from "../styles/ui.jsx";
import {
  RiTeamLine, RiUserAddLine, RiSearchLine, RiFilterLine,
  RiEditLine, RiDeleteBinLine, RiUserHeartLine, RiUserUnfollowLine,
  RiCloseLine, RiCheckLine, RiDownloadLine
} from "react-icons/ri";

const emptyForm = {
  employeeCode: "", firstName: "", lastName: "", email: "",
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

function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterType, setFilterType] = useState("");
  const [toast, setToast]           = useState({ message: "", type: "success" });
  const [errors, setErrors]         = useState({});
  const [showForm, setShowForm]     = useState(false);

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
    if (!form.employeeCode.trim())   e.employeeCode   = "Required";
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

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setErrors({}); setShowForm(false); };

  const createEmployee = async () => {
    if (!validate()) return;
    try {
      await api.post("/employees", { ...form, salary: form.salary ? Number(form.salary) : null });
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
      employeeCode: emp.employeeCode || "", firstName: emp.firstName || "",
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
      await api.put(`/employees/${editingId}`, { ...form, salary: form.salary ? Number(form.salary) : null });
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

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const filtered = employees.filter(emp => {
    const matchSearch = !search ||
      `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.employeeCode}`
        .toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || emp.department === filterDept;
    const matchType = !filterType || emp.employmentType === filterType;
    return matchSearch && matchDept && matchType;
  });

  const activeCount   = employees.filter(e => e.active).length;
  const inactiveCount = employees.filter(e => !e.active).length;
  const deptCount     = departments.length;

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
          onClick={() => { resetForm(); setShowForm(true); }}
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
            <Field label="Employee Code *" error={errors.employeeCode}>
              <input name="employeeCode" style={inputStyle("employeeCode")} placeholder="EMP001"
                value={form.employeeCode} onChange={e => handleChange("employeeCode", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
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
              <input name="designation" style={inputStyle("designation")} placeholder="Software Engineer"
                value={form.designation} onChange={e => handleChange("designation", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Salary" error={errors.salary}>
              <input name="salary" type="number" style={inputStyle("salary")} placeholder="50000"
                value={form.salary} onChange={e => handleChange("salary", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
            </Field>
            <Field label="Department *" error={errors.department}>
              <input name="department" style={inputStyle("department")} placeholder="Engineering"
                value={form.department} onChange={e => handleChange("department", e.target.value)}
                onFocus={onFocus} onBlur={onBlur} />
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

      {/* Table Card */}
      <div style={s.card}>
        <SectionHeader title="All Employees" count={filtered.length}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <RiSearchLine size={14} color="var(--text-muted)"
              style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              style={{ ...s.input, width: "220px", paddingLeft: "32px", fontSize: "13px" }}
              placeholder="Search name, email, code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={onFocus}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          {/* Dept filter */}
          <select style={{ ...s.select, minWidth: "140px", fontSize: "13px" }}
            value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {/* Type filter */}
          <select style={{ ...s.select, minWidth: "130px", fontSize: "13px" }}
            value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
          </select>
        </SectionHeader>

        <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Code", "Employee", "Contact", "Department", "Designation", "Type", "Salary", "Status", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} style={s.td}>
                        <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: j === 1 ? "140px" : "80px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9}>
                  <EmptyState
                    icon="👥"
                    title={search || filterDept || filterType ? "No employees match your filters" : "No employees yet"}
                    subtitle={search || filterDept || filterType ? "Try adjusting your search or filters" : "Add your first employee to get started"}
                  />
                </td></tr>
              ) : filtered.map(emp => {
                const av = getAvatarStyle(emp.firstName);
                const typeStyle = EMP_TYPE_COLORS[emp.employmentType] || { color: "#64748b", bg: "#f1f5f9" };
                return (
                  <tr key={emp.id}
                    style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

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
