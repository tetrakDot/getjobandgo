import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { Building2, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Invalid credentials",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Left panel — decorative */
        .login-panel-left {
          flex: 1;
          display: none;
          position: relative;
          overflow: hidden;
          background: #0d0d16;
        }
        @media (min-width: 900px) {
          .login-panel-left { display: block; }
        }

        .panel-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .panel-glow-1 {
          position: absolute;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
          pointer-events: none;
        }
        .panel-glow-2 {
          position: absolute;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%);
          bottom: 40px; right: -60px;
          pointer-events: none;
        }

        .panel-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
        }

        .panel-wordmark {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          color: rgba(255,255,255,0.9);
          letter-spacing: -0.3px;
        }
        .panel-wordmark span { color: rgba(147,197,253,0.8); }

        .panel-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 3.2vw, 54px);
          line-height: 1.15;
          color: #fff;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }
        .panel-headline em {
          font-style: italic;
          color: rgba(147,197,253,0.85);
        }

        .panel-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          max-width: 360px;
          font-weight: 300;
        }

        .panel-stat-row {
          display: flex;
          gap: 40px;
          margin-top: 48px;
        }
        .panel-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          color: #fff;
          letter-spacing: -0.5px;
        }
        .panel-stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 2px;
          font-weight: 500;
        }

        .panel-divider {
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent);
          position: absolute;
          right: 0; top: 0;
        }

        /* Right panel — form */
        .login-panel-right {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px 48px;
          position: relative;
          background: #0a0a0f;
        }
        @media (min-width: 900px) {
          .login-panel-right { min-width: 460px; }
        }
        @media (max-width: 600px) {
          .login-panel-right { padding: 40px 28px; }
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .form-eyebrow {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(147,197,253,0.7);
          font-weight: 600;
        }

        .form-step {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }

        .form-title {
          font-family: 'Instrument Serif', serif;
          font-size: 34px;
          color: #fff;
          letter-spacing: -0.8px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .field-wrap {
          margin-bottom: 20px;
          position: relative;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .field-inner {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          color: rgba(255,255,255,0.2);
          pointer-events: none;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 14px 16px 14px 46px;
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.18); }
        .field-input:focus {
          border-color: rgba(147,197,253,0.4);
          background: rgba(147,197,253,0.04);
          box-shadow: 0 0 0 3px rgba(147,197,253,0.08);
        }
        .field-input:focus + .field-icon-after,
        .field-wrap:has(.field-input:focus) .field-icon { color: rgba(147,197,253,0.7); }

        .error-bar {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f87171;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .error-text {
          font-size: 13px;
          color: #fca5a5;
          line-height: 1.5;
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 24px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #0a0a0f;
          background: linear-gradient(135deg, #93c5fd 0%, #818cf8 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #bfdbfe 0%, #a5b4fc 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled)::before { opacity: 1; }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 8px 32px rgba(147,197,253,0.3);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .submit-btn > * { position: relative; z-index: 1; }

        .arrow-icon {
          transition: transform 0.2s;
        }
        .submit-btn:hover:not(:disabled) .arrow-icon { transform: translateX(3px); }

        .form-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .form-footer-text {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.02em;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
        .security-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(74,222,128,0.6);
          box-shadow: 0 0 6px rgba(74,222,128,0.4);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="login-root">
        {/* Left decorative panel */}
        <div className="login-panel-left">
          <div className="panel-grid" />
          <div className="panel-glow-1" />
          <div className="panel-glow-2" />
          <div className="panel-divider" />
          <div className="panel-content">
            <div className="panel-wordmark" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Get Job And Go Logo" style={{ height: "44px", objectFit: "contain" }} />
              <div>Get Job <span>&amp;</span> Go</div>
            </div>
            <div>
              <div className="panel-headline">
                The control center for <em>every opportunity</em>.
              </div>
              <p className="panel-sub">
                Manage placements, track candidates, and oversee operations —
                all from a single, unified dashboard.
              </p>
              <div className="panel-stat-row">
                <div>
                  <div className="panel-stat-num">2.4k+</div>
                  <div className="panel-stat-label">Active placements</div>
                </div>
                <div>
                  <div className="panel-stat-num">98%</div>
                  <div className="panel-stat-label">Client satisfaction</div>
                </div>
                <div>
                  <div className="panel-stat-num">14s</div>
                  <div className="panel-stat-label">Avg. response time</div>
                </div>
              </div>
            </div>
            <div className="form-footer-text">
              © 2025 Get Job &amp; Go. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-panel-right">
          <div className="form-label-row">
            <span className="form-eyebrow">Admin Access</span>
            <span className="form-step">Secure Portal</span>
          </div>

          <h1 className="form-title">Welcome back.</h1>
          <p className="form-subtitle">
            Sign in with your administrator credentials to continue.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-bar">
                <div className="error-dot" />
                <p className="error-text">{error}</p>
              </div>
            )}

            <div className="field-wrap">
              <label className="field-label">Email Address</label>
              <div className="field-inner">
                <span className="field-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  className="field-input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className="field-wrap">
              <label className="field-label">Password</label>
              <div className="field-inner">
                <span className="field-icon">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
              style={{ marginTop: "28px" }}
            >
              {isLoading ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={16} className="arrow-icon" />
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <span className="form-footer-text">
              Get Job &amp; Go Admin Portal
            </span>
            <div className="security-badge">
              <div className="security-dot" />
              SSL Secured
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
