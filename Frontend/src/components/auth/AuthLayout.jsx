import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Centered Card-Style Layout for Authentication
 */
function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full bg-white font-sans">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12 relative z-10 w-full">
        <div className="w-full max-w-md relative flex flex-col gap-8">
        {/* Simple Navigation */}
        <div className="flex justify-center">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>
        
        {/* Auth Card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(39,24,126,0.05)] overflow-hidden p-8 md:p-10 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="mb-6 hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="GetJobAndGo" className="h-10 w-auto" />
            </Link>
            <div className="text-center space-y-2">
               <Outlet context="header" />
            </div>
          </div>
          
          <Outlet />
        </div>

        {/* Simple Footer */}
        <div className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            © 2026 GetJobAndGo. All rights reserved.
        </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
