import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Briefcase, CheckCircle2, Clock, XCircle, Search, ArrowRight, Building2 } from 'lucide-react';
import { listMyApplications, getApplicationStats } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import MyCareerWallPosts from '../../components/dashboard/MyCareerWallPosts';
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
    <div className="w-full mt-6 pt-6 border-t border-slate-50 pb-2">
      <div className="relative flex items-start w-full max-w-2xl mx-auto">
        {/* Background Line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-3 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0"></div>
        
        {/* Fill Line */}
        {!isRejected && currentIdx > 0 && (
          <div className="absolute left-[12.5%] right-[12.5%] top-3 -translate-y-1/2 h-1 z-0">
             <div 
               className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
               style={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
             ></div>
          </div>
        )}
        
        {/* Rejected Line */}
        {isRejected && (
          <div className="absolute left-[12.5%] right-[12.5%] top-3 -translate-y-1/2 h-1 bg-rose-200 rounded-full z-0"></div>
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
          const showTextMobile = state === 'active' || (isRejected && idx === currentIdx);

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-3 flex-1 w-0">
              <div className="h-6 flex items-center justify-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${
                      state === 'completed' ? 'border-primary-500 bg-primary-500 text-white scale-[1.15] shadow-lg shadow-primary-500/30' :
                      state === 'active' ? 'border-primary-500 text-primary-500 scale-[1.25] shadow-xl shadow-primary-500/20 ring-[3px] ring-primary-50' :
                      state === 'rejected' ? 'border-rose-400 text-rose-500 bg-rose-50 scale-110 shadow-sm' :
                      'border-slate-200 text-slate-300'
                  }`}>
                    {state === 'completed' && <CheckCircle2 size={12} strokeWidth={3} />}
                    {state === 'active' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />}
                    {state === 'rejected' && <XCircle size={12} strokeWidth={3} />}
                    {state === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />}
                  </div>
              </div>
              <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-center transition-colors duration-300 w-full px-1 ${
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

function StudentDashboardPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    shortlisted: 0
  });

  useEffect(() => {
    async function load() {
      try {
        const [appsData, statsData] = await Promise.all([
          listMyApplications(),
          getApplicationStats()
        ]);
        
        setApps(appsData.results || appsData);
        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Assembling your profile...</p>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Student Dashboard | GetJobAndGo"
        description="Track your job applications, explore opportunities, and manage your career journey on GetJobAndGo."
        canonical="https://getjobandgo.com/student/dashboard"
      />
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Your Career Journey</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Track your applications and stay on top of your job search.</p>
        </div>
        <Link 
            to="/jobs"
            className="group flex items-center gap-4 px-8 py-4 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95"
        >
            Discover Opportunities <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.01]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Total Submissions</p>
            <p className="text-4xl font-serif font-black text-slate-900">{stats.total}</p>
         </div>
         <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.01]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Under Evaluation</p>
            <p className="text-4xl font-serif font-black text-slate-900">{stats.active}</p>
         </div>
         <div className="bg-white border border-primary-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-500/5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">Shortlisted</p>
            <p className="text-4xl font-serif font-black text-primary-600">{stats.shortlisted}</p>
         </div>
          <Link to="/companies" className="group bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-xl shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between">
             <div className="flex justify-between items-start">
               <Building2 className="text-white/80" size={24} />
               <ArrowRight className="text-white/60 group-hover:translate-x-1 transition-transform" size={20} />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Partner Network</p>
               <p className="text-lg font-bold text-white uppercase tracking-tight">Browse Companies</p>
             </div>
          </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Recent Activity</h2>
        
        <div className="grid gap-4">
            {apps.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Briefcase size={48} className="mx-auto text-slate-200 mb-6" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No application history found.</p>
                    <Link to="/jobs" className="text-primary-600 text-xs font-black uppercase tracking-widest mt-6 inline-block hover:text-primary-700 transition-colors">Apply to your first role →</Link>
                </div>
            ) : (
                apps.slice(0, 5).map(app => {
                    const status = statusMap[app.status] || statusMap.applied;
                    const StatusIcon = status.icon;
                    return (
                        <div key={app.id} className="group flex flex-col p-6 sm:p-7 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary-200 transition-all shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5 w-full md:w-auto overflow-hidden">
                                    <div className="w-12 h-12 flex-shrink-0 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                        <Briefcase size={22} className="text-slate-400" />
                                    </div>
                                    <div className="min-w-0 pr-4">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight truncate">{app.job_title}</h3>
                                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 truncate">{app.company_name}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center w-full md:w-auto justify-between gap-4 md:justify-end border-t border-slate-50 md:border-t-0 pt-4 md:pt-0">
                                    <div className="text-left md:text-right hidden sm:block pr-2">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">Applied</p>
                                        <p className="text-[11px] text-slate-900 font-bold mt-0.5 whitespace-nowrap">
                                            {new Date(app.applied_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border flex-shrink-0 ${status.border} ${status.bg} ${status.color}`}>
                                        <StatusIcon size={12} className="font-bold shrink-0 sm:w-3.5 sm:h-3.5" />
                                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                                    </div>
                                    <Link to={`/jobs/${app.job}`} className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all flex-shrink-0 shrink-0">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                            <ApplicationTracker currentStatus={app.status} />
                        </div>
                    );
                })
            )}
        </div>
        
        {apps.length > 5 && (
            <Link to="/student/applications" className="block text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-colors pt-6 pb-4">
                Explore Full Application History ({apps.length})
            </Link>
        )}
      </div>

      <MyCareerWallPosts user={user} />
    </div>
    </>
  );
}

export default StudentDashboardPage;
