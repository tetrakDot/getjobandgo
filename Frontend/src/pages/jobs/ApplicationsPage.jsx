import React, { useEffect, useState } from 'react';
import { listMyApplications } from '../../services/applicationService';
import { Loader2, Briefcase, CheckCircle2, Clock, XCircle, Search, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../SEO';

const statusMap = {
  applied: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock },
  under_review: { label: 'In Review', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Search },
  shortlisted: { label: 'Shortlisted', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', icon: CheckCircle2 },
  hired: { label: 'Hired', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle },
};

const STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'under_review', label: 'In Review' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'hired', label: 'Hired' }
];

function ApplicationTracker({ currentStatus }) {
  const isRejected = currentStatus === 'rejected';
  const currentIdx = STAGES.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full mt-6 pt-8 border-t border-slate-100 pb-4">
      <div className="relative flex items-start w-full max-w-3xl mx-auto">
        {/* Background Line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-4 -translate-y-1/2 h-1.5 bg-slate-100 rounded-full z-0"></div>
        
        {/* Fill Line */}
        {!isRejected && currentIdx > 0 && (
          <div className="absolute left-[12.5%] right-[12.5%] top-4 -translate-y-1/2 h-1.5 z-0">
             <div 
               className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
             ></div>
          </div>
        )}
        
        {/* Rejected Line */}
        {isRejected && (
          <div className="absolute left-[12.5%] right-[12.5%] top-4 -translate-y-1/2 h-1.5 bg-rose-200 rounded-full z-0"></div>
        )}

        {STAGES.map((stage, idx) => {
          let state = 'pending';
          if (isRejected) {
             state = 'rejected';
          } else if (idx < currentIdx) {
             state = 'completed';
          } else if (idx === currentIdx) {
             state = 'active';
          }

          const isActiveOrCompleted = state === 'active' || state === 'completed';
          // Show label on mobile only for active/rejected, on sm up show all
          const showTextMobile = state === 'active' || (isRejected && idx === currentIdx);

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-4 flex-1 w-0">
              <div className="h-8 flex items-center justify-center shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 bg-white ${
                      state === 'completed' ? 'border-primary-500 bg-primary-500 text-white scale-[1.15] shadow-lg shadow-primary-500/30' :
                      state === 'active' ? 'border-primary-500 text-primary-500 scale-[1.25] shadow-xl shadow-primary-500/20 ring-4 ring-primary-50' :
                      state === 'rejected' ? 'border-rose-400 text-rose-500 bg-rose-50 scale-110 shadow-sm' :
                      'border-slate-200 text-slate-300'
                  }`}>
                    {state === 'completed' && <CheckCircle2 size={16} strokeWidth={3} />}
                    {state === 'active' && <div className="w-3 h-3 rounded-full bg-primary-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />}
                    {state === 'rejected' && <XCircle size={16} strokeWidth={3} />}
                    {state === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-200" />}
                  </div>
              </div>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-center transition-colors duration-300 w-full px-1 ${
                isActiveOrCompleted ? 'text-primary-700' :
                state === 'rejected' ? 'text-rose-500' :
                'text-slate-400'
              } ${showTextMobile ? 'block' : 'hidden sm:block'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
    <>
      <SEO 
        title="My Applications | GetJobAndGo"
        description="View and track the status of your job applications on GetJobAndGo's verified talent network."
        canonical="https://getjobandgo.com/student/applications"
      />
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

        <div className="grid grid-cols-1 gap-8">
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
                  className="group relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-primary-200 transition-all duration-500 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
                >
                  <div className="px-8 pt-8 pb-6 md:px-10 md:pt-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-start gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                           <Building2 size={32} className="text-slate-400 group-hover:text-primary-500 transition-colors duration-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight duration-300">{app.job_title}</h3>
                        <p className="text-[11px] text-primary-600 font-black uppercase tracking-[0.2em] mt-2">{app.company_name}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-500 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
                          <span className="flex items-center gap-2.5"><Clock size={14} className="text-primary-400"/> Applied on {new Date(app.applied_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 md:self-stretch">
                      <div className="flex flex-col items-end gap-3 pr-8 border-r border-slate-100 hidden md:flex justify-center h-full">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Current Status</p>
                           <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border ${status.bg} ${status.color} ${status.border}`}>
                              <StatusIcon size={14} className="font-bold" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                           </div>
                      </div>
                      
                      <Link 
                          to={`/jobs/${app.job}`}
                          className="w-full md:w-auto px-8 py-4 bg-white hover:bg-primary-50 hover:text-primary-700 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-center flex items-center justify-center transition-all border border-slate-200 hover:border-primary-200 active:scale-95 shadow-sm h-fit self-center"
                      >
                          View Job Details
                      </Link>
                    </div>
                  </div>

                  {/* Progress Tracker Inserted Here */}
                  <ApplicationTracker currentStatus={app.status} />

                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

export default ApplicationsPage;

