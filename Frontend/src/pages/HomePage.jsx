import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building2, User, CheckCircle2, ShieldCheck, Target, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-primary-500/30 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Get Job And Go Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-serif font-medium tracking-tight">GetJobAndGo</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-primary-400">Home</Link>
            
            {user ? (
               <Link to={user.role === 'company' ? '/company/dashboard' : '/student/dashboard'} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors">
                  Go to Dashboard
               </Link>
            ) : (
              <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
                 <Link to="/auth/login" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                   <User className="w-4 h-4" /> Student
                 </Link>
                 <Link to="/auth/company/login" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                   <Building2 className="w-4 h-4" /> Company
                 </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-br from-primary-600/10 via-logoGreen/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            🚀 Currently in Development – Launching Soon!
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6 tracking-tight">
            Verified Opportunities for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-logoGreen italic">Freshers & Interns</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            A trusted platform where verified companies and verified employees connect with freshers and interns — no bots, no fake listings, no application overload.
          </p>
          
          <p className="text-base text-primary-200/80 mb-12 max-w-2xl mx-auto font-medium">
            Freshers & Interns க்கான நம்பகமான வேலை வாய்ப்பு தளம். Verified செய்யப்பட்ட நிறுவனங்கள் மற்றும் employees மட்டும் இணையும் பாதுகாப்பான hiring ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             {!user && (
               <>
                  <Link to="/auth/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
                    <User className="w-5 h-5" /> I'm a Student
                  </Link>
                  <Link to="/auth/company/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2">
                    <Building2 className="w-5 h-5" /> I'm a Company
                  </Link>
               </>
             )}
          </div>
        </section>

        {/* Mission Section */}
        <section className="border-t border-slate-800/50 bg-slate-900/30">
          <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <ShieldCheck className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h2 className="text-3xl font-serif mb-4">Our Mission / எங்கள் நோக்கம்</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                We empower freshers and interns by providing genuine, verified job opportunities. Our goal is to eliminate fake accounts and build a transparent hiring system.<br/><br/>
                <span className="text-slate-400 text-sm">Fake accounts இல்லாமல், verified வேலை வாய்ப்புகளை வழங்கி freshers மற்றும் interns க்கு நம்பகமான சூழலை உருவாக்குவது எங்கள் குறிக்கோள்.</span>
              </p>
            </div>

            {/* Features Info */}
            <h3 className="text-2xl font-serif text-center mb-10">Why Verification Matters / ஏன் Verification முக்கியம்?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Verified Companies</h4>
                <p className="text-slate-400 text-sm mb-3">Only trusted organizations can post job opportunities.</p>
                <p className="text-slate-500 text-xs">நம்பகமான நிறுவனங்கள் மட்டும் வேலை பதிவிட முடியும்.</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Verified Employees</h4>
                <p className="text-slate-400 text-sm mb-3">Real professionals interact with candidates.</p>
                <p className="text-slate-500 text-xs">உண்மையான employees மட்டும் தொடர்பு கொள்ள முடியும்.</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                  <Target className="w-6 h-6 text-violet-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Trusted Platform</h4>
                <p className="text-slate-400 text-sm mb-3">A secure and reliable ecosystem for your career growth.</p>
                <p className="text-slate-500 text-xs">உங்கள் வேலைவாய்ப்பு பயணத்திற்கான ஒரு பாதுகாப்பான தளம்.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 text-center px-6">
           <h2 className="text-3xl font-serif mb-6">Our Vision / எங்கள் Vision</h2>
           <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-4 font-serif italic">
             "Make it easy for everyone to Get a Job and Go to the next chapter of their life."
           </p>
           <p className="text-slate-400 text-sm">
             ஒவ்வொருவரும் எளிதாக ஒரு வேலை பெற்று, வாழ்க்கையின் அடுத்த கட்டத்திற்கு முன்னேற வேண்டும்.
           </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 GetJobAndGo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
