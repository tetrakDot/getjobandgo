import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (location.pathname.startsWith('/auth')) return null;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center w-full">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Portal</span>
          <span className="hidden sm:inline">•</span>
          <span className="capitalize">
            {user?.role === 'student'
              ? 'Student workspace'
              : user?.role === 'company'
                ? 'Company workspace'
                : 'Guest'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/auth/login"
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Student login
              </Link>
              <Link
                to="/auth/company/login"
                className="text-xs px-3 py-1.5 rounded-xl bg-primary-600 text-slate-50 hover:bg-primary-500 transition-colors"
              >
                Company login
              </Link>
            </>
          )}
          {user && (
            <>
              <div className="flex flex-col items-end text-xs">
                <span className="font-medium text-slate-100 truncate max-w-[160px]">
                  {user.email}
                </span>
                <span className="text-[11px] text-slate-400 uppercase tracking-[0.18em]">
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;

