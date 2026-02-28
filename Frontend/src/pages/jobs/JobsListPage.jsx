import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listJobs } from "../../services/jobService";
import { Search, Loader2 } from "lucide-react";
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
      .catch(() => {})
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
        title="Browse Jobs | GetJobAndGo"
        description="Explore latest job openings, internships, and fresher opportunities across India."
        canonical="https://getjobandgo.com/jobs"
      />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
              Browse jobs
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Discover curated opportunities from verified companies.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-primary-600 hover:bg-slate-900 transition-colors shadow-sm shadow-slate-900/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50 group-hover:text-primary-100 flex items-center gap-2">
                      {job.title}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono tracking-wide uppercase">
                        {job.job_type === "intern" ? "Intern" : "Job"}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span>{job.company_name}</span>
                      {job.company_verification_status === "verified" && (
                        <span
                          title="Verified Company"
                          className="text-emerald-500 flex items-center"
                        >
                          <svg
                            className="w-3.5 h-3.5 inline-block"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                      <span className="mx-1">•</span>
                      <span>{job.location}</span>
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    {job.is_active ? "Open" : "Closed"}
                  </span>
                </div>
              </Link>
            ))}
            {filteredJobs.length === 0 && (
              <p className="text-xs text-slate-500 py-8 text-center">
                {jobs.length === 0
                  ? "No jobs available yet. Check back soon."
                  : "No jobs match your search criteria."}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default JobsListPage;
