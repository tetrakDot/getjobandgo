import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany } from '../../services/companyService';
import { listJobs } from '../../services/jobService';
import { Loader2, ArrowLeft, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function CompanyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCompany(id),
      listJobs({ company: id })
    ])
      .then(([companyData, jobsData]) => {
        setCompany(companyData);
        setJobs(jobsData.results || jobsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!company) {
    return <p className="text-sm text-slate-400">Company not found.</p>;
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <Link to="/companies" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft size={14} /> Back to companies
      </Link>
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-5 shadow-sm shadow-slate-900/40">
        <div className="flex justify-between items-start">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50 flex items-center gap-2">
            {company.company_name}
            {company.verification_status === 'verified' && (
              <span title="Verified" className="text-emerald-500 flex items-center">
                <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </h1>
          <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
            {company.company_type || 'Company'}
          </span>
        </div>
        {(company.country || company.state || company.district) && (
          <p className="mt-4 text-sm text-slate-400 flex items-center gap-1.5">
            📍 {[company.district, company.state, company.country].filter(Boolean).join(', ')}
          </p>
        )}
        
        <div className="mt-6 pt-4 border-t border-slate-800/60">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-2">About the Company</h2>
          <p className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            {company.company_description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50 mb-4 flex items-center gap-2">
          <Briefcase size={20} className="text-primary-500" /> Open Positions
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {jobs.filter(j => j.is_active).length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-sm text-slate-400">This company currently has no active job postings.</p>
            </div>
          ) : (
            jobs.filter(j => j.is_active).map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group rounded-2xl bg-slate-900/80 border border-slate-800 px-5 py-4 hover:border-primary-600 hover:bg-slate-900 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-50 group-hover:text-primary-100 flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono tracking-wide uppercase">
                        {job.job_type === 'intern' ? 'Intern' : 'Job'}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                      <span className="flex items-center gap-1">💰 {job.salary}</span>
                    </div>
                  </div>
                  {user?.role === 'student' && (
                    <span className="text-xs px-3 py-1.5 rounded-lg bg-primary-600/10 text-primary-400 font-medium group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      View & Apply
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
