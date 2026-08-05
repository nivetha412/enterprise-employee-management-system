import { useNavigate } from "react-router-dom";
import { ROLE_TO_DOMAIN } from "../context/RoleContext";

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => {
    const role   = localStorage.getItem("role");
    const token  = localStorage.getItem("token");
    if (token && role) {
      const domain = ROLE_TO_DOMAIN[role] || "employee";
      navigate(`/${domain}/dashboard`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontSize: "96px", fontWeight: 900,
          background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: 1, marginBottom: "16px",
          letterSpacing: "-0.04em",
        }}>
          404
        </div>
        <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
          Page Not Found
        </div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", marginBottom: "32px", lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <button
          onClick={goHome}
          style={{
            padding: "12px 32px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "#fff", border: "none", borderRadius: "12px",
            fontSize: "14px", fontWeight: 700, cursor: "pointer",
            fontFamily: "var(--font)",
            boxShadow: "0 4px 20px rgba(37,99,235,0.5)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(37,99,235,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.5)"; }}
        >
          ← Go to Dashboard
        </button>
      </div>
    </div>
  );
}
