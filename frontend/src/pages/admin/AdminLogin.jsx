// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/admin/login/',
        { email: formData.email, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('adminToken', response.data.access);
      localStorage.setItem('adminRefreshToken', response.data.refresh);
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You are not authorized to access the admin panel.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1e14 0%, #1a3a24 50%, #0f1e14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.07,
        backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow blobs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px', margin: '0 24px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        padding: '48px 40px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 1,
      }}>

        {/* Back to Home */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontFamily: "'Segoe UI', sans-serif",
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(74,222,128,0.9)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #059669, #34d399)',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '22px', fontWeight: '700', color: '#f0fdf4',
            letterSpacing: '0.02em', margin: '0 0 4px',
          }}>
            RETECH Admin
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: '0.05em' }}>
            SECURE CONTROL PANEL
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)',
          marginBottom: '32px',
        }} />

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', fontSize: '13px', lineHeight: '1.5',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: '600',
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@retech.com"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0fdf4', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: '600',
              color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: '8px',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••••"
                style={{
                  width: '100%', padding: '12px 44px 12px 16px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0fdf4', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: 0,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
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
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading
                ? 'rgba(74,222,128,0.3)'
                : 'linear-gradient(135deg, #059669, #34d399)',
              border: 'none', borderRadius: '8px',
              color: loading ? 'rgba(255,255,255,0.5)' : '#fff',
              fontSize: '14px', fontWeight: '700',
              letterSpacing: '0.05em', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(5,150,105,0.4)',
              transition: 'all 0.2s', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          textAlign: 'center', marginTop: '24px', marginBottom: 0,
          fontSize: '11px', color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.05em',
        }}>
          Restricted to authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;