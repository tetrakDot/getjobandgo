import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'company' ? '/company/dashboard' : '/student/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 relative">
      <div className="absolute top-6 left-6 md:top-10 md:left-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-2xl shadow-slate-900/60 overflow-hidden z-10">
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-primary-700 via-logoGreen/20 to-slate-950">
          <div>
            <img src="/logo.png" alt="Get Job And Go" className="h-16 w-auto drop-shadow-lg mb-4" />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
              Get Job And Go
            </h1>
            <p className="mt-3 text-sm text-slate-200/80 max-w-sm">
              A modern platform connecting talented students with verified companies looking for
              their next hires.
            </p>
          </div>
          <div className="space-y-4 text-sm text-slate-100/80">
            <p className="font-medium uppercase tracking-[0.2em] text-xs text-slate-200/80">
              Highlights
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Verified company onboarding and compliance-ready document checks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Track every application stage from applied to hired in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                <span>Analytics-grade dashboards for students, companies, and admins.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="p-8 md:p-10 bg-slate-900/60 backdrop-blur">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

