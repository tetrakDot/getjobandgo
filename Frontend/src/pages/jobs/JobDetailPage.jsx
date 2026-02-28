import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJob } from '../../services/jobService';
import { applyToJob } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((data) => setJob(data))
      .catch(() => {});
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    setSubmitting(true);
    try {
      await applyToJob(job.id);
      toast.success('Application submitted successfully.');
    } catch (err) {
      console.error("Application error:", err);
      // Try to parse the DRF ValidationError
      let errorMsg = 'Unable to submit application.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.non_field_errors) {
          errorMsg = err.response.data.non_field_errors[0] || errorMsg;
        } else if (Array.isArray(err.response.data)) {
          errorMsg = err.response.data[0] || errorMsg;
        } else {
          // If it's a dict of field errors
          const firstKey = Object.keys(err.response.data)[0];
          if (firstKey && Array.isArray(err.response.data[firstKey])) {
            errorMsg = err.response.data[firstKey][0] || errorMsg;
          }
        }
      } else {
        errorMsg = 'Unable to submit application. You may have already applied.';
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) {
    return <p className="text-xs text-slate-400">Loading job…</p>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </button>
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-5 py-4 shadow-sm shadow-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50 flex items-center gap-2">
              {job.title}
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono tracking-wide uppercase">
                {job.job_type === 'intern' ? 'Intern' : 'Job'}
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-slate-400 flex items-center gap-1">
              <span>{job.company_name}</span>
              {job.company_verification_status === 'verified' && (
                <span title="Verified Company" className="text-emerald-500 flex items-center">
                  <svg className="w-3.5 h-3.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              <span className="mx-1">•</span>
              <span>{job.location}</span>
            </p>
          </div>
          <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {job.is_active ? 'Open' : 'Closed'}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">{job.description}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">
            Salary:{' '}
            <span className="font-medium text-slate-200">
              {job.salary ? `${job.salary} / year` : 'Not disclosed'}
            </span>
          </p>
        </div>
        <button
          type="button"
          disabled={!job.is_active || submitting}
          onClick={handleApply}
          className="px-4 py-2 rounded-xl bg-primary-600 text-sm font-medium text-slate-50 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting…' : job.is_active ? 'Apply now' : 'Closed'}
        </button>
      </div>
    </div>
  );
}

export default JobDetailPage;

