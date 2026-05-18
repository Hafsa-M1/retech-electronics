// src/pages/staff/StaffLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StaffLogin = () => {
  const navigate = useNavigate();
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/admin/login/",
        { email: form.email, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("staffToken", data.access);
      localStorage.setItem("staffRefreshToken", data.refresh);
      navigate("/staff/dashboard");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You are not authorised to access the staff portal.");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid email or password. Please try again.");
      }
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
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(#60a5fa 1px, transparent 1px), linear-gradient(90deg, #60a5fa 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Glow blobs */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px", width: "350px", height: "350px",
        borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px",
        borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "420px", margin: "0 24px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(96,165,250,0.2)",
        borderRadius: "16px", backdropFilter: "blur(20px)",
        padding: "48px 40px", position: "relative", zIndex: 1,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb, #60a5fa)",
            marginBottom: "16px",
            boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#f0f9ff", margin: "0 0 4px" }}>
            ReTech Staff
          </h1>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.08em" }}>
            STAFF PORTAL
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: "1px", marginBottom: "32px",
          background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)",
        }} />

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", fontSize: "13px", lineHeight: "1.5",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: "600",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: "8px",
            }}>Email Address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="your@email.com"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: "8px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0f9ff", fontSize: "14px", outline: "none",
                boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit",
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
              onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block", fontSize: "11px", fontWeight: "600",
              color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em",
              textTransform: "uppercase", marginBottom: "8px",
            }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••••"
                style={{
                  width: "100%", padding: "12px 44px 12px 16px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#f0f9ff", fontSize: "14px", outline: "none",
                  boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
                onBlur={(e)  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} style={{
                position: "absolute", right: "14px", top: "50%",
                transform: "translateY(-50%)", background: "none",
                border: "none", cursor: "pointer", padding: 0,
                color: "rgba(255,255,255,0.3)",
              }}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", border: "none", borderRadius: "8px",
            background: loading ? "rgba(96,165,250,0.3)" : "linear-gradient(135deg, #2563eb, #60a5fa)",
            color: loading ? "rgba(255,255,255,0.5)" : "#fff",
            fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 20px rgba(37,99,235,0.4)",
            transition: "all 0.2s", fontFamily: "inherit",
          }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span style={{
                  display: "inline-block", width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white", borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }} />
                Signing in…
              </span>
            ) : "Sign In to Staff Portal"}
          </button>
        </form>

        <p style={{
          textAlign: "center", marginTop: "24px", marginBottom: 0,
          fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em",
        }}>
          Restricted to authorised staff only
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StaffLogin;