import { Menu, Bell, Search, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const initial = user?.email?.charAt(0).toUpperCase() || "A";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Instrument+Serif:ital@1&display=swap');

        .hdr-root { font-family: 'DM Sans', sans-serif; }

        .hdr-search-wrap { position: relative; display: flex; align-items: center; }
        .hdr-search-input {
          font-family: 'DM Sans', sans-serif;
          height: 38px;
          padding: 0 40px 0 38px;
          width: 260px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 400;
          outline: none;
          transition: width 0.25s ease, background 0.2s, border-color 0.2s, box-shadow 0.2s;
          caret-color: #60a5fa;
        }
        .hdr-search-input::placeholder { color: rgba(100,116,139,0.7); }
        .hdr-search-input:focus {
          width: 320px;
          background: rgba(96,165,250,0.05);
          border-color: rgba(96,165,250,0.3);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.07);
        }
        .hdr-search-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          color: rgba(100,116,139,0.6);
          pointer-events: none;
          transition: color 0.2s;
        }
        .hdr-search-wrap:focus-within .hdr-search-icon { color: #60a5fa; }
        .hdr-kbd {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: rgba(100,116,139,0.5);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 5px;
          padding: 2px 6px;
          font-family: 'DM Sans', sans-serif;
          pointer-events: none;
        }

        .hdr-icon-btn {
          position: relative;
          width: 38px; height: 38px;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          color: rgba(148,163,184,0.8);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .hdr-icon-btn:hover {
          background: rgba(96,165,250,0.08);
          border-color: rgba(96,165,250,0.2);
          color: #93c5fd;
        }

        .hdr-theme-btn {
          width: 38px; height: 38px;
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .hdr-theme-btn:hover {
          background: rgba(245,158,11,0.07);
          border-color: rgba(245,158,11,0.2);
          transform: rotate(12deg);
        }

        .hdr-notif-dot {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #ef4444;
          border: 1.5px solid #080c1c;
          animation: hdr-pulse 2.5s ease infinite;
        }
        @keyframes hdr-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); }
        }

        .hdr-divider {
          width: 1px; height: 24px;
          background: rgba(255,255,255,0.07);
          margin: 0 2px;
        }

        .hdr-profile {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer;
          padding: 4px 10px 4px 4px;
          border-radius: 11px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          transition: background 0.2s, border-color 0.2s;
        }
        .hdr-profile:hover {
          background: rgba(96,165,250,0.07);
          border-color: rgba(96,165,250,0.18);
        }

        .hdr-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #fff;
          letter-spacing: -0.3px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }

        .hdr-email {
          font-size: 13px; font-weight: 500;
          color: #e2e8f0;
          white-space: nowrap;
          max-width: 140px;
          overflow: hidden; text-overflow: ellipsis;
        }
        .hdr-role {
          font-size: 11px;
          color: rgba(100,116,139,0.7);
          display: flex; align-items: center; gap: 4px;
          margin-top: 1px;
        }
        .hdr-online {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 5px rgba(34,197,94,0.7);
          flex-shrink: 0;
        }

        .hdr-menu-btn {
          width: 38px; height: 38px; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; color: rgba(148,163,184,0.8);
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .hdr-menu-btn:hover {
          background: rgba(96,165,250,0.08);
          border-color: rgba(96,165,250,0.2);
          color: #93c5fd;
        }

        /* Subtle top accent line */
        .hdr-accent {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.4) 30%, rgba(99,102,241,0.4) 60%, transparent 100%);
        }

        @media (max-width: 768px) {
          .hdr-search-input { width: 160px !important; }
          .hdr-search-input:focus { width: 190px !important; }
          .hdr-profile-meta { display: none; }
        }
        @media (max-width: 480px) {
          .hdr-search-wrap { display: none !important; }
        }
      `}</style>

      <header
        className="hdr-root"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          height: 64,
          background: "rgba(8,12,28,0.9)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 1px 32px rgba(0,0,0,0.35)",
        }}
      >
        <div className="hdr-accent" />

        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={toggleSidebar}
            className="hdr-menu-btn"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="hdr-search-wrap">
            <Search size={14} className="hdr-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="hdr-search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {!searchFocused && <span className="hdr-kbd">⌘K</span>}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className="hdr-theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={16} style={{ color: "#f59e0b" }} />
            ) : (
              <Moon size={16} style={{ color: "#818cf8" }} />
            )}
          </button>

          <button
            className="hdr-icon-btn"
            onClick={() => setNotifVisible(!notifVisible)}
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="hdr-notif-dot" />
          </button>

          <div className="hdr-divider" />

          <div className="hdr-profile">
            <div className="hdr-avatar">{initial}</div>
            <div className="hdr-profile-meta">
              <div className="hdr-email">{user?.email || "Admin User"}</div>
              <div className="hdr-role">
                <span className="hdr-online" />
                System Admin
              </div>
            </div>
            <ChevronDown
              size={13}
              style={{
                color: "rgba(100,116,139,0.6)",
                marginLeft: 2,
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
