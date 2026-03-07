import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { 
  Plus, Pencil, Loader2, Briefcase, Trash2, Download, 
  ChevronDown, Layers, Users, TrendingUp, CheckCircle2,
  Clock, MapPin, DollarSign, X, Search, ArrowRight
} from 'lucide-react';
import { listJobs, createJob, updateJob, deleteJob } from '../../services/jobService';
import { listMyApplications, updateApplication, downloadResume, getApplicationStats } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { trackJobPosting } from '../../utils/analytics';
import { confirmAction } from '../../utils/confirmToast.jsx';
import MyCareerWallPosts from '../../components/dashboard/MyCareerWallPosts';
import SEO from '../../SEO';

const statusConfig = {
  applied: { label: 'Applied', color: 'blue', icon: Clock },
  under_review: { label: 'In Review', color: 'amber', icon: Search },
  shortlisted: { label: 'Shortlisted', color: 'violet', icon: TrendingUp },
  hired: { label: 'Hired', color: 'emerald', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'rose', icon: X },
};

function StatusBadge({ status, onChange }) {
  const cfg = statusConfig[status] || statusConfig.applied;
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    violet: 'bg-violet-50 text-violet-600 border-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className="relative group min-w-[130px]">
      <select
        value={status || "applied"}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary-500/5 ${colors[cfg.color]}`}
      >
        {Object.entries(statusConfig).map(([key, c]) => (
          <option key={key} value={key} className="bg-white text-slate-900 font-bold">{c.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
    </div>
  );
}

function CompanyDashboardPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'job',
    salary: '',
    salary_period: 'yearly',
    location: '',
  });

  const [stats, setStats] = useState({
    total: 0,
    hired: 0,
    active_jobs: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, appsData, statsData] = await Promise.all([
        listJobs(),
        listMyApplications(),
        getApplicationStats()
      ]);
      setJobs(jobsData.results || jobsData);
      setApplications(appsData.results || appsData);
      
      const activeJobsCount = (jobsData.results || jobsData).filter(j => j.is_active).length;
      setStats({
        ...statsData,
        active_jobs: activeJobsCount
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const data = await listJobs();
      setJobs(data.results || data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const appsData = await listMyApplications();
      setApplications(appsData.results || appsData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ title: '', description: '', job_type: 'job', salary: '', salary_period: 'yearly', location: '' });
    setEditingJob(null);
    setShowModal(true);
  };

  const handleOpenEdit = (job) => {
    setFormData({
      title: job.title,
      description: job.description,
      job_type: job.job_type || 'job',
      salary: job.salary,
      salary_period: job.salary_period || 'yearly',
      location: job.location,
    });
    setEditingJob(job);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    confirmAction('Permanently delete this opportunity?', async () => {
      try {
        await deleteJob(id);
        fetchJobs();
        toast.success("Posting removed successfully");
      } catch (err) {
        console.error(err);
        toast.error('Unable to remove posting');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
      } else {
        const newJob = await createJob(formData);
        trackJobPosting(user?.id || 'unknown_company', newJob.id);
      }
      setShowModal(false);
      fetchJobs();
      toast.success(editingJob ? "Opportunity updated" : "New opportunity published!");
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      let errorMsg = 'Verification required to post.';
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.detail) {
          errorMsg = errorData.detail;
        } else {
          // Flatten nested validation errors
          errorMsg = Object.entries(errorData)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(' ') : msgs}`)
            .join(' | ');
        }
      }
      
      toast.error(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplication(appId, { status: newStatus });
      fetchApplications();
      toast.success("Candidate status updated");
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handleDownload = async (appId, studentName) => {
    try {
      const blob = await downloadResume(appId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${studentName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Resume download failed.');
    }
  };

  return (
    <>
      <SEO 
        title="Company Dashboard | Hiring Hub | GetJobAndGo"
        description="Manage your job postings, track candidates, and discover top talent on GetJobAndGo's hiring hub."
        canonical="https://getjobandgo.com/company/dashboard"
      />
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Hiring Hub</h1>
          <p className="text-sm text-slate-500 mt-2">Manage your recruitment pipeline and active opportunities.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="group flex items-center gap-3 px-8 py-4 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Publish Role
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group bg-white border border-slate-100 rounded-[2.5rem] p-8 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.02]">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100">
                <Users className="text-primary-500" size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pipeline Total</p>
          </div>
          <p className="text-4xl font-serif font-black text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-3 font-medium">Active candidates across all roles</p>
        </div>

        <div className="relative group bg-white border border-slate-100 rounded-[2.5rem] p-8 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.02]">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="text-emerald-500" size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Successful Hires</p>
          </div>
          <p className="text-4xl font-serif font-black text-slate-900">{stats.hired}</p>
          <p className="text-xs text-slate-400 mt-3 font-medium">Candidates who joined the team</p>
        </div>

        <div className="relative group bg-white border border-slate-100 rounded-[2.5rem] p-8 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.02]">
          <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100">
                <Briefcase className="text-violet-500" size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Slots</p>
          </div>
          <p className="text-4xl font-serif font-black text-slate-900">{stats.active_jobs}</p>
          <p className="text-xs text-slate-400 mt-3 font-medium">Consulting with students now</p>
        </div>

        <Link to="/students" className="relative group bg-gradient-to-br from-[#27187E] to-primary-600 rounded-[2.5rem] p-8 overflow-hidden shadow-xl shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                 <Users className="text-white" size={24} />
              </div>
              <ArrowRight className="text-white/60 group-hover:translate-x-1 transition-transform" size={20} />
           </div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Talent Library</p>
             <p className="text-lg font-bold text-white uppercase tracking-tight">Discover Top Talent</p>
           </div>
        </Link>
      </div>

      {/* Active Postings */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Current Opportunities</h2>
        <div className="grid gap-4">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primary-500" /></div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
               <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Start hiring today!</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-7 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary-200 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Briefcase size={24} className="text-slate-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                            <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase border tracking-widest ${job.job_type === 'intern' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                {job.job_type === 'intern' ? 'Internship' : 'Full Time'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5 mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center gap-2"><MapPin size={14} className="text-primary-400"/> {job.location?.toLowerCase().includes('remote') ? 'Remote' : job.location}</span>
                            <span className="flex items-center gap-2 font-black text-slate-900">
                                {job.salary ? (
                                    job.salary.toString().startsWith('₹') || job.salary.toString().startsWith('$') 
                                        ? job.salary 
                                        : `${job.company_country?.toLowerCase() === 'usa' ? '$' : '₹'}${job.salary} ${job.salary_period === 'monthly' ? '/ Month' : 'LPA'}`
                                ) : 'Competitive'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-6 md:mt-0 ml-auto md:ml-0">
                  <button onClick={() => handleOpenEdit(job)} className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all shadow-sm" title="Edit Posting">
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm" title="Remove Role">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applicant Tracker */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Candidate Pipeline</h2>
        <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Candidate Information</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Target Role</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Application Date</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Decision Center</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">Interactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-primary-50/30 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-900">{app.student_name}</p>
                            {app.student_verification_status === 'verified' && <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50" />}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">{app.student_email}</p>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest">{app.job_title}</p>
                    </td>
                    <td className="px-10 py-7">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                        {new Date(app.applied_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    <td className="px-10 py-7">
                      <StatusBadge status={app.status} onChange={(v) => handleUpdateStatus(app.id, v)} />
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button
                        onClick={() => handleDownload(app.id, app.student_name)}
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:bg-primary-500 hover:border-primary-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95"
                      >
                        <Download size={14} /> Resume
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Post Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-[2rem] md:rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_30px_100px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-300 custom-scrollbar">
            <div className="px-6 py-6 md:px-12 md:py-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20 sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">{editingJob ? 'Update Listing' : 'Publish New Role'}</h2>
                <p className="text-[9px] md:text-[10px] text-primary-500 mt-1 md:mt-2 uppercase font-black tracking-[0.3em]">Hiring Pipeline Management</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 md:p-3 rounded-full hover:bg-slate-100 transition-colors">
                <X size={24} className="text-slate-300" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-8 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Role Title</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" 
                        placeholder="e.g. Senior Product Designer" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Employment Type</label>
                        <select required value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold appearance-none cursor-pointer"
                        >
                        <option value="job">Full-time Opportunity</option>
                        <option value="intern">Student Internship</option>
                        </select>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Salary Range</label>
                            <input required type="text" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" 
                            placeholder="e.g. 10,000" />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Frequency</label>
                            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, salary_period: 'monthly'})}
                                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.salary_period === 'monthly' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Monthly
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, salary_period: 'yearly'})}
                                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.salary_period === 'yearly' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Office Location</label>
                        <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" 
                        placeholder="City or Remote" />
                    </div>
                  </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Description & Requirements</label>
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-6 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all resize-none font-medium leading-relaxed" 
                  placeholder="Outline the core responsibilities and necessary skills..."></textarea>
              </div>

              <div className="pt-4 flex flex-col-reverse md:flex-row items-center justify-end gap-6 md:gap-10">
                <button type="button" onClick={() => setShowModal(false)} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600 transition-colors">Discard Draft</button>
                <button disabled={formLoading} type="submit" className="w-full md:w-auto px-12 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-50">
                  {formLoading ? 'Publishing...' : (editingJob ? 'Update Content' : 'Publish Posting')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MyCareerWallPosts user={user} />
    </div>
    </>
  );
}

export default CompanyDashboardPage;

