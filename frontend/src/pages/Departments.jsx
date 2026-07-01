import { useEffect, useState } from "react";
import api from "../services/api";
import MainLayout from "../layouts/MainLayout";
import { s, Toast, PageHeader, StatCard, EmptyState, SectionHeader, Field } from "../styles/ui.jsx";
import {
  RiBuildingLine, RiAddLine, RiEditLine, RiDeleteBinLine,
  RiCheckLine, RiCloseLine, RiTeamLine, RiBarChartLine
} from "react-icons/ri";

const DEPT_PALETTE = [
  { accent: "#1e40af", bg: "#dbeafe", light: "#eff6ff" },
  { accent: "#7c3aed", bg: "#ede9fe", light: "#f5f3ff" },
  { accent: "#059669", bg: "#d1fae5", light: "#ecfdf5" },
  { accent: "#d97706", bg: "#fef3c7", light: "#fffbeb" },
  { accent: "#0891b2", bg: "#cffafe", light: "#ecfeff" },
  { accent: "#dc2626", bg: "#fee2e2", light: "#fff5f5" },
  { accent: "#0d9488", bg: "#ccfbf1", light: "#f0fdfa" },
  { accent: "#ea580c", bg: "#ffedd5", light: "#fff7ed" },
];

function Departments() {
  const [departments, setDepartments]   = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editingId, setEditingId]       = useState(null);
  const [nameError, setNameError]       = useState("");
  const [toast, setToast]               = useState({ message: "", type: "success" });

  useEffect(() => { fetchDepartments(); }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load departments", "error");
    }
  };

  const createDepartment = async () => {
    if (!departmentName.trim()) { setNameError("Department name is required"); return; }
    try {
      await api.post("/departments", { departmentName });
      setDepartmentName("");
      setNameError("");
      fetchDepartments();
      showToast("Department created successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to create department", "error");
    }
  };

  const editDepartment = (department) => {
    setEditingId(department.id);
    setDepartmentName(department.departmentName);
    setNameError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateDepartment = async () => {
    if (!departmentName.trim()) { setNameError("Department name is required"); return; }
    try {
      await api.put(`/departments/${editingId}`, { departmentName });
      setEditingId(null);
      setDepartmentName("");
      setNameError("");
      fetchDepartments();
      showToast("Department updated successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to update department", "error");
    }
  };

  const deleteDepartment = async (id, name) => {
    if (!window.confirm(`Delete department "${name}"?`)) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
      showToast("Department deleted");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete department", "error");
    }
  };

  const cancelEdit = () => { setEditingId(null); setDepartmentName(""); setNameError(""); };

  const onFocus = e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)"; };
  const onBlur  = e => { e.target.style.borderColor = nameError ? "var(--danger)" : "var(--border)"; e.target.style.boxShadow = "none"; };

  return (
    <MainLayout>
      <Toast message={toast.message} type={toast.type} />

      {/* Page Header */}
      <PageHeader
        icon={<RiBuildingLine size={22} color="#fff" />}
        title="Departments"
        subtitle={`${departments.length} department${departments.length !== 1 ? "s" : ""} in your organization`}
      />

      {/* Stat Row */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <StatCard label="Total Departments" value={departments.length} color="#1e40af" bg="#dbeafe" icon={<RiBuildingLine color="#1e40af" size={18} />} />
        <StatCard label="Active"            value={departments.length} color="#059669" bg="#d1fae5" icon={<RiBarChartLine color="#059669" size={18} />} />
      </div>

      {/* Form Card */}
      <div style={{ ...s.card, border: editingId ? "1.5px solid #fde68a" : "1.5px solid #bfdbfe" }}>
        <SectionHeader
          title={editingId ? "Edit Department" : "Add New Department"}
          count={editingId ? "Editing" : "New"}
          countColor={editingId ? "#d97706" : "#1e40af"}
          countBg={editingId ? "#fef3c7" : "#dbeafe"}
        />
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <Field label="Department Name" error={nameError} span={undefined}>
            <div style={{ minWidth: "280px" }}>
              <input
                style={{
                  ...s.input,
                  borderColor: nameError ? "var(--danger)" : "var(--border)",
                  boxShadow: nameError ? "0 0 0 3px rgba(220,38,38,0.08)" : "none"
                }}
                type="text"
                placeholder="e.g. Engineering, Marketing, Finance…"
                value={departmentName}
                onChange={e => { setDepartmentName(e.target.value); if (nameError) setNameError(""); }}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={e => e.key === "Enter" && (editingId ? updateDepartment() : createDepartment())}
              />
              {nameError && <span style={{ color: "var(--danger)", fontSize: "11px", marginTop: "3px", display: "block" }}>{nameError}</span>}
            </div>
          </Field>
          <div style={{ display: "flex", gap: "8px", paddingBottom: nameError ? "18px" : "0" }}>
            {editingId ? (
              <>
                <button style={s.btnPrimary} onClick={updateDepartment}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  <RiCheckLine size={14} /> Update
                </button>
                <button style={s.btnGhost} onClick={cancelEdit}>
                  <RiCloseLine size={14} /> Cancel
                </button>
              </>
            ) : (
              <button style={s.btnPrimary} onClick={createDepartment}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                <RiAddLine size={14} /> Add Department
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      {departments.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          {departments.map((dept, index) => {
            const palette = DEPT_PALETTE[index % DEPT_PALETTE.length];
            const isEditing = editingId === dept.id;
            return (
              <div
                key={dept.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${isEditing ? palette.accent + "66" : "var(--border)"}`,
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: isEditing
                    ? `0 0 0 3px ${palette.accent}22, 0 4px 16px rgba(0,0,0,0.06)`
                    : "0 1px 4px rgba(0,0,0,0.05)",
                  borderTop: `3px solid ${palette.accent}`,
                  transition: "transform 0.18s, box-shadow 0.18s",
                  cursor: "default"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isEditing ? `0 0 0 3px ${palette.accent}22, 0 4px 16px rgba(0,0,0,0.06)` : "0 1px 4px rgba(0,0,0,0.05)"; }}
              >
                {/* Icon */}
                <div style={{
                  width: "42px", height: "42px", borderRadius: "11px",
                  background: palette.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "12px"
                }}>
                  <RiBuildingLine size={20} color={palette.accent} />
                </div>

                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>
                  {dept.departmentName}
                </div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  ID #{dept.id}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    style={{ ...s.btnWarning, flex: 1, justifyContent: "center" }}
                    onClick={() => editDepartment(dept)}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fffbeb"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <RiEditLine size={13} /> Edit
                  </button>
                  <button
                    style={{ ...s.btnDanger, flex: 1, justifyContent: "center" }}
                    onClick={() => deleteDepartment(dept.id, dept.departmentName)}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <RiDeleteBinLine size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table Card */}
      <div style={s.card}>
        <SectionHeader title="All Departments" count={departments.length} countColor="#7c3aed" countBg="#ede9fe" />

        <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Department Name", "Color", "Actions"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr><td colSpan={4}>
                  <EmptyState icon="🏢" title="No departments yet" subtitle="Add your first department above" />
                </td></tr>
              ) : departments.map((dept, index) => {
                const palette = DEPT_PALETTE[index % DEPT_PALETTE.length];
                return (
                  <tr key={dept.id}
                    style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={s.td}>
                      <span style={{
                        fontWeight: 700, fontSize: "12px", color: "var(--text-muted)",
                        background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px"
                      }}>#{dept.id}</span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px",
                          background: palette.bg, display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <RiBuildingLine size={16} color={palette.accent} />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "13.5px" }}>{dept.departmentName}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: palette.accent }} />
                        <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontFamily: "monospace" }}>{palette.accent}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={s.btnWarning} onClick={() => editDepartment(dept)}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fef3c7"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#fffbeb"; e.currentTarget.style.transform = "translateY(0)"; }}>
                          <RiEditLine size={13} /> Edit
                        </button>
                        <button style={s.btnDanger} onClick={() => deleteDepartment(dept.id, dept.departmentName)}
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
      </div>
    </MainLayout>
  );
}

export default Departments;
