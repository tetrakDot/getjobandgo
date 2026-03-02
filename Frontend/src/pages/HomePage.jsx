import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  User,
  CheckCircle2,
  ShieldCheck,
  Target,
  Users,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SEO from "../SEO";

function HomePage() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <SEO
        title="GetJobGo | Top Engineering & IT Jobs for Freshers"
        description="Find verified engineering and IT jobs, internships, and entry-level roles at GetJobGo. The premium portal where every application gets a tracked response."
        canonical="https://getjobgo.com/"
      />
      <div className="min-h-screen bg-[#F7F7FF] text-slate-900 font-sans selection:bg-primary-500/10 overflow-x-hidden">
        {/* Navigation Bar */}
        <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-[#27187E] flex items-center justify-center shadow-lg">
                <img
                  src="/logo.png"
                  alt="Get Job And Go Logo"
                  className="w-6 h-6 md:w-7 md:h-7 object-contain"
                />
              </div>
              <span className="text-lg md:text-xl font-serif font-black tracking-tight text-[#27187E]">
                GetJob<span className="text-primary-500 italic">AndGo</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
              <Link to="/" className="text-[#27187E]">Home</Link>
              <Link to="/jobs" className="text-slate-400 hover:text-[#27187E] transition-colors">Opportunities</Link>
              {user ? (
                <Link
                  to={user.role === "company" ? "/company/dashboard" : "/student/dashboard"}
                  className="px-6 py-3 rounded-2xl bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
                >Dashboard</Link>
              ) : (
                <div className="flex items-center gap-6 border-l border-slate-100 pl-6">
                  <Link to="/auth/login" className="text-slate-400 hover:text-[#27187E] transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" /> Talent
                  </Link>
                  <Link to="/auth/company/login" className="text-slate-400 hover:text-[#27187E] transition-colors flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Company
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-slate-600 hover:text-[#27187E] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-20 inset-x-0 bg-white border-b border-slate-100 shadow-2xl py-8 px-6 animate-in slide-in-from-top-4 duration-300 z-50">
              <div className="flex flex-col gap-6 text-sm font-black uppercase tracking-widest">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#27187E]">Home</Link>
                <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-slate-500 hover:text-[#27187E]">Opportunities</Link>
                <div className="h-px bg-slate-50 my-2" />
                {user ? (
                   <Link
                   to={user.role === "company" ? "/company/dashboard" : "/student/dashboard"}
                   onClick={() => setIsMenuOpen(false)}
                   className="w-full text-center px-6 py-4 rounded-2xl bg-[#27187E] text-white font-black hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                 >Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-slate-500 py-2">
                      <span>Join as Talent</span>
                      <User className="w-5 h-5" />
                    </Link>
                    <Link to="/auth/company/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between text-slate-500 py-2">
                      <span>Organization Access</span>
                      <Building2 className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-4 rounded-2xl bg-[#27187E] text-white font-black hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 active:scale-95 mt-4"
                    >Get Started Free</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

        <main className="relative">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-br from-primary-500/10 via-indigo-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Hero Section */}
          <section className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 pt-16 md:pt-32 pb-20 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-100 text-primary-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Platform in Active Beta
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-black leading-[1.1] mb-8 md:mb-10 tracking-tight text-slate-900 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Where high potential <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27187E] to-primary-600 italic">
                meets enterprise scale.
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-500 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              The premium network dedicated to connecting top-tier students and verified companies. 
              Eliminating friction in the hiring funnel through rigorous human-grade verification.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {!user ? (
                <>
                  <Link
                    to="/auth/register"
                    className="group w-full sm:w-auto px-8 md:px-10 py-5 rounded-3xl bg-[#27187E] text-white font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" /> Join as Talent
                  </Link>
                  <Link
                    to="/auth/company/register"
                    className="group w-full sm:w-auto px-8 md:px-10 py-5 rounded-3xl bg-white text-slate-900 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 border border-slate-200 transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform text-primary-500" /> Organization Access
                  </Link>
                </>
              ) : (
                <Link
                  to="/jobs"
                  className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-[#27187E] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3"
                >
                  <Briefcase size={18} /> Explore Opportunities
                </Link>
              )}
            </div>
          </section>

          {/* Stats / Proof Section */}
          <section className="bg-white border-y border-slate-100 py-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                <div className="space-y-2">
                    <p className="text-4xl font-serif font-black text-[#27187E]">50+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Partner MNCs</p>
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-serif font-black text-[#27187E]">2K+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Talent</p>
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-serif font-black text-[#27187E]">₹12L</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Avg. CTC</p>
                </div>
                <div className="space-y-2">
                    <p className="text-4xl font-serif font-black text-[#27187E]">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trust Score</p>
                </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-32 bg-slate-50/50">
            <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
              <div className="text-center mb-24">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 mb-4">Core Philosophy</p>
                <h2 className="text-5xl font-serif font-black text-slate-900 tracking-tight">
                    Beyond Simple Job Listings.
                </h2>
                <div className="mt-8 h-1.5 w-24 bg-[#27187E] mx-auto rounded-full" />
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center mb-8 border border-primary-100 group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle2 className="w-8 h-8 text-[#27187E]" />
                  </div>
                  <h4 className="text-xl font-serif font-black text-slate-900 mb-4">
                    Strict Verification
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Every organization and candidate undergoes a rigorous identity and document 
                    verification process to ensure 100% platform integrity.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center mb-8 border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                    <Users className="w-8 h-8 text-[#27187E]" />
                  </div>
                  <h4 className="text-xl font-serif font-black text-slate-900 mb-4">
                    Talent Matchmaking
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Our semantic matching engine connects students' knowledge stacks directly 
                    with corporate technical requirements.
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-50 flex items-center justify-center mb-8 border border-primary-100 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck className="w-8 h-8 text-[#27187E]" />
                  </div>
                  <h4 className="text-xl font-serif font-black text-slate-900 mb-4">
                    Secure Ecosystem
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Privacy-first approach ensures that sensitive documents like resumes 
                    are shared only with verified corporate accounts.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tamil Support Section */}
          <section className="py-24 bg-[#27187E] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                <div className="absolute -top-10 -right-20 w-80 h-80 rounded-full border-[60px] border-white" />
            </div>
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h3 className="text-2xl md:text-3xl font-serif font-black mb-8 leading-relaxed">
                    Freshers & Interns க்கான நம்பகமான வேலை வாய்ப்பு தளம். 
                    Verified செய்யப்பட்ட நிறுவனங்கள் மட்டும் இணையும் பாதுகாப்பான தளம்.
                </h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-10 bg-white/30" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Your Next Chapter Begins Here</p>
                    <div className="h-px w-10 bg-white/30" />
                </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-3 grayscale opacity-70">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-serif font-black text-slate-900 tracking-tight">GetJob<span className="text-primary-500 italic">Go</span></span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 GetJobGo. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#27187E] transition-colors">Twitter</a>
                    <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#27187E] transition-colors">LinkedIn</a>
                    <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#27187E] transition-colors">Instagram</a>
                </div>
            </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
