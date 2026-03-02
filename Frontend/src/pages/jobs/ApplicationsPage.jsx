import React, { useEffect, useState } from 'react';
import { listMyApplications } from '../../services/applicationService';
import { Loader2, Briefcase, CheckCircle2, Clock, XCircle, Search, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusMap = {
  applied: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock },
  under_review: { label: 'In Review', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Search },
  shortlisted: { label: 'Shortlisted', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', icon: CheckCircle2 },
  hired: { label: 'Hired', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle },
};

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications()
      .then((data) => setApplications(data.results ?? data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/student/dashboard" className="group inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Return to Dashboard
      </Link>

      <div className="flex items-center justify-between border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Your Applications</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage and track all the positions you've applied for.</p>
        </div>
        <div className="hidden md:block bg-white border border-slate-100 px-8 py-4 rounded-[2rem] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Submissions</p>
            <p className="text-2xl font-serif font-black text-slate-900 mt-1">{applications.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <Briefcase size={56} className="mx-auto text-slate-200 mb-8" />
             <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No history found</h3>
             <p className="text-slate-400 mt-2 font-medium">Explore active roles and kickstart your career today.</p>
             <Link to="/jobs" className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-primary-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
                Browse Opportunities
             </Link>
          </div>
        ) : (
          applications.map((app) => {
            const status = statusMap[app.status] || statusMap.applied;
            const StatusIcon = status.icon;
            return (
              <div
                key={app.id}
                className="group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
              >
                <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-start gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                         <Building2 size={32} className="text-slate-400 group-hover:text-primary-500 transition-colors duration-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight duration-300">{app.job_title}</h3>
                      <p className="text-[11px] text-primary-600 font-black uppercase tracking-[0.2em] mt-2">{app.company_name}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 py-2.5 bg-slate-50 rounded-full border border-slate-100 w-fit">
                        <span className="flex items-center gap-2.5"><Clock size={14} className="text-primary-400"/> Applied on {new Date(app.applied_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end gap-3 pr-8 border-r border-slate-100 hidden md:flex">
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Application Status</p>
                         <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border ${status.bg} ${status.color} ${status.border}`}>
                            <StatusIcon size={14} className="font-bold" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                         </div>
                    </div>
                    
                    <Link 
                        to={`/jobs/${app.job}`}
                        className="w-full md:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-center transition-all border border-slate-100 active:scale-95 shadow-sm"
                    >
                        View Profile
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ApplicationsPage;
