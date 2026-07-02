// src/pages/staff/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:8000/api/users/password-reset/",
        { email: email.toLowerCase().trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
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

        {/* Back link */}
        <div style={{ marginBottom: "24px" }}>
          <Link to="/staff-login" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </div>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #2563eb, #60a5fa)",
            marginBottom: "16px", boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#f0f9ff", margin: "0 0 6px" }}>Forgot Password?</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>
            Enter your staff email and we'll send you a reset link.
          </p>
        </div>

        <div style={{ height: "1px", marginBottom: "28px", background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)" }} />

        {/* Success state */}
        {sent ? (
          <div>
            <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>📧</div>
              <p style={{ color: "#6ee7b7", fontSize: "14px", fontWeight: "600", margin: "0 0 4px" }}>Reset link sent!</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>
                Check your email for the password reset link. It expires in 24 hours.
              </p>
            </div>
            <Link to="/staff-login" style={{
              display: "block", textAlign: "center", padding: "12px",
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              color: "#fff", borderRadius: "8px", fontSize: "14px",
              fontWeight: "700", textDecoration: "none",
            }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: "8px", marginBottom: "18px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "13px" }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="your@email.com"
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
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;