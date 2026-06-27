import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s } from "../styles/ui";

const emptyForm = {
  employeeCode: "", firstName: "", lastName: "", email: "",
  phone: "", gender: "", designation: "", salary: "",
  department: "", employmentType: ""
};

function Toast({ message, type }) {
  if (!message) return null;
  const colors = {
    success: { bg: "var(--success-bg)", color: "var(--success)", border: "#6ee7b7" },
    error:   { bg: "var(--danger-bg)",  color: "var(--danger)",  border: "#fecaca" },
  };
  const c = colors[type] || colors.success;
  return (
    <div style={{
      position: "fixed", top: "80px", right: "24px", zIndex: 999,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: "10px", padding: "12px 20px", fontSize: "13px",
      fontWeight: 600, boxShadow: "var(--shadow-md)",
      display: "flex", alignItems: "center", gap: "8px"
    }}>
      {type === "success" ? "✅" : "❌"} {message}
    </div>
  );
}

function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [toast, setToast]           = useState({ message: "", type: "success" });
  const [errors, setErrors]         = useState({});

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
    if (!form.employeeCode.trim())  e.employeeCode  = "Required";
    if (!form.firstName.trim())     e.firstName     = "Required";
    if (!form.lastName.trim())      e.lastName      = "Required";
    if (!form.email.trim())         e.email         = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.designation.trim())   e.designation   = "Required";
    if (!form.department.trim())    e.department    = "Required";
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

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setErrors({}); };

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
      lastName: emp.lastName || "",        email: emp.email || "",
      phone: emp.phone || "",              gender: emp.gender || "",
      designation: emp.designation || "",  salary: emp.salary ?? "",
      department: emp.department || "",    employmentType: emp.employmentType || ""
    });
    setErrors({});
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
    return matchSearch && matchDept;
  });

  const focusInput = e => e.target.style.borderColor = "var(--primary)";
  const blurInput  = e => e.target.style.borderColor = errors[e.target.name] ? "var(--danger)" : "var(--border)";

  const fieldInput = (field, placeholder, type = "text") => (
    <div>
      <input
        name={field}
        style={{ ...s.input, borderColor: errors[field] ? "var(--danger)" : "var(--border)" }}
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={e => handleChange(field, e.target.value)}
        onFocus={focusInput}
        onBlur={blurInput}
      />
      {errors[field] && <span style={{ color: "var(--danger)", fontSize: "11px" }}>{errors[field]}</span>}
    </div>
  );

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      <h1 style={s.pageTitle}>Employees</h1>
      <p style={s.pageSubtitle}>Manage your organization's employees</p>

      {/* Form Card */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>
          {editingId ? "✏️ Edit Employee" : "➕ Add New Employee"}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
          <div>
            <label style={s.label}>Employee Code *</label>
            {fieldInput("employeeCode", "EMP001")}
          </div>
          <div>
            <label style={s.label}>First Name *</label>
            {fieldInput("firstName", "John")}
          </div>
          <div>
            <label style={s.label}>Last Name *</label>
            {fieldInput("lastName", "Doe")}
          </div>
          <div>
            <label style={s.label}>Email *</label>
            {fieldInput("email", "john@company.com", "email")}
          </div>
          <div>
            <label style={s.label}>Phone</label>
            {fieldInput("phone", "+1 234 567 8900")}
          </div>
          <div>
            <label style={s.label}>Gender</label>
            <select
              name="gender"
              style={{ ...s.select, width: "100%" }}
              value={form.gender}
              onChange={e => handleChange("gender", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Designation *</label>
            {fieldInput("designation", "Software Engineer")}
          </div>
          <div>
            <label style={s.label}>Salary</label>
            {fieldInput("salary", "50000", "number")}
          </div>
          <div>
            <label style={s.label}>Department *</label>
            {fieldInput("department", "Engineering")}
          </div>
          <div>
            <label style={s.label}>Employment Type *</label>
            <div>
              <select
                name="employmentType"
                style={{ ...s.select, width: "100%", borderColor: errors.employmentType ? "var(--danger)" : "var(--border)" }}
                value={form.employmentType}
                onChange={e => handleChange("employmentType", e.target.value)}
              >
                <option value="">Select</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </select>
              {errors.employmentType && <span style={{ color: "var(--danger)", fontSize: "11px" }}>{errors.employmentType}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {editingId ? (
            <>
              <button style={s.btnPrimary} onClick={updateEmployee}>Update Employee</button>
              <button style={{ ...s.btnDanger, padding: "9px 18px" }} onClick={resetForm}>Cancel</button>
            </>
          ) : (
            <button style={s.btnPrimary} onClick={createEmployee}>Add Employee</button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <h3 style={{ ...s.sectionTitle, marginBottom: 0 }}>
            All Employees
            <span style={{ marginLeft: "10px", ...s.badge("#4f46e5", "#eef2ff"), fontSize: "12px" }}>
              {filtered.length}
            </span>
          </h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              style={{ ...s.input, width: "220px" }}
              placeholder="🔍  Search by name, email, code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={focusInput}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
            <select
              style={{ ...s.select, minWidth: "150px" }}
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["Code", "Employee", "Email", "Phone", "Department", "Designation", "Type", "Salary", "Status", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ ...s.td, textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  ⏳ Loading employees...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ ...s.td, textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  {search || filterDept ? "No employees match your search." : "No employees found."}
                </td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={s.td}>
                    <span style={{ fontFamily: "monospace", fontSize: "12px", background: "var(--bg-main)", padding: "2px 7px", borderRadius: "4px" }}>
                      {emp.employeeCode || "—"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "var(--primary-bg)", color: "var(--primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: "12px", flexShrink: 0
                      }}>
                        {(emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")}
                      </div>
                      <span style={{ fontWeight: 500 }}>{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  <td style={s.td}>{emp.email}</td>
                  <td style={s.td}>{emp.phone || "—"}</td>
                  <td style={s.td}>{emp.department || "—"}</td>
                  <td style={s.td}>{emp.designation || "—"}</td>
                  <td style={s.td}>
                    {emp.employmentType ? (
                      <span style={s.badge("#0891b2", "#cffafe")}>
                        {emp.employmentType.replace("_", " ")}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={s.td}>
                    {emp.salary ? `$${emp.salary.toLocaleString()}` : "—"}
                  </td>
                  <td style={s.td}>
                    <span style={s.badge(
                      emp.active ? "var(--success)" : "var(--danger)",
                      emp.active ? "var(--success-bg)" : "var(--danger-bg)"
                    )}>
                      {emp.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnWarning} onClick={() => editEmployee(emp)}>Edit</button>
                    <button style={s.btnDanger} onClick={() => deleteEmployee(emp.id, `${emp.firstName} ${emp.lastName}`)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Employees;
