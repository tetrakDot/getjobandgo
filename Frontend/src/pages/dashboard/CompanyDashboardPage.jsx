import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Loader2, Briefcase, Trash2, Download, ChevronDown } from 'lucide-react';
import { listJobs, createJob, updateJob, deleteJob } from '../../services/jobService';
import { listMyApplications, updateApplication, downloadResume } from '../../services/applicationService';

const statusConfig = {
  applied: { label: 'Applied', dot: '#60a5fa', text: '#93c5fd', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  under_review: { label: 'Reviewing', dot: '#fbbf24', text: '#fde68a', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  shortlisted: { label: 'Shortlisted', dot: '#a78bfa', text: '#ddd6fe', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
  hired: { label: 'Hired', dot: '#34d399', text: '#a7f3d0', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  rejected: { label: 'Rejected', dot: '#f87171', text: '#fecaca', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
};

const StatusBadge = ({ status, onChange }) => {
  const cfg = statusConfig[status] || statusConfig.applied;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={status || "applied"}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 6,
          padding: "4px 24px 4px 22px",
          color: cfg.text,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {Object.entries(statusConfig).map(([key, c]) => (
          <option
            key={key}
            value={key}
            style={{ background: "#0b0f22", color: "#e2e8f0" }}
          >
            {c.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          pointerEvents: "none",
        }}
      />
      <ChevronDown
        size={11}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.6,
          color: cfg.text,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

function CompanyDashboardPage() {
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
    location: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, appsData] = await Promise.all([
        listJobs(),
        listMyApplications()
      ]);
      setJobs(jobsData.results || jobsData);
      setApplications(appsData.results || appsData);
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
    setFormData({ title: '', description: '', job_type: 'job', salary: '', location: '' });
    setEditingJob(null);
    setShowModal(true);
  };

  const handleOpenEdit = (job) => {
    setFormData({
      title: job.title,
      description: job.description,
      job_type: job.job_type || 'job',
      salary: job.salary,
      location: job.location,
    });
    setEditingJob(job);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this posting?')) return;
    try {
      await deleteJob(id);
      fetchJobs();
      toast.success("Job deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error('Error deleting job');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
      } else {
        await createJob(formData);
      }
      setShowModal(false);
      fetchJobs();
      toast.success(editingJob ? "Job updated successfully" : "Job created successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || err.response?.data?.company?.[0] || 'Error saving job. Note: Verified company status is required to post jobs.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplication(appId, { status: newStatus });
      fetchApplications();
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error('Error updating status.');
    }
  };

  const handleDownload = async (appId, studentName) => {
    try {
      const blob = await downloadResume(appId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${studentName}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Unable to download resume.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Company workspace
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Post roles, review applicants, and keep your hiring pipeline moving.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 font-medium text-sm transition-colors"
        >
          <Plus size={16} /> Post Job/Internship
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-4 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Total applicants</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{applications.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-4 shadow-sm">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Recent hires</p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{applications.filter(a => a.status === 'hired').length}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-sm font-semibold text-slate-200">Your Postings</h2>
        </div>
        <div className="divide-y divide-slate-800/60">
          {loading ? (
            <div className="p-8 flex justify-center text-primary-500"><Loader2 className="animate-spin" /></div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No postings available. Click 'Post Job' to start hiring.</div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                <div>
                  <h3 className="text-slate-100 font-medium flex items-center gap-3">
                    {job.title}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono tracking-wide uppercase">
                      {job.job_type === 'intern' ? 'Intern' : 'Job'}
                    </span>
                    {!job.is_active && <span className="text-[10px] text-rose-400 border border-rose-400/30 bg-rose-400/10 px-1.5 py-0.5 rounded uppercase">Closed</span>}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                    <span className="flex items-center gap-1">💰 {job.salary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenEdit(job)} className="p-2 rounded bg-slate-800 text-blue-400 hover:bg-slate-700 transition-colors" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 rounded bg-slate-800 text-red-400 hover:bg-slate-700 transition-colors" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
          <h2 className="text-sm font-semibold text-slate-200">Recent Applications</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                {["Applicant", "Job Title", "Applied", "Status", "Resume"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(71,85,105,0.8)",
                      textAlign: h === "Resume" ? "right" : "left",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    <Loader2 size={24} className="animate-spin text-primary-500 mx-auto" />
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px" }}>
                    <Briefcase size={28} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No applications received yet.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className={`border border-slate-800/50 hover:bg-slate-800/20 transition-colors ${app.student_verification_status === 'verified' ? 'border-emerald-500/30 bg-emerald-900/10' : ''}`}>
                    <td style={{ padding: "12px 20px" }}>
                      <p className="text-sm font-medium text-slate-100 flex items-center gap-1.5">
                        {app.student_name}
                        {app.student_verification_status === 'verified' && (
                          <span title="Verified Student" className="text-emerald-500 flex items-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">{app.student_email}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">{app.student_skills}</p>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <p className="text-sm text-slate-200">{app.job_title}</p>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <p className="text-xs text-slate-400">
                        {new Date(app.applied_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td style={{ padding: "12px 20px" }}>
                      <StatusBadge
                        status={app.status}
                        onChange={(newStatus) => handleUpdateStatus(app.id, newStatus)}
                      />
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDownload(app.id, app.student_name)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        <Download size={13} />
                        Resume
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-100">{editingJob ? 'Edit Posting' : 'Create Posting'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" 
                  placeholder="e.g. Jr. Python Developer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                <select required value={formData.job_type} onChange={e => setFormData({ ...formData, job_type: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
                >
                  <option value="job">Full-time Job</option>
                  <option value="intern">Internship</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Salary / Stipend</label>
                  <input required type="text" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" placeholder="e.g. ₹ 5,00,000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" placeholder="e.g. Remote" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" 
                  placeholder="Describe the opportunity..."></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
                <button disabled={formLoading} type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {formLoading ? 'Saving...' : 'Save Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboardPage;

