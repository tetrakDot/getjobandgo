import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Centered Card-Style Layout for Authentication
 */
function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname.includes('register');
  const isCompanyRegister = location.pathname.includes('company/register');
  
  return (
    <div className="relative min-h-screen w-full bg-white font-sans overflow-x-hidden">
      {/* Background Snippet */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8 md:py-12 z-10 transition-all duration-500">
        <div className={`w-full ${isCompanyRegister ? 'max-w-5xl' : isRegister ? 'max-w-2xl' : 'max-w-md'} flex flex-col gap-8`}>
          {/* Simple Navigation */}
          <div className="flex justify-center md:justify-start">
            <Link 
              to="/" 
              className="group inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#27187E] transition-all bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Home
            </Link>
          </div>
          
          {/* Auth Card */}
          <div className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_rgba(39,24,126,0.08)] overflow-hidden animate-in fade-in zoom-in-95 duration-700 ${isCompanyRegister ? 'p-0' : 'p-8 md:p-12'}`}>
            {!isCompanyRegister && (
              <div className="flex flex-col items-center mb-10">
                <Link to="/" className="hover:scale-105 transition-transform duration-300">
                  <img src="/logo.png" alt="GetJobAndGo" className="h-10 w-auto" />
                </Link>
              </div>
            )}
            
            <Outlet />
          </div>

          {/* Simple Footer */}
          <div className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
              © 2026 GetJobAndGo. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
