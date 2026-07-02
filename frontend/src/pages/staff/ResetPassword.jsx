// src/pages/staff/ResetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate       = useNavigate();

  const [form, setForm]                 = useState({ password: "", confirm: "" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/users/password-reset/confirm/",
        { uid, token, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(true);
      setTimeout(() => navigate("/staff/login"), 3000); // ← fixed
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired reset link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div style={{
        width: "100%", maxWidth: "420px", margin: "0 24px",
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.2)",
        borderRadius: "16px", backdropFilter: "blur(20px)",
        padding: "48px 40px", position: "relative", zIndex: 1,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb, #60a5fa)",
            marginBottom: "16px", boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f9ff", margin: "0 0 6px" }}>Set New Password</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>Choose a strong password for your account.</p>
        </div>

        <div style={{ height: "1px", marginBottom: "28px", background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)" }} />

        {/* Success state */}
        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "#6ee7b7", fontSize: "15px", fontWeight: "700", margin: "0 0 6px" }}>Password reset successfully!</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 20px" }}>Redirecting to login…</p>
            <Link to="/staff/login" style={{   /* ← fixed */
              display: "inline-block", padding: "10px 24px",
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              color: "#fff", borderRadius: "8px", fontSize: "13px",
              fontWeight: "700", textDecoration: "none",
            }}>
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: "8px", marginBottom: "18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "13px" }}>
                {error}
              </div>
            )}

            {/* New password */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                New Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required placeholder="Min. 8 characters"
                  style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f9ff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                  onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(255,255,255,0.3)" }}>
                  {showPassword
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                Confirm Password
              </label>
              <input
                type="password" value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                required placeholder="Re-enter password"
                style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f9ff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit" }}
                onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", border: "none", borderRadius: "8px",
              background: loading ? "rgba(96,165,250,0.3)" : "linear-gradient(135deg, #2563eb, #60a5fa)",
              color: loading ? "rgba(255,255,255,0.5)" : "#fff",
              fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
              transition: "all 0.2s", fontFamily: "inherit",
            }}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResetPassword;
