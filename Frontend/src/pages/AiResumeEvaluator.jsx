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

          {/* Results Area */}
          <div className="relative">
            {!result && !evaluating && (
                <div className="sticky top-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] h-[600px] flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mb-6">
                        <BarChart3 size={32} className="text-slate-300" />
                    </div>
                    <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4">Awaiting Input</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs uppercase tracking-tight">
                        Provide a job description and resume to generate a professional evaluation report.
                    </p>
                </div>
            )}

            {evaluating && (
                <div className="sticky top-24 bg-white border border-slate-100 rounded-[3rem] h-[600px] flex flex-col items-center justify-center p-12 text-center shadow-xl animate-pulse">
                     <div className="w-24 h-24 rounded-full border-b-4 border-primary-500 animate-spin mb-8" />
                     <h4 className="text-2xl font-serif font-black text-slate-900 mb-2 italic">Scanning Data Points...</h4>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600">Cross-referencing Skills & Experience</p>
                </div>
            )}

            {result && !evaluating && (
                <div className="space-y-6 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-10 scrollbar-hide">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-black/[0.02]">
                        <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 mb-1">AI Name: 2eX</p>
                                <h4 className="text-3xl font-serif font-black text-slate-900 tracking-tight italic">Evaluation Report</h4>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-serif font-black text-[#27187E]">{result.overall}%</div>
                                <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${result.overall >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {result.classification} {result.overall >= 75 ? '🟢' : '🟡'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {Object.entries(result.breakdown).map(([key, val]) => (
                                <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <p className="text-xl font-black text-slate-900">{val}%</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-8">
                            <section>
                                <h5 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 italic">
                                    <CheckCircle2 size={14} className="text-emerald-500" /> Matched Skills
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchedSkills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-tight border border-emerald-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h5 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 italic">
                                    <AlertCircle size={14} className="text-rose-500" /> Critical Gaps
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingSkills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-tight border border-rose-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 italic">Gap Analysis</h5>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">{result.gapAnalysis}</p>
                            </section>

                            <section>
                                <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-4 italic underline decoration-primary-500/20 underline-offset-4">Hiring Recommendation</h5>
                                <div className="p-6 rounded-2xl bg-[#27187E] text-white">
                                    <p className="text-xl font-serif font-black mb-2 italic">{result.recommendation}</p>
                                    <p className="text-xs text-white/70 leading-relaxed font-medium italic">{result.justification}</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AiResumeEvaluator;
