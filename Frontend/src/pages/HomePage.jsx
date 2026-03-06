import React, { useEffect, useState } from "react";
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
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/apiClient";
import SEO from "../SEO";

function HomePage() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    students_display: "...",
    companies_display: "...",
  });

  useEffect(() => {
    apiClient
      .get("/platform-stats/")
      .then((res) => setPlatformStats(res.data))
      .catch(() =>
        setPlatformStats({ students_display: "0", companies_display: "0" }),
      );
  }, []);

  return (
    <>
      <SEO
        title="GetJobAndGo | Trusted Hiring Ecosystem for Verified Organizations & Talent"
        description="Every organization and candidate is verified. Access high-potential freshers, interns, and trusted tech roles on GetJobAndGo."
        canonical="https://getjobandgo.com/"
      />

      {/* Premium Minimal Light Background */}
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-500/10 selection:text-primary-700">
        {/* Navigation Bar */}
        <nav className="border-b border-slate-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 h-[88px] flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="Get Job And Go Logo"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg"
                />
              </div>
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#27187E]">
                GetJob
                <span className="text-primary-500 italic relative">
                  AndGo
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary-100 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
                <Link to="/" className="text-[#27187E]">
                  Home
                </Link>
                <Link
                  to="/2ex"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  2eX AI
                </Link>
                <Link
                  to="/jobs"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Opportunities
                </Link>
              </div>

              {/* Action Buttons */}
              {user ? (
                <Link
                  to={
                    user.role === "company"
                      ? "/company/dashboard"
                      : "/student/dashboard"
                  }
                  className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 active:scale-95 text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <div className="flex items-center gap-4 pl-10 border-l border-slate-100 h-10">
                  <Link
                    to="/auth/login"
                    className="px-6 py-3.5 rounded-full text-slate-500 hover:text-[#27187E] hover:bg-slate-50 transition-all font-black text-[11px] uppercase tracking-widest flex items-center gap-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 hover:shadow-[#27187E]/40 active:scale-95 text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    Start Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 rounded-2xl bg-slate-50 text-[#27187E] hover:bg-primary-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-[88px] inset-x-0 h-[calc(100vh-88px)] bg-white/95 backdrop-blur-2xl border-t border-slate-100 flex flex-col pt-8 animate-in slide-in-from-top-4 duration-300 z-50 px-6 pb-12 overflow-y-auto">
              <div className="flex flex-col gap-8 text-sm font-black uppercase tracking-widest pb-10 border-b border-slate-100">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#27187E] flex items-center justify-between"
                >
                  Home <ChevronRight size={16} className="opacity-50" />
                </Link>
                <Link
                  to="/2ex"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  2eX Engine <ChevronRight size={16} className="opacity-50" />
                </Link>
                <Link
                  to="/jobs"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  Opportunities{" "}
                  <ChevronRight size={16} className="opacity-50" />
                </Link>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                {user ? (
                  <Link
                    to={
                      user.role === "company"
                        ? "/company/dashboard"
                        : "/student/dashboard"
                    }
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-6 py-5 rounded-2xl bg-[#27187E] text-white text-[12px] font-black uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-5 rounded-2xl bg-slate-50 text-[#27187E] text-[12px] font-black uppercase tracking-[0.2em] border border-slate-100 active:scale-95 flex items-center justify-center gap-3 transition-colors hover:bg-slate-100"
                    >
                      <User size={16} /> Student Login
                    </Link>
                    <Link
                      to="/auth/company/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-5 rounded-2xl bg-primary-50 text-primary-700 text-[12px] font-black uppercase tracking-[0.2em] border border-primary-100 active:scale-95 flex items-center justify-center gap-3 transition-colors hover:bg-primary-100 mt-2"
                    >
                      <Building2 size={16} /> Company Login
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-5 rounded-2xl bg-[#27187E] text-white text-[12px] font-black uppercase tracking-[0.2em] active:scale-95 flex items-center justify-center gap-3 mt-6 shadow-xl shadow-[#27187E]/20"
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

        <main className="relative overflow-hidden">
          {/* Animated Ambient Background (Very Subtle) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FAFAFC]">
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary-400/5 rounded-full mix-blend-multiply filter blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-[#27187E] opacity-[0.03] rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_15s_ease-in-out_infinite_reverse]" />
          </div>

          {/* Modern Minimalistic Inspirational Tamil Quote Section */}
          <section className="bg-white/40 backdrop-blur-md border-b border-slate-100 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1/4 h-full bg-gradient-to-r from-[#27187E]/5 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16 animate-in fade-in slide-in-from-top-8 duration-700">
              <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
                <div className="w-12 h-12 mx-auto bg-[#27187E]/5 rounded-2xl flex items-center justify-center text-[#27187E] mb-2 md:mb-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 11L8.5 14H11V18H5V14L7.5 9H10V11ZM20 11L18.5 14H21V18H15V14L17.5 9H20V11Z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-4xl font-serif font-black text-[#27187E] leading-loose italic tracking-tight">
                  "தெய்வத்தான் ஆகாதெனினும் முயற்சிதன்
                  <br />
                  மெய்வருத்தக் கூலி தரும்."
                </h2>
                <div className="flex items-center justify-center gap-6">
                  <div className="h-px bg-slate-200 w-12 hidden sm:block"></div>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-[0.2em] max-w-xl mx-auto leading-relaxed px-4">
                    Even if something seems impossible,{" "}
                    <br className="sm:hidden" /> consistent effort will always
                    produce results.
                  </p>
                  <div className="h-px bg-slate-200 w-12 hidden sm:block"></div>
                </div>
              </div>
            </div>
          </section>

          {/* High-End Hero Section */}
          <section className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-20 pb-32 md:pt-28 md:pb-40 text-center">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="w-2 h-2 rounded-full bg-[#27187E] animate-pulse"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#27187E]">
                Secure verified ecosystem
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-serif font-black leading-[1.05] tracking-tight text-slate-900 mb-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Where high potential <br className="hidden sm:block" />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#27187E] to-primary-500 italic pr-2">
                meets enterprise scale.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              GetJobAndGo is the trusted hiring network. Connecting{" "}
              <strong className="text-slate-900">verified companies</strong>{" "}
              with top-tier students for internships and entry-level jobs safely
              and intelligently.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              {!user ? (
                <>
                  <Link
                    to="/auth/register"
                    className="group w-full sm:w-auto px-10 py-5 sm:py-6 rounded-full bg-[#27187E] text-white font-black text-[12px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 flex items-center justify-center gap-3 hover:-translate-y-1"
                  >
                    Join as Talent{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/auth/company/register"
                    className="group w-full sm:w-auto px-10 py-5 sm:py-6 rounded-full bg-white text-slate-800 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-50 border border-slate-200 transition-all shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex items-center justify-center gap-3 hover:-translate-y-1"
                  >
                    Organization Access{" "}
                    <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-[#27187E] transition-colors" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/jobs"
                  className="group w-full sm:w-auto px-12 py-6 rounded-full bg-[#27187E] text-white font-black text-[12px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 flex items-center justify-center gap-3 hover:-translate-y-1"
                >
                  <Sparkles size={18} className="text-primary-200" /> Explore
                  Opportunities
                </Link>
              )}
            </div>
          </section>

          {/* Refined Platform Metrics */}
          <section className="py-24 bg-[#FAFAFC]">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card 1 */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2">
                  <p className="text-4xl md:text-6xl font-serif font-black text-[#27187E] mb-4">
                    {platformStats.companies_display}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Partner Companies
                  </p>
                </div>
                {/* Card 2 */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2">
                  <p className="text-4xl md:text-6xl font-serif font-black text-[#27187E] mb-4">
                    {platformStats.students_display}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Verified Talent
                  </p>
                </div>
                {/* Card 3 */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden">
                  <p className="text-4xl md:text-6xl font-serif font-black text-[#27187E]/30 mb-4 blur-[2px] pointer-events-none select-none">
                    12L
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Average CTC
                  </p>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 shadow-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>
                {/* Card 4 */}
                <div className="bg-[#27187E] rounded-[2rem] p-8 md:p-10 border border-primary-600 shadow-[0_20px_40px_rgba(39,24,126,0.15)] flex flex-col items-center justify-center text-center transition-transform duration-300 hover:-translate-y-2">
                  <p className="text-4xl md:text-6xl font-serif font-black text-white mb-4">
                    100%
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-primary-200 w-full">
                    Trust Score
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Philosophy Detail Cards */}
          <section className="py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
              <div className="mb-20">
                <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#27187E] mb-6 flex items-center gap-3">
                  <span className="w-8 h-0.5 bg-[#27187E]"></span> Platform
                  Ecosystem
                </p>
                <h2 className="text-4xl md:text-6xl font-serif font-black text-slate-900 tracking-tight max-w-3xl leading-[1.1]">
                  Built exclusively for <br /> verification and trust.
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-[#FAFAFC] rounded-[2.5rem] p-12 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgb(0,0,0,0.05)] hover:-translate-y-2 group">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center mb-10 border border-indigo-100 group-hover:scale-110 group-hover:bg-[#27187E] transition-all duration-500">
                    <ShieldCheck
                      className="w-10 h-10 text-[#27187E] group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h4 className="text-2xl font-serif font-black text-slate-900 mb-5 tracking-tight group-hover:text-[#27187E] transition-colors">
                    Strict Verification
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Every company and candidate is human-verified to ensure
                    complete platform trust. Fake profiles and fraudulent
                    organizations are blocked at the gate.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#FAFAFC] rounded-[2.5rem] p-12 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgb(0,0,0,0.05)] hover:-translate-y-2 group">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-primary-50 flex items-center justify-center mb-10 border border-primary-100 group-hover:scale-110 group-hover:bg-primary-500 transition-all duration-500">
                    <Target
                      className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h4 className="text-2xl font-serif font-black text-slate-900 mb-5 tracking-tight group-hover:text-[#27187E] transition-colors">
                    Talent Matchmaking
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Students’ core skills are semantically matched with company
                    technical requirements, bridging the gap between academic
                    intent and enterprise needs.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#FAFAFC] rounded-[2.5rem] p-12 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_rgb(0,0,0,0.05)] hover:-translate-y-2 group">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center mb-10 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500">
                    <CheckCircle2
                      className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors duration-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h4 className="text-2xl font-serif font-black text-slate-900 mb-5 tracking-tight group-hover:text-[#27187E] transition-colors">
                    Secure Ecosystem
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    Your privacy matters. Resumes, contact data, and personal
                    details are strictly guarded and shared only with fully
                    verified hiring organizations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* High-Impact Tamil Message Strip */}
          <section className="bg-[#27187E] relative py-20 overflow-hidden">
            {/* Abstract BG Shapes */}
            <div className="absolute left-0 top-0 w-full h-full opacity-[0.05]">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[100px]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
              <ShieldCheck className="w-12 h-12 text-white/20 mx-auto mb-8" />
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white leading-[1.6] tracking-wide mb-2 max-w-4xl mx-auto">
                "Freshers & Interns க்கான நம்பகமான வேலை வாய்ப்பு தளம். Verified
                செய்யப்பட்ட நிறுவனங்கள் மட்டும் இணையும் பாதுகாப்பான தளம்."
              </h3>
            </div>
          </section>

          {/* Final CTA Launchpad Section */}
          <section className="py-32 md:py-48 bg-white relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-7xl font-serif font-black text-slate-900 mb-8 tracking-tight">
                Your Next Chapter{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27187E] to-primary-500 italic">
                  Begins Here
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 mb-16 max-w-2xl mx-auto font-medium">
                Whether you're looking to hire top talent or start your dream
                career, get started today in under 5 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!user && (
                  <>
                    <Link
                      to="/auth/register"
                      className="w-full sm:w-auto px-12 py-6 rounded-full bg-[#27187E] text-white font-black text-[12px] uppercase tracking-[0.2em] hover:bg-primary-600 hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#27187E]/30"
                    >
                      Join as Talent
                    </Link>
                    <Link
                      to="/auth/company/register"
                      className="w-full sm:w-auto px-12 py-6 rounded-full bg-slate-50 text-[#27187E] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-slate-100 hover:scale-105 transition-all duration-300 border border-slate-200"
                    >
                      Register Organization
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Minimal Modern Footer */}
        <footer className="bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-16">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Brand Logo & Copyright */}
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Get Job And Go Logo"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="text-base font-serif font-black text-slate-900">
                    GetJob<span className="text-slate-400 italic">AndGo</span>
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  © 2026 GetJobAndGo Platform. All rights reserved.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-start md:justify-end gap-8">
                <a
                  href="#"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Twitter{" "}
                  <ArrowRight
                    size={12}
                    className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  LinkedIn{" "}
                  <ArrowRight
                    size={12}
                    className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <a
                  href="#"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Instagram{" "}
                  <ArrowRight
                    size={12}
                    className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
