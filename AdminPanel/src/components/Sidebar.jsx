import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  FileText,
  Settings,
  X,
  LogOut,
  Zap,
  ShieldAlert,
  LifeBuoy,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={16} />,
      accent: "#6366f1",
    },
    {
      name: "Students",
      path: "/students",
      icon: <Users size={16} />,
      accent: "#3b82f6",
    },
    {
      name: "Companies",
      path: "/companies",
      icon: <Building2 size={16} />,
      accent: "#8b5cf6",
    },
    {
      name: "Jobs",
      path: "/jobs",
      icon: <Briefcase size={16} />,
      accent: "#f59e0b",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: <FileText size={16} />,
      accent: "#ec4899",
    },
    {
      name: "2eX Evaluator",
      path: "/evaluator",
      icon: <Zap size={16} />,
      accent: "#c7d2fe",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={16} />,
      accent: "#10b981",
    },
    {
      name: "Activity Logs",
      path: "/activities",
      icon: <ShieldAlert size={16} />,
      accent: "#f43f5e",
    },
    {
      name: "Help Requests",
      path: "/help",
      icon: <LifeBuoy size={16} />,
      accent: "#0ea5e9",
    },
    {
      name: "Career Wall",
      path: "/career-wall",
      icon: <MessageSquare size={16} />,
      accent: "#a855f7",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Instrument+Serif:ital@0&display=swap');

        .sb-root * { box-sizing: border-box; }
        .sb-root { font-family: 'DM Sans', sans-serif; }

        .sb-nav-link {
          position: relative;
          display: flex; align-items: center; gap: 11px;
          padding: 9px 13px;
          border-radius: 9px;
          font-size: 13.5px; font-weight: 500;
          color: rgba(100,116,139,0.85);
          text-decoration: none;
          border: 1px solid transparent;
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.15s;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
        }
        .sb-nav-link:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.06);
          color: #cbd5e1;
          transform: translateX(2px);
        }
        .sb-nav-link.active {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.18);
          color: #a5b4fc;
          font-weight: 600;
        }

        .sb-indicator {
          position: absolute; left: 0; top: 18%; bottom: 18%;
          width: 2.5px; border-radius: 0 3px 3px 0;
          background: linear-gradient(180deg, #6366f1, #818cf8);
          opacity: 0; transition: opacity 0.18s;
          box-shadow: 0 0 8px rgba(99,102,241,0.7);
        }
        .sb-nav-link.active .sb-indicator { opacity: 1; }

        .sb-icon {
          flex-shrink: 0;
          transition: color 0.18s, filter 0.18s;
        }
        .sb-nav-link.active .sb-icon {
          filter: drop-shadow(0 0 5px currentColor);
        }

        .sb-active-pill {
          margin-left: auto;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.06em;
          background: rgba(99,102,241,0.18);
          color: #818cf8;
          border-radius: 5px;
          padding: 2px 6px;
        }

        .sb-section-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(51,65,85,0.9);
          padding: 0 13px; margin-bottom: 4px; margin-top: 6px;
        }

        .sb-logout {
          display: flex; align-items: center; gap: 11px;
          width: 100%; padding: 9px 13px;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          color: rgba(100,116,139,0.7);
          transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.15s;
          text-align: left;
        }
        .sb-logout:hover {
          background: rgba(239,68,68,0.07);
          border-color: rgba(239,68,68,0.15);
          color: #fca5a5;
          transform: translateX(2px);
        }

        .sb-close {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; color: rgba(100,116,139,0.7);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .sb-close:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.2);
          color: #fca5a5;
        }

        .sb-scroll::-webkit-scrollbar { width: 3px; }
        .sb-scroll::-webkit-scrollbar-track { background: transparent; }
        .sb-scroll::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 99px; }

        .sb-overlay { animation: sb-fade 0.2s ease; }
        @keyframes sb-fade { from { opacity: 0; } to { opacity: 1; } }

        .sb-aside { transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }

        .sb-status {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 12px;
          border-radius: 9px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }
        .sb-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 5px rgba(34,197,94,0.7);
          flex-shrink: 0;
        }
        .sb-status-text {
          font-size: 11px; color: rgba(51,65,85,0.9);
          font-weight: 400;
        }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sb-overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      <aside
        className="sb-root sb-aside"
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 50,
          width: 252,
          display: "flex",
          flexDirection: "column",
          background: "#080c1c",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "2px 0 40px rgba(0,0,0,0.5)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Ambient top glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 160,
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            padding: "0 18px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <img src="/logo.png" alt="Get Job & Go" style={{ height: 38, width: 38, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            <div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  letterSpacing: "-0.3px",
                  lineHeight: 1,
                }}
              >
                Get Job & Go
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "rgba(51,65,85,0.9)",
                  marginTop: 2,
                  letterSpacing: "0.08em",
                }}
              >
                ADMIN PORTAL
              </div>
            </div>
          </div>
          <button className="sb-close" onClick={() => setIsOpen(false)}>
            <X size={14} />
          </button>
        </div>

        {/* Nav */}
        <div
          className="sb-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <div className="sb-section-label">Navigation</div>

          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sb-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                color: isActive ? item.accent : undefined,
              })}
            >
              {({ isActive }) => (
                <>
                  <div className="sb-indicator" />
                  <span
                    className="sb-icon"
                    style={{
                      color: isActive ? item.accent : "rgba(100,116,139,0.7)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && <span className="sb-active-pill">ACTIVE</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            flexShrink: 0,
          }}
        >
          <div className="sb-status">
            <div className="sb-status-dot" />
            <span className="sb-status-text">All systems operational</span>
          </div>
          <button className="sb-logout" onClick={logout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
