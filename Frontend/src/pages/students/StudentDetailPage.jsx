import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudent, downloadStudentResume } from '../../services/studentService';
import { Loader2, ArrowLeft, Download, User, MapPin, Mail, GraduationCap, Briefcase, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

function StudentDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getStudent(id)
      .then((data) => setStudent(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading profile details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center py-20 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
          <Info className="text-slate-300" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Student not found</h2>
        <Link to="/students" className="mt-6 text-primary-600 font-black uppercase tracking-[0.2em] text-[10px] hover:underline">Return to pool</Link>
      </div>
    );
  }

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const blob = await downloadStudentResume(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${student.full_name}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Resume unavailable at the moment.');
    } finally {
      setDownloading(false);
    }
  };

  const skills = student.skills ? student.skills.split(',').map(s => s.trim()) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <Link to="/students" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Talent Pool
      </Link>

      <div className="relative rounded-[3rem] bg-white border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.01]">
        {/* Profile Header Banner */}
        <div className="h-40 bg-gradient-to-r from-primary-600 to-indigo-700" />
        
        <div className="px-10 pb-10 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
              <div className="w-36 h-36 rounded-[2.5rem] bg-slate-50 border-8 border-white flex items-center justify-center shadow-xl relative overflow-hidden group">
                <User size={64} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                {student.verification_status === 'verified' && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
              
              <div className="pb-3">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <h1 className="text-4xl font-serif font-black text-slate-900 tracking-tight">{student.full_name}</h1>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[11px] text-slate-500 font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <MapPin size={14} className="text-primary-400" />
                    {[student.district, student.state].filter(Boolean).join(', ') || 'Remote / Pan India'}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Mail size={14} className="text-primary-400" />
                    {student.user?.email || student.email || 'Confidential'}
                  </div>
                </div>
              </div>
            </div>

            {user?.role === 'company' && student.resume && (
              <button
                onClick={handleDownloadResume}
                disabled={downloading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
              >
                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {downloading ? 'Processing...' : 'Download Resume'}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-16">
            {/* Sidebar info */}
            <div className="md:col-span-1 space-y-10">
              <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                  <GraduationCap size={16} className="text-primary-400" /> Education
                </h3>
                <div className="text-slate-900">
                  <p className="font-bold text-sm leading-relaxed">
                    {student.education || 'Education info not provided'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                  <Briefcase size={16} className="text-primary-400" /> Level
                </h3>
                <div className="text-primary-700 uppercase text-[10px] font-black tracking-[0.2em] bg-primary-50 px-5 py-2.5 rounded-xl inline-block border border-primary-100">
                  {student.experience_level || 'Hiring Potential'}
                </div>
              </div>
            </div>

            {/* Main info */}
            <div className="md:col-span-2 space-y-12">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Knowledge Stack</h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length === 0 && <p className="text-slate-400 italic font-medium ml-2">Exploring core technologies.</p>}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Professional Summary</h3>
                <div className="bg-slate-50/30 rounded-[2.5rem] p-8 border border-slate-100 text-slate-500 text-sm leading-relaxed whitespace-pre-line font-medium italic">
                  {student.about || "Professional profile summary not yet provided by the candidate."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailPage;
