import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { EmployeeProvider } from "../../context/EmployeeContext";
import { useEmployee } from "../../hooks/useEmployee";
import api from "../../services/api";
import {
  RiUserLine, RiBriefcaseLine, RiBuildingLine, RiPhoneLine,
  RiMailLine, RiShieldCheckLine, RiMoneyDollarCircleLine,
  RiVipCrownLine, RiCheckboxCircleLine,
  RiEditLine, RiCloseLine,
} from "react-icons/ri";

function Skeleton({ w = "100%", h = 16, r = 6 }) {
  return <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />;
}

function InfoRow({ icon: Icon, label, value, color = "#1e40af", bg = "#eff6ff", loading }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #f1f5f9", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = bg}
      onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={16} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
          {loading ? <Skeleton w="60%" h={14} /> : (value || "—")}
        </div>
      </div>
    </div>
  );
}

function ProfileContent() {
  const { emp: contextEmp, loading, attStats, leaveStats, reload } = useEmployee();
  const [profileEmp, setProfileEmp] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({});
  const accountEmail = localStorage.getItem("email") || "";
  const accountName = localStorage.getItem("name") || accountEmail.split("@")[0] || "User";
  const accountRole = localStorage.getItem("role") || "EMPLOYEE";

  useEffect(() => {
    let cancelled = false;
    const employeeId = localStorage.getItem("employeeId");
    const request = employeeId
      ? api.get(`/employees/${employeeId}`).catch(() => api.get("/employees/me"))
      : api.get("/employees/me");

    request
      .then(response => { if (!cancelled) setProfileEmp(response.data); })
      .catch(() => { if (!cancelled) setProfileEmp(null); })
      .finally(() => { if (!cancelled) setProfileLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // An admin can use these account pages without having an Employee record.
  const accountProfile = {
    firstName: accountName, lastName: "", email: accountEmail,
    designation: accountRole === "ADMIN" ? "Administrator" : "",
    department: accountRole === "ADMIN" ? "Administration" : "",
    employmentType: "Account", employeeCode: accountRole === "ADMIN" ? "ADMIN" : "",
    active: true,
  };
  const emp = profileEmp || contextEmp || (!profileLoading ? accountProfile : null);

  const fullName = emp ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() : "—";
  const initials = emp ? `${emp.firstName?.[0] ?? ""}${emp.lastName?.[0] ?? ""}`.toUpperCase() : "…";

  const personalInfo = [
    { icon: RiUserLine,               label: "Full Name",       value: fullName,             color: "#1e40af", bg: "#eff6ff" },
    { icon: RiMailLine,               label: "Email",           value: emp?.email,            color: "#7c3aed", bg: "#f5f3ff" },
    { icon: RiPhoneLine,              label: "Phone",           value: emp?.phone,            color: "#059669", bg: "#ecfdf5" },
    { icon: RiVipCrownLine,           label: "Gender",          value: emp?.gender,           color: "#d97706", bg: "#fffbeb" },
  ].filter(item => item.value);

  const workInfo = [
    { icon: RiUserLine,               label: "Employee Code",   value: emp?.employeeCode,     color: "#1e40af", bg: "#eff6ff" },
    { icon: RiBriefcaseLine,          label: "Designation",     value: emp?.designation,      color: "#7c3aed", bg: "#f5f3ff" },
    { icon: RiBuildingLine,           label: "Department",      value: emp?.department,       color: "#0891b2", bg: "#ecfeff" },
    { icon: RiShieldCheckLine,        label: "Employment Type", value: emp?.employmentType,   color: "#d97706", bg: "#fffbeb" },
    { icon: RiMoneyDollarCircleLine,  label: "Salary",          value: emp?.salary ? `$${Number(emp.salary).toLocaleString()}` : null, color: "#059669", bg: "#ecfdf5" },
    { icon: RiCheckboxCircleLine,     label: "Status",          value: emp?.active ? "Active" : "Inactive", color: emp?.active ? "#059669" : "#dc2626", bg: emp?.active ? "#ecfdf5" : "#fef2f2" },
  ].filter(item => item.value);

  const statCards = [
    { label: "Present Days",   value: attStats.presentDays, color: "#059669", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "#6ee7b760" },
    { label: "Late Arrivals",  value: attStats.lateDays,    color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d60" },
    { label: "Leave Approved", value: leaveStats.approved,  color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "#c4b5fd60" },
    { label: "Leave Pending",  value: leaveStats.pending,   color: "#1e40af", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#93c5fd60" },
  ];

  const startEditing = () => {
    setSaveError("");
    setForm({
      firstName: emp?.firstName || "", lastName: emp?.lastName || "", email: emp?.email || accountEmail,
      phone: emp?.phone || "", gender: emp?.gender || "", designation: emp?.designation || "",
      department: emp?.department || "", employmentType: emp?.employmentType || "", salary: emp?.salary ?? "",
    });
    setEditing(true);
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      if (emp?.id && accountRole === "EMPLOYEE") {
        const response = await api.put("/employees/me", {
          firstName: form.firstName, lastName: form.lastName, email: form.email,
          phone: form.phone, gender: form.gender,
        });
        setProfileEmp(response.data);
        await reload();
      }
      localStorage.setItem("name", `${form.firstName} ${form.lastName}`.trim());
      localStorage.setItem("email", form.email);
      window.dispatchEvent(new Event("profile-updated"));
      setEditing(false);
    } catch (error) {
      setSaveError(error?.response?.data?.message || "Unable to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="fade-in" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a8a 40%,#1e40af 70%,#2563eb 100%)", borderRadius: "20px", padding: "28px 32px", marginBottom: "20px", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(30,64,175,0.3)" }}>
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "linear-gradient(135deg,#60a5fa,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800, color: "#fff", border: "3px solid rgba(255,255,255,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", flexShrink: 0 }}>
            {profileLoading ? "…" : initials}
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: 0 }}>{profileLoading ? "Loading…" : fullName}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", marginTop: "4px" }}>{profileLoading ? "" : `${emp?.designation || ""} · ${emp?.department || ""}`}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#93c5fd", background: "rgba(147,197,253,0.15)", padding: "3px 12px", borderRadius: "20px", border: "1px solid rgba(147,197,253,0.3)" }}>
                {emp?.employeeCode || "—"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: emp?.active ? "#86efac" : "#fca5a5", background: emp?.active ? "rgba(134,239,172,0.15)" : "rgba(252,165,165,0.15)", padding: "3px 12px", borderRadius: "20px", border: `1px solid ${emp?.active ? "rgba(134,239,172,0.3)" : "rgba(252,165,165,0.3)"}` }}>
                {emp?.active ? "● Active" : "● Inactive"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#fde68a", background: "rgba(253,230,138,0.15)", padding: "3px 12px", borderRadius: "20px", border: "1px solid rgba(253,230,138,0.3)" }}>
                {emp?.employmentType || "—"}
              </span>
            </div>
          </div>
          {accountRole === "EMPLOYEE" && <button onClick={startEditing} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "7px", padding: "9px 13px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "10px", background: "rgba(255,255,255,0.12)", color: "#fff", font: "inherit", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
            <RiEditLine size={15} /> Edit Profile
          </button>}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {statCards.map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ background: bg, borderRadius: "16px", padding: "20px", border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1 }}>{loading ? "…" : value}</div>
            <div style={{ fontSize: "12px", color: "#475569", marginTop: "6px", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="emp-grid-2">
        {/* Personal Info */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Personal Information</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Your personal details</p>
          </div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {personalInfo.map(p => <InfoRow key={p.label} {...p} loading={profileLoading} />)}
          </div>
        </div>

        {/* Work Info */}
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e8edf5", boxShadow: "0 4px 24px rgba(30,64,175,0.07)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>Work Information</h3>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Your employment details</p>
          </div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {workInfo.map(p => <InfoRow key={p.label} {...p} loading={profileLoading} />)}
          </div>
        </div>
      </div>

      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <form onSubmit={saveProfile} style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: "18px", padding: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}><div><h2 style={{ fontSize: "18px" }}>Edit Profile</h2><p style={{ color: "#64748b", fontSize: "12px" }}>Update your account details.</p></div><button type="button" onClick={() => setEditing(false)} aria-label="Close" style={{ border: 0, background: "none", cursor: "pointer", color: "#475569" }}><RiCloseLine size={22} /></button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="emp-grid-2">
              {[['firstName','First name'],['lastName','Last name'],['email','Email'],['phone','Phone'],['gender','Gender']].map(([key, label]) => <label key={key} style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>{label}<input required={['firstName','lastName','email'].includes(key)} type={key === 'email' ? 'email' : 'text'} value={form[key] ?? ''} onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))} style={{ width: "100%", marginTop: "5px", padding: "9px 10px", border: "1px solid #cbd5e1", borderRadius: "8px", font: "inherit" }} /></label>)}
            </div>
            {saveError && <p style={{ marginTop: "14px", color: "#dc2626", fontSize: "12px" }}>{saveError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "22px" }}><button type="button" onClick={() => setEditing(false)} style={{ padding: "9px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer" }}>Cancel</button><button disabled={saving} type="submit" style={{ padding: "9px 14px", border: 0, borderRadius: "8px", background: "#1e40af", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button></div>
          </form>
        </div>
      )}
    </>
  );
}

export default function EmployeeProfile() {
  return (
    <EmployeeProvider>
      <MainLayout>
        <ProfileContent />
      </MainLayout>
    </EmployeeProvider>
  );
}
