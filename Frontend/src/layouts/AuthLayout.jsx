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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7FF] px-4 py-12 relative font-sans overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full md:w-1/3 h-1/2 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />

      {/* Main Content Container */}
      <div className="w-full max-w-5xl relative z-10 flex flex-col gap-6 md:gap-8">
        {/* Navigation */}
        <div className="flex justify-start">
          <Link 
            to="/" 
            className="group inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-all bg-white/90 hover:bg-white px-5 py-2.5 rounded-xl border border-slate-100 shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
        </div>
        
        {/* Auth Card */}
        <div className="grid md:grid-cols-2 gap-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_40px_80px_rgba(39,24,126,0.05)] overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
          <div className="hidden md:flex flex-col justify-between p-10 lg:p-14 bg-[#27187E] text-white relative overflow-hidden">
            {/* Abstract pattern overlay */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[40px] border-white" />
               <div className="absolute bottom-40 -left-20 w-64 h-64 rounded-full border-[20px] border-white" />
            </div>

            <div className="relative z-10">
              <Link to="/" className="inline-block mb-10 group transition-transform hover:scale-105 active:scale-95 duration-500">
                 <img src="/logo.png" alt="GetJobGo" className="h-10 lg:h-12 w-auto drop-shadow-2xl" />
              </Link>
              <h1 className="text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight">
                Scale your <br/>future today.
              </h1>
              <p className="mt-6 text-sm lg:text-base text-white/70 font-medium max-w-[280px] leading-relaxed italic">
                "Connecting ambitious talent with enterprises that value innovation and execution."
              </p>
            </div>
            
            <div className="space-y-5 lg:space-y-6 relative z-10">
              <p className="font-black uppercase tracking-[0.3em] text-[9px] text-white/40">
                Platform Pillars
              </p>
              <ul className="space-y-4 lg:space-y-5">
                <li className="flex items-start gap-4 group">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform" />
                  <span className="text-xs font-bold text-white/80 leading-snug">Verified corporate onboarding with zero-trust security.</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform" />
                  <span className="text-xs font-bold text-white/80 leading-snug">Live application funnel tracking from submission to contract.</span>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-150 transition-transform" />
                  <span className="text-xs font-bold text-white/80 leading-snug">Data-driven dashboards for precision career management.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-8 sm:p-12 md:p-12 lg:p-16 bg-white flex flex-col justify-center min-h-[500px]">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center md:text-left text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 px-4">
            © 2026 GetJobGo. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
