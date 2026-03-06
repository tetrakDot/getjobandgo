import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  User,
  ShieldCheck,
  Target,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Compass,
  Rocket,
  Lightbulb
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import SEO from "../SEO";

function AboutPage() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <SEO
        title="About Us | GetJobAndGo"
        description="GetJobAndGo is a trusted career platform designed to connect high-potential students with verified companies for internships and early career opportunities."
        canonical="https://getjobandgo.com/about"
      />

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
                  draggable="false"
                  className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg select-none"
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
                <Link
                  to="/"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Home
                </Link>
                <Link to="/about" className="text-[#27187E]">
                  About
                </Link>
                <Link
                  to="/career-wall"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Career Wall
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
                <Link
                  to="/help"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  Need Help?
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
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  Home <ChevronRight size={16} className="opacity-50" />
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#27187E] flex items-center justify-between"
                >
                  About <ChevronRight size={16} className="opacity-50" />
                </Link>
                <Link
                  to="/career-wall"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  Career Wall <ChevronRight size={16} className="opacity-50" />
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
                <Link
                  to="/help"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  Need Help? <ChevronRight size={16} className="opacity-50" />
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
          {/* Animated Ambient Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-[#FAFAFC]">
            <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-primary-400/5 rounded-full mix-blend-multiply filter blur-[100px] animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-[#27187E] opacity-[0.03] rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_15s_ease-in-out_infinite_reverse]" />
          </div>

          {/* Intro Hero */}
          <section className="relative max-w-5xl mx-auto px-6 md:px-10 lg:px-12 pt-20 pb-24 md:pt-32 md:pb-32 text-center">
            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <span className="w-2 h-2 rounded-full bg-[#27187E]"></span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#27187E]">
                About GetJobAndGo
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[80px] font-serif font-black leading-[1.05] tracking-tight text-slate-900 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Making hiring <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27187E] to-primary-500 italic">
                faster, transparent & trustworthy
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              GetJobAndGo is a trusted career platform designed to connect high-potential students with verified companies for internships and early career opportunities.
            </p>
          </section>

          {/* Why We Created */}
          <section className="py-24 bg-white border-y border-slate-100 relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-6 tracking-tight leading-tight">
                  Why we built <br /> GetJobAndGo
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-6 font-medium">
                  Many students today use platforms like LinkedIn and Naukri.com. While these platforms provide opportunities, they often include:
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Too many unrelated job notifications.",
                    "Automated or bot-driven messages.",
                    "Unverified job postings.",
                    "Overwhelming job listings that waste students' time.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                        <X size={14} className="text-rose-500" strokeWidth={3} />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-8 bg-[#FAFAFC] border border-slate-100 rounded-3xl">
                  <p className="text-[#27187E] font-black text-xl italic leading-relaxed">
                    Because of this experience, the idea for GetJobAndGo was born. The goal was to create a focused and trustworthy platform.
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="bg-[#27187E] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-[#27187E]/20 transform md:translate-x-4">
                  <ShieldCheck className="w-12 h-12 text-primary-300 mb-6" />
                  <h3 className="text-2xl font-black mb-3">Verified Opportunities</h3>
                  <p className="text-primary-100 leading-relaxed font-medium">
                    Only verified organizations and companies can post roles, completely eliminating fake job postings.
                  </p>
                </div>
                <div className="bg-primary-50 p-10 rounded-[2.5rem] border border-primary-100 transform md:-translate-x-4">
                  <Target className="w-12 h-12 text-primary-600 mb-6" />
                  <h3 className="text-2xl font-black text-[#27187E] mb-3">Relevant Applications</h3>
                  <p className="text-[#27187E]/70 leading-relaxed font-medium">
                    Students can directly apply to relevant roles, while the hiring process remains simple, swift, and transparent.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Vision and Mission */}
          <section className="py-24 bg-[#FAFAFC]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8">
              <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 transition-transform hover:-translate-y-2 duration-300">
                <Compass className="w-14 h-14 text-indigo-500 mb-8" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                  Our Vision
                </h3>
                <h4 className="text-3xl md:text-4xl font-serif font-black text-slate-900 leading-[1.3] mb-6 tracking-tight">
                  To build a trusted hiring ecosystem where talented students connect with genuine organizations without unnecessary noise.
                </h4>
              </div>

              <div className="bg-[#27187E] p-12 md:p-16 rounded-[3rem] shadow-2xl shadow-[#27187E]/20 border border-primary-600 transition-transform hover:-translate-y-2 duration-300">
                <Rocket className="w-14 h-14 text-primary-300 mb-8" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-primary-200 mb-4">
                  Our Mission
                </h3>
                <ul className="space-y-6">
                  {[
                    "Reduce fake job postings across the board.",
                    "Eliminate spam and unverified notifications.",
                    "Help students find real opportunities faster.",
                    "Build a secure platform for freshers and interns.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-white">
                      <div className="w-6 h-6 rounded-full bg-primary-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={16} className="text-primary-200" strokeWidth={2.5} />
                      </div>
                      <span className="text-lg font-medium tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Founder Section */}
          <section className="py-32 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-full h-full bg-slate-50 -skew-y-3 origin-top-left -z-10" />

            <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
              <div className="relative mx-auto md:mx-0 max-w-sm">
                <div className="absolute inset-0 bg-[#27187E] rounded-[3rem] rotate-6 opacity-10"></div>
                <div className="absolute inset-0 bg-primary-500 rounded-[3rem] -rotate-3 opacity-10"></div>
                <img
                  src="/founder.jpg"
                  alt="Sailendra Prasath N"
                  draggable="false"
                  className="relative z-10 rounded-[3rem] shadow-2xl w-full object-cover border-4 border-white aspect-[4/5] select-none pointer-events-none"
                />
              </div>
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-2">
                    Sailendra Prasath N
                  </h2>
                  <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#27187E]">
                    Founder, GetJobAndGo
                  </p>
                </div>

                <div className="space-y-6 text-slate-500 text-lg leading-relaxed font-medium">
                  <p>
                    Sailendra Prasath N is a student entrepreneur passionate about building technology that simplifies career opportunities for students.
                  </p>
                  <p>
                    While exploring job platforms during his college journey, he noticed the challenges students face when navigating large job portals. This inspired him to create GetJobAndGo, a platform designed to focus on trust, verification, and meaningful career connections.
                  </p>
                  <p>
                    His goal is to build a platform where students can find the right opportunity and confidently move to the next chapter of their careers.
                  </p>
                </div>

                <a
                  href="https://www.linkedin.com/in/sailendraprasath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 mt-10 px-8 py-4 rounded-full bg-[#0A66C2] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#004182] transition-colors shadow-lg shadow-[#0A66C2]/20"
                >
                  Connect on LinkedIn <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="py-32 bg-[#27187E] text-center relative overflow-hidden">
            <div className="absolute left-0 top-0 w-full h-full opacity-[0.05]">
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[100px]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
              <Lightbulb className="w-16 h-16 text-white/20 mx-auto mb-10" />
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white leading-[1.3] mb-12 tracking-tight">
                Everyone deserves a fair opportunity to start their career.
              </h2>
              <div className="space-y-6 text-primary-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                <p>
                  GetJobAndGo believes that the right opportunity at the right time can change a student's future.
                </p>
                <p>The platform exists to help students:</p>
              </div>
              <div className="mt-16 inline-flex flex-col sm:flex-row items-center justify-center gap-4 bg-white/10 p-2 sm:p-3 pr-8 rounded-3xl sm:rounded-full border border-white/20 backdrop-blur-md text-white font-serif italic text-2xl md:text-4xl shadow-xl">
                <span className="px-8 py-4 md:py-5 bg-white text-[#27187E] not-italic font-black rounded-2xl sm:rounded-full shadow-sm whitespace-nowrap">
                  Get a Job
                </span>
                <ArrowRight className="text-primary-300 w-8 h-8 rotate-90 sm:rotate-0" />
                <span className="px-4 py-2 opacity-90 text-center sm:text-left text-xl md:text-3xl">
                  And Go to the <br className="hidden sm:block" />
                  Next Chapter of Life.
                </span>
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
                      draggable="false"
                      className="w-5 h-5 object-contain select-none"
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
                  href="https://www.linkedin.com/in/sailendraprasath"
                  target="_blank"
                  rel="noopener noreferrer"
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

export default AboutPage;
