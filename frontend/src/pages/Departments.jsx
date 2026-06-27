import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s } from "../styles/ui";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createDepartment = async () => {
    try {
      await api.post("/departments", { departmentName });
      setDepartmentName("");
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  const editDepartment = (department) => {
    setEditingId(department.id);
    setDepartmentName(department.departmentName);
  };

  const updateDepartment = async () => {
    try {
      await api.put(`/departments/${editingId}`, { departmentName });
      setEditingId(null);
      setDepartmentName("");
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDepartment = async (id) => {
    const confirmDelete = window.confirm("Delete Department?");
    if (!confirmDelete) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error(error);
    }
  };

  const deptColors = ["#4f46e5", "#7c3aed", "#059669", "#d97706", "#0891b2", "#dc2626"];

  return (
    <MainLayout>
      <h1 style={s.pageTitle}>Departments</h1>
      <p style={s.pageSubtitle}>Manage your organization's departments</p>

      {/* Form Card */}
      <div style={s.card}>
        <h3 style={s.sectionTitle}>
          {editingId ? "✏️ Edit Department" : "➕ Add New Department"}
        </h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label style={s.label}>Department Name</label>
            <input
              style={s.input}
              type="text"
              placeholder="e.g. Engineering"
              value={departmentName}
              onChange={e => setDepartmentName(e.target.value)}
              onFocus={e => e.target.style.borderColor = "var(--primary)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {editingId ? (
              <>
                <button style={s.btnPrimary} onClick={updateDepartment}>Update</button>
                <button style={{ ...s.btnDanger, padding: "9px 16px" }}
                  onClick={() => { setEditingId(null); setDepartmentName(""); }}>
                  Cancel
                </button>
              </>
            ) : (
              <button style={s.btnPrimary} onClick={createDepartment}>Add Department</button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "24px" }}>
        {departments.map((dept, index) => (
          <div key={dept.id} style={{
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "18px 20px",
            flex: "1 1 180px",
            boxShadow: "var(--shadow-sm)",
            borderTop: `3px solid ${deptColors[index % deptColors.length]}`
          }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>🏢</div>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
              {dept.departmentName}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "14px" }}>
              ID: #{dept.id}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button style={s.btnWarning} onClick={() => editDepartment(dept)}>Edit</button>
              <button style={s.btnDanger} onClick={() => deleteDepartment(dept.id)}>Delete</button>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div style={{ color: "var(--text-muted)", fontSize: "13px", padding: "20px 0" }}>
            No departments found.
          </div>
        )}
      </div>

      {/* Table Card */}
      <div style={s.card}>
        <h3 style={{ ...s.sectionTitle, marginBottom: "0" }}>
          All Departments
          <span style={{ marginLeft: "10px", ...s.badge("#7c3aed", "#ede9fe"), fontSize: "12px" }}>
            {departments.length}
          </span>
        </h3>
        <div style={{ overflowX: "auto", marginTop: "16px" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["ID", "Department Name", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departments.map(dept => (
                <tr key={dept.id}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={s.td}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>#{dept.id}</span>
                  </td>
                  <td style={s.td}>
                    <span style={{ fontWeight: 500 }}>🏢 {dept.departmentName}</span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnWarning} onClick={() => editDepartment(dept)}>Edit</button>
                    <button style={s.btnDanger} onClick={() => deleteDepartment(dept.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr><td colSpan={3} style={{ ...s.td, textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>
                  No departments found.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}

export default Departments;
