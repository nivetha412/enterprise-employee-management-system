function Navbar() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const initials = email ? email.slice(0, 2).toUpperCase() : "U";

  return (
    <div style={{
      height: "var(--navbar-height)",
      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(79,70,229,0.3)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "32px", height: "32px",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px"
        }}>
          🏢
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "-0.02em" }}>
            Enterprise EMS
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>
            Employee Management System
          </div>
        </div>
      </div>

      {email && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>{email}</div>
            <div style={{
              color: "rgba(255,255,255,0.7)", fontSize: "11px",
              background: "rgba(255,255,255,0.15)", borderRadius: "4px",
              padding: "1px 6px", display: "inline-block", marginTop: "2px"
            }}>
              {role}
            </div>
          </div>
          <div style={{
            width: "34px", height: "34px",
            background: "rgba(255,255,255,0.25)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: "13px",
            border: "2px solid rgba(255,255,255,0.4)"
          }}>
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
