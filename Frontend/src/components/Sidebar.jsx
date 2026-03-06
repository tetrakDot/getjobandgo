import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  UserCircle,
  Users,
  Search,
  Building2,
  X,
  Sparkles,
} from "lucide-react";

function NavItem({ to, label, icon: Icon, end = false }) {
  const base =
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-300 group";
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? "bg-white text-primary-500 shadow-xl shadow-black/10 font-black"
            : "text-white/60 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            className={`${isActive ? "text-primary-500" : "text-white/40 group-hover:text-white"} transition-colors duration-300`}
          />
          <span className="tracking-wide">{label}</span>
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          )}
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthRoute = location.pathname.startsWith("/auth");
  if (isAuthRoute) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 lg:static lg:flex flex-col w-72 bg-primary-500 border-r border-black/5 z-[70] shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-20 flex items-center px-8 border-b border-white/10 relative bg-primary-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <h1 className="text-base font-serif font-black tracking-tight text-white leading-tight">
                GetJob<span className="text-white/70 italic">AndGo</span>
              </h1>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">
                Future of Hiring
              </p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 custom-scrollbar">
          <div
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
          >
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
              Discover
            </p>
            <div className="space-y-1.5">
              <NavItem
                to="/"
                label="Dashboard"
                icon={LayoutDashboard}
                end={true}
              />
              <NavItem
                to="/2ex"
                label="2eX Evaluation"
                icon={Sparkles}
              />
              <NavItem to="/jobs" label="Open Roles" icon={Briefcase} />
            </div>
          </div>

          {user?.role === "student" && (
            <div
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
                Personal Workspace
              </p>
              <div className="space-y-1.5">
                <NavItem
                  to="/student/dashboard"
                  label="Applications"
                  icon={FileText}
                />
                <NavItem
                  to="/student/profile"
                  label="Resume / profile"
                  icon={UserCircle}
                />
                <NavItem
                  to="/companies"
                  label="Partner Companies"
                  icon={Building2}
                />
              </div>
            </div>
          )}

          {user?.role === "company" && (
            <div
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
                Recruitment Center
              </p>
              <div className="space-y-1.5">
                <NavItem
                  to="/company/dashboard"
                  label="Hiring Hub"
                  icon={Building2}
                />
                <NavItem
                  to="/company/profile"
                  label="Org Profile"
                  icon={FileText}
                />
                <NavItem to="/students" label="Talent Pool" icon={Users} />
              </div>
            </div>
          )}

          {!user && (
            <div
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4 ml-1">
                Explore Pool
              </p>
              <div className="space-y-1.5">
                <NavItem to="/jobs" label="Explore Jobs" icon={Search} />
                <NavItem
                  to="/companies"
                  label="Visit Companies"
                  icon={Building2}
                />
                <NavItem to="/students" label="Meet Talent" icon={Users} />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-primary-600 backdrop-blur-sm relative">
          <div className="bg-primary-700/50 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-[11px] font-bold text-white/80">
                System Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
