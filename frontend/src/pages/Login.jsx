import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROLE_TO_DOMAIN } from "../context/RoleContext";
import { RiShieldUserLine, RiTeamLine, RiUserLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const ROLE_TABS = [
  {
    key: "ADMIN",
    label: "Admin",
    icon: RiShieldUserLine,
    color: "#1e40af",
    bg: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    hint: "Full system access",
    field1Label: "Email Address",
    field1Placeholder: "",
    field1Type: "email",
    field2Label: "Password",
    field2Placeholder: "",
  },
  {
    key: "HR",
    label: "HR",
    icon: RiTeamLine,
    color: "#7c3aed",
    bg: "linear-gradient(135deg, #5b21b6, #7c3aed)",
    hint: "HR management access",
    field1Label: "Email Address",
    field1Placeholder: "",
    field1Type: "email",
    field2Label: "Password",
    field2Placeholder: "",
  },
  {
    key: "EMPLOYEE",
    label: "Employee",
    icon: RiUserLine,
    color: "#059669",
    bg: "linear-gradient(135deg, #065f46, #059669)",
    hint: "Personal self-service portal",
    field1Label: "Employee Code",
    field1Placeholder: "",
    field1Type: "text",
    field2Label: "Employee Code (Password)",
    field2Placeholder: "",
  },
];

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get("role")?.toUpperCase() || "ADMIN";
  const validRole   = ROLE_TABS.find(t => t.key === initialRole) ? initialRole : "ADMIN";

  const [activeTab,    setActiveTab]    = useState(validRole);
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when tab changes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
  }, [activeTab]);

  const tab = ROLE_TABS.find(t => t.key === activeTab);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let payload;
      if (activeTab === "EMPLOYEE") {
        // Employee logs in with employeeCode as both username and password
        const code = email.trim();
        payload = { employeeCode: code, password: code };
      } else {
        payload = { email: email.trim(), password: password.trim() };
      }

      const response = await api.post("/auth/login", payload);
      const data = response.data;

      // Verify the returned role matches the selected tab
      if (String(data.role).toUpperCase() !== activeTab) {
        setError(`This account does not have ${tab.label} access. Please use the correct role tab.`);
        setLoading(false);
        return;
      }

      // Clear any previous session before storing new one
      localStorage.clear();
      localStorage.setItem("token",      data.token);
      localStorage.setItem("email",      data.email);
      localStorage.setItem("role",       String(data.role).toUpperCase());
      if (data.employeeId) {
        localStorage.setItem("employeeId", String(data.employeeId));
      }
      if (data.name) {
        localStorage.setItem("name", data.name);
      }

      const domain = ROLE_TO_DOMAIN[String(data.role).toUpperCase()] || "employee";
      navigate(`/${domain}/dashboard`, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data || "";
      setError(msg || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #1e1b4b 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 14px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}>🏢</div>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
            Enterprise EMS
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "6px", fontSize: "13.5px" }}>
            Employee Management System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: "20px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}>

          {/* Role Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
            {ROLE_TABS.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  flex: 1, padding: "14px 8px",
                  background: activeTab === key ? "#fff" : "#f8fafc",
                  border: "none", cursor: "pointer",
                  borderBottom: activeTab === key ? `2.5px solid ${color}` : "2.5px solid transparent",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { if (activeTab !== key) e.currentTarget.style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (activeTab !== key) e.currentTarget.style.background = "#f8fafc"; }}
              >
                <Icon size={18} color={activeTab === key ? color : "#94a3b8"} />
                <span style={{
                  fontSize: "11.5px", fontWeight: activeTab === key ? 700 : 500,
                  color: activeTab === key ? color : "#94a3b8",
                  transition: "color 0.18s",
                }}>{label}</span>
              </button>
            ))}
          </div>

          {/* Form body */}
          <div style={{ padding: "28px 32px 32px" }}>

            {/* Role hint banner */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 14px", borderRadius: "10px", marginBottom: "22px",
              background: tab.color + "10",
              border: `1px solid ${tab.color}30`,
            }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: tab.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <tab.icon size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700, color: tab.color }}>
                  Sign in as {tab.label}
                </div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "1px" }}>
                  {tab.hint}
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
              Welcome back
            </h2>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "22px" }}>
              Sign in to your {tab.label.toLowerCase()} account to continue
            </p>

            {error && (
              <div style={{
                background: "#fff5f5", color: "#dc2626",
                padding: "10px 14px", borderRadius: "8px",
                fontSize: "13px", marginBottom: "18px",
                border: "1px solid #fecaca",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}>
                <span style={{ flexShrink: 0, marginTop: "1px" }}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Field 1 */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  {tab.field1Label}
                </label>
                <input
                  type={tab.field1Type}
                  placeholder={tab.field1Placeholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "1.5px solid #e2e8f0", borderRadius: "10px",
                    fontSize: "13.5px", outline: "none",
                    color: "#0f172a", background: "#fafafa",
                    transition: "border-color 0.18s, box-shadow 0.18s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = tab.color; e.target.style.boxShadow = `0 0 0 3px ${tab.color}18`; }}
                  onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {/* Field 2 */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                  {tab.field2Label}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={tab.field2Placeholder}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%", padding: "10px 42px 10px 14px",
                      border: "1.5px solid #e2e8f0", borderRadius: "10px",
                      fontSize: "13.5px", outline: "none",
                      color: "#0f172a", background: "#fafafa",
                      transition: "border-color 0.18s, box-shadow 0.18s",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = tab.color; e.target.style.boxShadow = `0 0 0 3px ${tab.color}18`; }}
                    onBlur={e =>  { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", display: "flex", alignItems: "center",
                    }}
                    tabIndex={-1}
                  >
                    {showPassword ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "12px",
                  background: loading ? "#a5b4fc" : tab.bg,
                  color: "#fff", border: "none",
                  borderRadius: "10px", fontSize: "14px",
                  fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.18s, transform 0.18s",
                  letterSpacing: "0.01em",
                  boxShadow: loading ? "none" : `0 4px 14px ${tab.color}40`,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? "Signing in…" : `Sign In as ${tab.label} →`}
              </button>
            </form>
          </div>
        </div>

        {/* Role switch hint */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "20px" }}>
          Different role? Select a tab above to switch login context.
        </p>
      </div>
    </div>
  );
}

export default Login;
