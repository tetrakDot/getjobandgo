import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, ShieldCheck, Globe, Menu, HelpCircle } from 'lucide-react';

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (location.pathname.startsWith('/auth')) return null;

  return (
    <header className="h-20 border-b border-black/[0.03] bg-white/70 backdrop-blur-xl sticky top-0 z-40 flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-white hover:text-primary-500 transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>

            {/* Mobile Branding - visible only on small screens */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
               <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
                  <img src="/logo.png" alt="L" className="h-5 w-5 brightness-0 invert" />
               </div>
               <span className="font-serif font-black text-slate-900 text-sm tracking-tight">GetJob<span className="text-primary-500 italic">AndGo</span></span>
            </Link>

            <div className={`hidden sm:flex px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest items-center gap-2 ${
                user ? 'bg-primary-50 border-primary-100 text-primary-600' : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}>
              {user ? <ShieldCheck size={12} /> : <Globe size={12} />}
              {user?.role === 'student' ? 'Student Workspace' : user?.role === 'company' ? 'Company Portal' : 'Guest Access'}
            </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link
            to="/help"
            className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all group relative"
            title="Need Help?"
          >
            <HelpCircle size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </Link>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors px-2"
              >
                Sign In
              </Link>
              <Link
                to="/auth/company/login"
                className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl bg-primary-500 text-white hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/20 transition-all active:scale-95"
              >
                Post Jobs
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none mb-1">
                    {user.email.split('@')[0]}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black">
                    {user.role} Account
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                    <User size={18} className="text-primary-600" />
                </div>
              </div>
              <button
                onClick={logout}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-colors"
              >
                <span className="hidden md:inline">Exit</span>
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
