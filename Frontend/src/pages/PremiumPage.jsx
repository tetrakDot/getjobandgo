import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Rocket, Star, Zap, Shield, Clock } from 'lucide-react';
import SEO from '../SEO';

function PremiumPage() {
  const features = [
    { icon: Zap, title: 'Unlimited 2eX Evaluations', desc: 'Run as many resume evaluations as you need, anytime.' },
    { icon: Shield, title: 'Priority ATS Score', desc: 'Deep-scan your resume against top ATS systems.' },
    { icon: Star, title: 'Advanced Skill Mapping', desc: 'AI-powered skill gap analysis with industry benchmarking.' },
    { icon: Rocket, title: 'Early Access Features', desc: 'Get first access to every new tool we ship.' },
  ];

  return (
    <>
      <SEO
        title="GetJobAndGo Premium — Coming Soon"
        description="GetJobAndGo Premium is launching soon. Get unlimited 2eX evaluations, priority ATS scoring, and more."
      />

      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#27187E] to-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                <Sparkles size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black text-white">PRO</span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100">
              <Clock size={14} className="text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">Launching Soon</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Premium<br />
              <span className="text-[#27187E] italic">Access.</span>
            </h1>
            <p className="text-base text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
              We're crafting something exceptional. GetJobAndGo Premium will launch with features that completely transform your hiring experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 text-left">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3 border border-primary-100">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{title}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Notify / Coming Soon CTA */}
          <div className="bg-gradient-to-br from-[#27187E] to-primary-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Rocket size={20} className="text-white/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Launch Incoming</span>
              </div>
              <p className="text-2xl font-serif font-black leading-tight italic">
                "We're building something great.<br />Stay tuned."
              </p>
              <p className="text-sm text-white/60 font-medium">
                GetJobAndGo Premium will be available as soon as possible. Check back soon!
              </p>
            </div>
          </div>

          {/* Back link */}
          <Link
            to="/2ex"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors"
          >
            ← Back to 2eX Evaluator
          </Link>

        </div>
      </div>
    </>
  );
}

export default PremiumPage;
