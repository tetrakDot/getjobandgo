import React, { useState } from "react";
import { Search, Loader2, Sparkles, FileText, Briefcase, ChevronRight, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react";
import SEO from "../SEO";
import { evaluateResume } from "../services/evaluatorService";
import { toast } from "react-toastify";

function AiResumeEvaluator() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async () => {
    if (!jobDescription || !resumeFile) return;
    
    setEvaluating(true);
    try {
        const data = await evaluateResume(jobDescription, resumeFile);
        setResult(data);
        toast.success("Analysis synchronized successfully!");
    } catch (err) {
        console.error("2eX Synchronization Error:", err);
        const errorDetail = err.response?.data?.error || err.response?.data?.detail || err.message;
        toast.error(`2eX Engine Error: ${errorDetail}`);
    } finally {
        setEvaluating(false);
    }
  };

  return (
    <>
      <SEO 
        title="2eX AI Resume Evaluator | Advanced Talent Matching"
        description="Leverage 2eX, the advanced AI Resume Evaluation and Job Matching System, to get a professional ATS-grade analysis of your profile."
      />
      
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
        <div className="relative overflow-hidden bg-[#27187E] rounded-[3rem] p-12 md:p-20 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <Sparkles size={14} className="text-primary-400" />
                Advanced ATS Engine
             </div>
             <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight leading-tight">
                2eX <span className="text-primary-400 italic">Engine.</span>
             </h1>
             <p className="text-lg text-white/70 font-medium leading-relaxed mb-0">
                The next-generation AI Resume Evaluation System. Objective, analytical, and precise benchmarking for the modern workforce.
             </p>
          </div>
        </div>

        {!result ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Briefcase size={24} className="text-primary-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-black text-slate-900 tracking-tight">Job Description</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Role Requirements</p>
                    </div>
                </div>
                <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-48 bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all resize-none"
                />
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <FileText size={24} className="text-indigo-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-black text-slate-900 tracking-tight">Resume Source</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Document (PDF/DOCX)</p>
                    </div>
                </div>
                
                <div className={`relative group border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center text-center ${resumeFile ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-white'}`}>
                    <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${resumeFile ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-300'}`}>
                        <FileText size={32} />
                    </div>
                    <div className="space-y-1">
                        <p className={`text-sm font-black ${resumeFile ? 'text-indigo-600' : 'text-slate-600'}`}>
                            {resumeFile ? resumeFile.name : 'Upload your professional resume'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Dynamic Scan Ready` : 'Supports PDF, Docx files up to 10MB'}
                        </p>
                    </div>
                </div>
            </div>

            <button 
                disabled={evaluating || !jobDescription || !resumeFile}
                onClick={handleEvaluate}
                className="w-full py-6 rounded-[2rem] bg-[#27187E] text-white font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-[#27187E]/20 hover:bg-[#27187E]/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
                {evaluating ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Synchronizing Metrics...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} className="text-primary-400" />
                        Execute 2eX Evaluation
                    </>
                )}
            </button>
          </div>

          {/* Awaiting/Evaluating State Area */}
          <div className="relative">
            {!evaluating ? (
                <div className="sticky top-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] h-[600px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mb-6">
                        <BarChart3 size={32} className="text-slate-300" />
                    </div>
                    <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4">Awaiting Input</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs uppercase tracking-tight">
                        Provide a job description and resume to generate a professional evaluation report.
                    </p>
                </div>
            ) : (
                <div className="sticky top-24 bg-white border border-slate-100 rounded-[3rem] h-[600px] flex flex-col items-center justify-center p-12 text-center shadow-xl animate-pulse">
                    <div className="w-24 h-24 rounded-full border-b-4 border-primary-500 animate-spin mb-8" />
                    <h4 className="text-2xl font-serif font-black text-slate-900 mb-2 italic">Scanning Data Points...</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600">Cross-referencing Skills & Experience</p>
                </div>
            )}
          </div>
        </div>
      ) : (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 fade-in duration-700 pb-20">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => {
                        setResult(null);
                        setJobDescription("");
                        setResumeFile(null);
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                    <ChevronRight size={16} className="rotate-180" />
                    New Analysis
                </button>
                <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[9px] font-black uppercase tracking-widest leading-none">
                    <CheckCircle2 size={14} /> Report Synchronized
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-black/[0.03]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-slate-50 pb-10 gap-8">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary-600 mb-2">AI Diagnostic: Engine 2eX</p>
                        <h4 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight italic">Technical Evaluation</h4>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                             <div className="text-6xl md:text-7xl font-serif font-black text-[#27187E] leading-none mb-1">{result.overall}%</div>
                             <div className={`text-[10px] font-black uppercase tracking-[0.4em] ${result.overall >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {result.classification}
                            </div>
                        </div>
                        <div className="w-px h-16 bg-slate-100 hidden md:block" />
                        <div className="text-4xl">{result.overall >= 75 ? '🟢' : '🟡'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {Object.entries(result.breakdown).map(([key, val]) => (
                        <div key={key} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-black/[0.02] transition-all">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                {key.replace(/([A-Z])/g, ' $1')}
                            </p>
                            <p className="text-3xl font-serif font-black text-slate-900">{val}%</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-10">
                        <section className="space-y-6">
                            <h5 className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 italic">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Key Strengths
                            </h5>
                            <div className="flex flex-wrap gap-2.5">
                                {result.matchedSkills.map(skill => (
                                    <span key={skill} className="px-5 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h5 className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 italic">
                                <AlertCircle size={16} className="text-rose-500" /> Expertise Gaps
                            </h5>
                            <div className="flex flex-wrap gap-2.5">
                                {result.missingSkills.map(skill => (
                                    <span key={skill} className="px-5 py-2.5 rounded-2xl bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="bg-slate-50/80 p-10 rounded-[2.5rem] border border-slate-100">
                        <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 italic">Benchmarking Analysis</h5>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium italic">"{result.gapAnalysis}"</p>
                    </section>

                    <section>
                        <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 mb-6 italic underline decoration-primary-500/20 underline-offset-8">Verdict & Recommendation</h5>
                        <div className="p-10 md:p-12 rounded-[3rem] bg-[#27187E] text-white shadow-2xl shadow-[#27187E]/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <p className="text-3xl md:text-4xl font-serif font-black mb-4 italic leading-tight">{result.recommendation}</p>
                                <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium italic max-w-2xl">{result.justification}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AiResumeEvaluator;
