import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

export default function EmployeeSettings() {
  const navigate = useNavigate();
  const isEmployee = localStorage.getItem("role") === "EMPLOYEE";
  const canChangePassword = isEmployee || localStorage.getItem("role") === "ADMIN";
  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async event => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setBusy(true);
    try {
      await api.put(isEmployee ? "/employees/me/password" : "/auth/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      const loginPayload = isEmployee
        ? { employeeCode: localStorage.getItem("email"), password: form.newPassword }
        : { email: localStorage.getItem("email"), password: form.newPassword };
      const loginResponse = await api.post("/auth/login", loginPayload);
      localStorage.setItem("mustChangePassword", String(loginResponse.data.mustChangePassword === true));
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      localStorage.setItem("mustChangePassword", "false");
      if (mustChangePassword) {
        navigate("/employee/dashboard", { replace: true });
      } else {
        setMessage("Password updated successfully.");
      }
    } catch (requestError) {
      setError(requestError?.userMessage || "Unable to update your password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MainLayout>
      <section style={{ maxWidth: 620, background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0" }}>
        <h1 style={{ fontSize: 20 }}>Account settings</h1>
        {canChangePassword ? (
          <>
            <p style={{ color: "#64748b", marginTop: 8, marginBottom: 20 }}>
              {mustChangePassword
                ? "Your temporary password must be changed before you can continue."
                : "Change your account password."}
            </p>
            {message && <p role="status" style={{ color: "#047857" }}>{message}</p>}
            {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              <label>
                {mustChangePassword ? "Temporary password" : "Current password"}
                <input required autoComplete="current-password" type="password" value={form.currentPassword}
                  onChange={event => setForm(current => ({ ...current, currentPassword: event.target.value }))} />
              </label>
              <label>
                New password (12–72 characters)
                <input required minLength={12} maxLength={72} autoComplete="new-password" type="password" value={form.newPassword}
                  onChange={event => setForm(current => ({ ...current, newPassword: event.target.value }))} />
              </label>
              <label>
                Confirm new password
                <input required minLength={12} maxLength={72} autoComplete="new-password" type="password" value={form.confirmPassword}
                  onChange={event => setForm(current => ({ ...current, confirmPassword: event.target.value }))} />
              </label>
              <button type="submit" disabled={busy}>
                {busy ? "Updating…" : mustChangePassword ? "Set password and continue" : "Update password"}
              </button>
            </form>
          </>
        ) : <p style={{ color: "#64748b", marginTop: 8 }}>No account settings are available for this role.</p>}
      </section>
    </MainLayout>
  );
}
