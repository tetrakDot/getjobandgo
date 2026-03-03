import { Link } from "react-router-dom";
import { MoveRight, Home, Ghost, Search } from "lucide-react";
import SEO from "../SEO";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7F7FF] flex items-center justify-center px-6 overflow-hidden relative">
      <SEO
        title="404 - Page Not Found | GetJobAndGo"
        description="Oops! The page you're looking for has vanished into thin air."
        canonical="https://getjobandgo.com/404"
      />
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#27187E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Animated Number */}
        <div className="relative mb-8 inline-block select-none">
          <h1 className="text-[12rem] md:text-[20rem] font-black text-[#27187E]/5 leading-none animate-pulse italic">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-[3rem] shadow-2xl shadow-[#27187E]/10 flex flex-col items-center justify-center border border-slate-100 animate-in zoom-in duration-1000">
                <Ghost size={64} className="text-[#27187E] animate-bounce mb-4" />
                <div className="w-12 h-1.5 bg-[#27187E]/10 rounded-full animate-pulse blur-[1px]" />
             </div>
          </div>
        </div>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-[#27187E] tracking-tight">
            Discovery Failed
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
            The coordinates you provided lead to a void. This page has either been archived or never existed in our index.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10">
            <Link 
              to="/" 
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#27187E] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#27187E]/30 hover:shadow-2xl hover:shadow-[#27187E]/40 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              <Home size={18} className="transition-transform group-hover:scale-110" />
              Return Home
            </Link>
            
            <Link 
              to="/jobs" 
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#27187E] border-2 border-[#27187E]/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              Search Jobs
              <MoveRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-8 animate-in fade-in duration-1000 delay-700">
            <Link to="/companies" className="text-[10px] font-black text-slate-400 hover:text-[#27187E] transition-colors uppercase tracking-[0.2em]">Explore Companies</Link>
            <Link to="/students" className="text-[10px] font-black text-slate-400 hover:text-[#27187E] transition-colors uppercase tracking-[0.2em]">Talent Network</Link>
            <Link to="/auth/login" className="text-[10px] font-black text-slate-400 hover:text-[#27187E] transition-colors uppercase tracking-[0.2em]">Partner Sign In</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
