import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompany } from '../../services/companyService';
import { listJobs } from '../../services/jobService';
import { Loader2, ArrowLeft, Briefcase, MapPin, Globe, Building2, CheckCircle2, Info, Users, ExternalLink, Mail, Layout, Clock, Search } from 'lucide-react';
import SEO from '../../SEO';
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
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching organization details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center py-20 animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
          <Info className="text-slate-300" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Company not found</h2>
        <Link to="/companies" className="mt-6 text-primary-600 font-black uppercase tracking-[0.2em] text-[10px] hover:underline">Return to partners</Link>
      </div>
    );
  }

  const activeJobs = jobs.filter(j => j.is_active);

  return (
    <>
      <SEO 
        title={`${company.company_name} | Hiring on GetJobAndGo`}
        description={`Explore career opportunities at ${company.company_name}. View company profile, mission, and active job openings on GetJobAndGo.`}
        canonical={`https://getjobandgo.com/companies/${id}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": company.company_name,
          "description": company.company_description,
          "url": company.website,
          "address": {
             "@type": "PostalAddress",
             "addressLocality": company.district,
             "addressRegion": company.state,
             "addressCountry": "India"
          }
        }}
      />
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link to="/companies" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Partners
      </Link>

      <div className="relative rounded-[3rem] bg-white border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.01]">
        <div className="h-48 bg-gradient-to-br from-primary-600 to-indigo-800" />
        
        <div className="px-10 pb-12 -mt-16 relative">
          <div className="flex flex-col md:flex-row items-end gap-8 text-center md:text-left">
            <div className="w-44 h-44 rounded-[2.5rem] bg-white border-8 border-white flex items-center justify-center shadow-xl overflow-hidden shrink-0 group">
              {company.logo ? (
                 <img src={company.logo} alt={company.company_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <Building2 size={64} className="text-slate-100" />
              )}
            </div>
            
            <div className="pb-4 flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">{company.company_name}</h1>
                {company.verification_status === 'verified' && (
                  <div className="bg-emerald-50 text-emerald-600 rounded-full px-4 py-1.5 flex items-center gap-2 border border-emerald-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                    <CheckCircle2 size={14} className="fill-emerald-50" /> Verified Partner
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <MapPin size={14} className="text-primary-400" />
                  {[company.district, company.state, company.country].filter(Boolean).join(', ') || 'Global Headquarters'}
                </div>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-primary-600 hover:text-primary-700 hover:bg-white transition-all">
                    <Globe size={14} /> 
                    {company.website.replace(/^https?:\/\//, '')}
                    <ExternalLink size={10} />
                  </a>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                  <Users size={14} className="text-primary-400" />
                  {company.company_type || 'Technology Leader'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">
                    Organization Profile
                </h3>
                <div className="bg-slate-50/30 rounded-[2.5rem] p-10 border border-slate-100 text-slate-600 text-base leading-[1.8] whitespace-pre-line font-medium">
                    {company.company_description || "Leading the industry through innovation and excellence. We are committed to fostering a culture of growth and providing students with unparalleled opportunities to launch their professional careers in a dynamic environment."}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 ml-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                        Active Opportunities
                    </h3>
                    <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-100">
                        {activeJobs.length} roles found
                    </span>
                </div>
                
                <div className="grid gap-5">
                  {activeJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <Briefcase size={40} className="text-slate-100 mb-6" />
                      <p className="text-xs text-slate-400 text-center font-bold uppercase tracking-widest">
                        Currently focused on existing projects. <br/> <span className="text-[10px] font-medium mt-2 block">Check back later for new roles.</span>
                      </p>
                    </div>
                  ) : (
                    activeJobs.map(job => (
                      <Link
                        key={job.id}
                        to={`/jobs/${job.id}`}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-primary-200 transition-all shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
                      >
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-2 uppercase tracking-tight">
                            {job.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">📍 {job.location}</span>
                            <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 font-black text-primary-600">₹ {job.salary || 'Market Best'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-6 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                           <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${
                                job.job_type === 'intern' 
                                    ? 'bg-violet-50 text-violet-600 border border-violet-100' 
                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                                {job.job_type}
                            </span>
                             <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all duration-300">
                                <span className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xl font-black">→</span>
                            </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
                 {/* Quick Context Card */}
                 <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.03)] border-t-4 border-t-primary-500">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Organization Insight</h4>
                    <div className="space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                <Users size={20} className="text-primary-400" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-300 mb-1">Hiring Philosophy</p>
                                <p className="text-[13px] font-bold text-slate-900 leading-snug">Empowering Innovation & Fresh Talent</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                <Globe size={20} className="text-primary-400" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-300 mb-1">Corporate Reach</p>
                                <p className="text-[13px] font-bold text-slate-900 leading-snug">{company.location?.toLowerCase().includes('remote') ? 'Remote' : (company.location || 'Pan India & Remote')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-100 flex flex-col gap-4">
                        {company.website && (
                             <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-3 border border-slate-100 shadow-sm active:scale-95"
                             >
                                Visit portal <ExternalLink size={14} className="text-primary-500" />
                             </a>
                        )}
                        <p className="text-[9px] text-slate-300 text-center mt-2 font-black uppercase tracking-[0.3em]">
                            Partner since 2024
                        </p>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default CompanyDetailPage;
