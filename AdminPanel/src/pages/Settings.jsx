import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import {
  User,
  Lock,
  Bell,
  Save,
  ShieldCheck,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState("");
  const [passError, setPassError] = useState("");

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newCompanyRegistrations: true,
    newStudentRegistrations: false,
    systemUpdates: true,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassMessage("");
    setPassError("");

    if (passwords.new_password !== passwords.confirm_password) {
      setPassError("New passwords do not match.");
      return;
    }

    setPassLoading(true);
    try {
      await api.put("auth/password/", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });
      setPassMessage("Password updated successfully.");
      setPasswords({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      toast.success("Password updated successfully.");
    } catch (err) {
      setPassError(
        err.response?.data?.old_password?.[0] ||
          err.response?.data?.new_password?.[0] ||
          "Failed to update password.",
      );
      toast.error("Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleNotificationSave = (e) => {
    e.preventDefault();
    toast.success("Notification preferences saved successfully!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .s-root {
          font-family: 'DM Sans', sans-serif;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 4px;
          color: #e2e8f0;
        }

        .s-page-header { margin-bottom: 36px; }
        .s-page-title {
          font-family: 'Instrument Serif', serif;
          font-size: 30px;
          font-weight: 400;
          color: #f1f5f9;
          letter-spacing: -0.6px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        .s-page-title svg { color: #60a5fa; }
        .s-page-sub {
          font-size: 14px;
          color: rgba(148,163,184,0.8);
          font-weight: 300;
          margin-left: 38px;
        }

        .s-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        /* Sidebar */
        .s-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 8px;
          backdrop-filter: blur(8px);
        }

        .s-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 9px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(148,163,184,0.85);
          text-align: left;
          transition: background 0.15s, color 0.15s;
          margin-bottom: 2px;
          position: relative;
        }
        .s-nav-btn:hover { background: rgba(255,255,255,0.04); color: #e2e8f0; }
        .s-nav-btn.active {
          background: rgba(96,165,250,0.1);
          color: #93c5fd;
          border: 1px solid rgba(96,165,250,0.15);
        }
        .s-nav-btn .nav-chevron {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .s-nav-btn.active .nav-chevron,
        .s-nav-btn:hover .nav-chevron { opacity: 0.5; }

        /* Main card */
        .s-card {
          flex: 1;
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          backdrop-filter: blur(8px);
          min-width: 0;
        }

        .s-card-header {
          padding: 20px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .s-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: -0.2px;
        }
        .s-card-body { padding: 28px; }

        /* Profile tab */
        .s-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Instrument Serif', serif;
          font-size: 28px;
          color: #fff;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.15), 0 8px 24px rgba(59,130,246,0.25);
          flex-shrink: 0;
        }
        .s-profile-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
        }
        .s-profile-email {
          font-size: 17px;
          font-weight: 600;
          color: #f1f5f9;
          letter-spacing: -0.3px;
          margin-bottom: 6px;
        }
        .s-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          background: rgba(96,165,250,0.1);
          border: 1px solid rgba(96,165,250,0.2);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #93c5fd;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .s-role-badge::before {
          content: '';
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 6px #60a5fa;
        }

        .s-field-group { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
        .s-field { margin-bottom: 20px; }
        .s-field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(148,163,184,0.6);
          margin-bottom: 8px;
        }
        .s-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 9px;
          padding: 11px 14px;
          font-size: 14px;
          color: rgba(226,232,240,0.9);
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
          box-sizing: border-box;
        }
        .s-input::placeholder { color: rgba(148,163,184,0.3); }
        .s-input:focus {
          border-color: rgba(96,165,250,0.4);
          background: rgba(96,165,250,0.04);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08);
        }
        .s-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .s-field-hint {
          font-size: 12px;
          color: rgba(148,163,184,0.4);
          margin-top: 6px;
        }

        /* Inline col layout for security */
        .s-col-2 { max-width: 420px; }

        /* Alerts */
        .s-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 9px;
          font-size: 13px;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .s-alert-success {
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          color: #6ee7b7;
        }
        .s-alert-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
        }
        .s-alert-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }
        .s-alert-success .s-alert-dot { background: #34d399; }
        .s-alert-error .s-alert-dot { background: #f87171; }

        /* Submit button */
        .s-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .s-btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.25);
        }
        .s-btn-primary:hover:not(:disabled) {
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }
        .s-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Notification toggles */
        .s-notif-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          gap: 24px;
        }
        .s-notif-row:last-of-type { border-bottom: none; }
        .s-notif-title {
          font-size: 14px;
          font-weight: 500;
          color: #e2e8f0;
          margin-bottom: 3px;
        }
        .s-notif-sub {
          font-size: 13px;
          color: rgba(148,163,184,0.55);
          font-weight: 300;
          line-height: 1.5;
        }

        /* Toggle */
        .s-toggle { position: relative; display: inline-block; width: 42px; height: 24px; flex-shrink: 0; }
        .s-toggle input { opacity: 0; width: 0; height: 0; }
        .s-toggle-track {
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .s-toggle-track::after {
          content: '';
          position: absolute;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          top: 3px; left: 3px;
          transition: transform 0.2s, background 0.2s;
        }
        .s-toggle input:checked + .s-toggle-track {
          background: rgba(96,165,250,0.25);
          border-color: rgba(96,165,250,0.4);
        }
        .s-toggle input:checked + .s-toggle-track::after {
          transform: translateX(18px);
          background: #60a5fa;
          box-shadow: 0 0 8px rgba(96,165,250,0.6);
        }

        .s-save-row { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }

        @media (max-width: 700px) {
          .s-layout { flex-direction: column; }
          .s-sidebar { width: 100%; display: flex; gap: 4px; padding: 6px; }
          .s-nav-btn { flex: 1; justify-content: center; }
          .nav-chevron { display: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="s-root">
        <div className="s-page-header">
          <h1 className="s-page-title">
            <ShieldCheck size={22} /> Admin Settings
          </h1>
          <p className="s-page-sub">
            Manage your account credentials and system notifications.
          </p>
        </div>

        <div className="s-layout">
          {/* Sidebar */}
          <nav className="s-sidebar">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`s-nav-btn${activeTab === id ? " active" : ""}`}
              >
                <Icon size={15} />
                {label}
                <ChevronRight size={13} className="nav-chevron" />
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="s-card">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="s-card-header">
                  <span className="s-card-title">Profile Overview</span>
                </div>
                <div className="s-card-body">
                  <div className="s-profile-row">
                    <div className="s-avatar">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <div className="s-profile-email">
                        {user?.email || "admin@example.com"}
                      </div>
                      <span className="s-role-badge">
                        {user?.role || "Super Admin"}
                      </span>
                    </div>
                  </div>
                  <div className="s-field-group">
                    <div className="s-field">
                      <label className="s-field-label">Email Address</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="s-input"
                      />
                      <p className="s-field-hint">
                        Admin email cannot be changed from the portal.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <div className="s-card-header">
                  <span className="s-card-title">Change Password</span>
                </div>
                <div className="s-card-body">
                  <form onSubmit={handlePasswordChange}>
                    {passMessage && (
                      <div className="s-alert s-alert-success">
                        <div className="s-alert-dot" />
                        {passMessage}
                      </div>
                    )}
                    {passError && (
                      <div className="s-alert s-alert-error">
                        <div className="s-alert-dot" />
                        {passError}
                      </div>
                    )}
                    <div className="s-col-2">
                      <div className="s-field">
                        <label className="s-field-label">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          className="s-input"
                          placeholder="••••••••"
                          value={passwords.old_password}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              old_password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="s-field">
                        <label className="s-field-label">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          className="s-input"
                          placeholder="Min. 8 characters"
                          value={passwords.new_password}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              new_password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="s-field">
                        <label className="s-field-label">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          className="s-input"
                          placeholder="••••••••"
                          value={passwords.confirm_password}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      <button
                        type="submit"
                        disabled={passLoading}
                        className="s-btn s-btn-primary"
                      >
                        {passLoading ? (
                          <>
                            <Loader2 size={15} className="spin" /> Updating…
                          </>
                        ) : (
                          <>
                            <Save size={15} /> Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <>
                <div className="s-card-header">
                  <span className="s-card-title">Notification Preferences</span>
                </div>
                <div className="s-card-body">
                  <form onSubmit={handleNotificationSave}>
                    {[
                      {
                        key: "emailAlerts",
                        title: "Email Alerts",
                        sub: `Receive summary reports of system activity to ${user?.email || "your email"}.`,
                      },
                      {
                        key: "newCompanyRegistrations",
                        title: "New Company Registrations",
                        sub: "Get notified when employers await profile verification.",
                      },
                      {
                        key: "newStudentRegistrations",
                        title: "New Student Registrations",
                        sub: "Alerts when new students sign up on the platform.",
                      },
                      {
                        key: "systemUpdates",
                        title: "System Updates & Backups",
                        sub: "Alerts regarding database changes and scheduled backups.",
                      },
                    ].map(({ key, title, sub }) => (
                      <div className="s-notif-row" key={key}>
                        <div>
                          <div className="s-notif-title">{title}</div>
                          <div className="s-notif-sub">{sub}</div>
                        </div>
                        <label className="s-toggle">
                          <input
                            type="checkbox"
                            checked={notifications[key]}
                            onChange={() =>
                              setNotifications({
                                ...notifications,
                                [key]: !notifications[key],
                              })
                            }
                          />
                          <span className="s-toggle-track" />
                        </label>
                      </div>
                    ))}
                    <div className="s-save-row">
                      <button type="submit" className="s-btn s-btn-primary">
                        <Check size={15} /> Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
