import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NavItem({ to, label, end = false }) {
  const base =
    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors';
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? 'bg-primary-600 text-slate-50 shadow shadow-primary-600/40'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-50'
        }`
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      {label}
    </NavLink>
  );
}

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isAuthRoute = location.pathname.startsWith('/auth');
  if (isAuthRoute) return null;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80">
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Get Job And Go Logo" className="h-10 w-10 object-contain drop-shadow-md" />
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-50">
              Get Job And Go
            </p>
            <p className="text-xs text-slate-400">Student & Company Portal</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
            Browse
          </p>
          <div className="space-y-1">
            <NavItem to="/" label="Home" end={true} />
            <NavItem to="/jobs" label="Jobs" />
          </div>
        </div>
        {user?.role === 'student' && (
          <div>
            <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Student
            </p>
            <div className="space-y-1">
              <NavItem to="/student/dashboard" label="Dashboard" />
              <NavItem to="/student/applications" label="Applications" />
              <NavItem to="/student/profile" label="My Profile" />
              <NavItem to="/companies" label="Browse Companies" />
            </div>
          </div>
        )}
        {user?.role === 'company' && (
          <div>
            <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
              Company
            </p>
            <div className="space-y-1">
              <NavItem to="/company/dashboard" label="Dashboard" />
              <NavItem to="/company/profile" label="Company Profile" />
              <NavItem to="/students" label="Browse Talent" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

