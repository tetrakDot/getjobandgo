import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listJobs } from "../../services/jobService";
import { Search, Loader2, Briefcase, MapPin, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import SEO from "../../SEO";

function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    listJobs()
      .then((data) => {
        setJobs(data.results ?? data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <SEO
        title="Browse Engineering & IT Jobs | GetJobGo"
        description="Explore the latest verified job openings, software internships, and fresher roles in Engineering & IT on GetJobGo."
        canonical="https://getjobgo.com/jobs"
      />
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Opportunities
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Find your next career move. Verified postings for freshers, interns, and experienced professionals.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Roles, companies, or cities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
            <p className="text-sm text-slate-500 font-medium tracking-tight">Scanning for opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group relative bg-white border border-slate-100 rounded-3xl p-6 hover:border-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(39,24,126,0.08)] active:scale-[0.99] overflow-hidden block"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-primary-50 transition-colors">
                      <Briefcase className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-transform duration-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                          {job.title}
                        </h3>
                        <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border ${
                          job.job_type === "intern" 
                            ? "bg-violet-50 text-violet-600 border-violet-100" 
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                          {job.job_type === "intern" ? "Internship" : "Full Time"}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <p className="text-sm text-slate-600 flex items-center gap-1.5 font-bold">
                          {job.company_name}
                          {job.company_verification_status === "verified" && (
                            <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50/50" />
                          )}
                        </p>
                        <span className="hidden md:inline text-slate-300 font-bold">•</span>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                          <MapPin size={14} className="text-primary-300" />
                          {job.location?.toLowerCase().includes('remote') ? 'Remote' : job.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-end md:gap-2">
                    <div className="flex items-center gap-2 text-xs font-black text-primary-700 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
                      {job.salary ? (
                        job.salary.toString().startsWith('₹') || job.salary.toString().startsWith('$') 
                          ? job.salary 
                          : `${job.company_country?.toLowerCase() === 'usa' ? '$' : '₹'}${job.salary} ${job.salary_period === 'monthly' ? '/ Month' : 'LPA'}`
                      ) : "Competitive"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      <Clock size={12} />
                      {job.created_at ? new Date(job.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : 'Active Now'}
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                   <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
                    <span className="text-primary-600 font-black">→</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && filteredJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Briefcase size={24} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">No jobs match your search</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default JobsListPage;
