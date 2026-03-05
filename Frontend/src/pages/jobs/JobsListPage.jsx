import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listJobs } from "../../services/jobService";
import {
  Search, Loader2, Briefcase, MapPin, Clock,
  CheckCircle2, ArrowUpDown, Sparkles, X
} from "lucide-react";
import SEO from "../../SEO";
import { trackJobSearch } from "../../utils/analytics";

function JobCard({ job, isFeatured }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className={`group relative bg-white border rounded-3xl p-6 transition-all duration-500 active:scale-[0.99] overflow-hidden block ${
        isFeatured
          ? "border-primary-100 shadow-[0_20px_40px_rgba(39,24,126,0.06)] hover:shadow-[0_25px_60px_rgba(39,24,126,0.12)] hover:border-primary-300"
          : "border-slate-100 hover:border-primary-200 hover:shadow-[0_20px_50px_rgba(39,24,126,0.08)]"
      }`}
    >


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 group-hover:bg-primary-50 transition-colors">
            <Briefcase className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-transform duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors uppercase tracking-tight">
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
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <p className="text-sm text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-tight">
                {job.company_name}
                {job.company_verification_status === "verified" && (
                  <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50/50" />
                )}
              </p>
              <span className="hidden md:inline text-slate-300 font-bold">•</span>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                <MapPin size={13} className="text-primary-300" />
                {job.location?.toLowerCase().includes("remote") ? "Remote" : job.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
          <div className="flex items-center gap-2 text-xs font-black text-primary-700 bg-primary-50 px-4 py-2 rounded-xl border border-primary-100">
            {job.salary
              ? job.salary.toString().startsWith("₹") || job.salary.toString().startsWith("$")
                ? job.salary
                : `${job.company_country?.toLowerCase() === "usa" ? "$" : "₹"}${job.salary} ${job.salary_period === "monthly" ? "/ Month" : "LPA"}`
              : "Competitive"}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock size={12} />
            {job.created_at
              ? new Date(job.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short" })
              : "Active Now"}
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
          <span className="text-primary-600 font-black">→</span>
        </div>
      </div>
    </Link>
  );
}

function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [allFetched, setAllFetched] = useState(false);

  // Track search in analytics
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timer = setTimeout(() => {
        trackJobSearch(searchQuery);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Load only 6 random featured jobs on mount
  useEffect(() => {
    listJobs({ random: 6 })
      .then((data) => setFeaturedJobs(data.results ?? data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Lazy-load all jobs the first time user types
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value && !allFetched) {
      setLoadingAll(true);
      listJobs()
        .then((data) => {
          setJobs(data.results ?? data);
          setAllFetched(true);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingAll(false));
    }
  };

  // Apply filter and sort to search results
  const getFilteredJobs = () => {
    let result = [...jobs];

    if (searchQuery) {
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== "all") {
      result = result.filter((job) => job.job_type === filterType);
    }

    if (sortBy === "latest") {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "salary-desc") {
      result.sort((a, b) => {
        const salaryA = parseFloat(a.salary?.toString().replace(/[^0-9.]/g, "") || 0);
        const salaryB = parseFloat(b.salary?.toString().replace(/[^0-9.]/g, "") || 0);
        return salaryB - salaryA;
      });
    }

    return result;
  };

  // Filter featured jobs too (for type filter while on default view)
  const filteredFeatured = filterType === "all"
    ? featuredJobs
    : featuredJobs.filter((j) => j.job_type === filterType);

  const filteredJobs = getFilteredJobs();

  return (
    <>
      <SEO
        title="Browse Engineering & IT Jobs | GetJobAndGo"
        description="Explore the latest verified job openings, software internships, and fresher roles in Engineering & IT on GetJobAndGo."
        canonical="https://getjobandgo.com/jobs"
      />
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col gap-6 pb-2 border-b border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Opportunities</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-md">
                Find your next career move. Verified postings for freshers, interns, and experienced professionals.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search roles, companies, or cities..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-100 rounded-2xl">
              {[
                { value: "all", label: "All Roles" },
                { value: "job", label: "Full-Time" },
                { value: "intern", label: "Internship" },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterType(value)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filterType === value
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-r border-slate-200 pr-4 mr-1 hidden sm:block">
                Sort By
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-2xl pl-10 pr-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="latest">Latest First</option>
                  <option value="salary-desc">Highest Salary</option>
                </select>
                <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
            <p className="text-sm text-slate-500 font-medium tracking-tight">Scanning for opportunities...</p>
          </div>
        ) : searchQuery ? (
          /* ─── SEARCH RESULTS VIEW ─── */
          <div className="space-y-6 pb-12">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Search className="text-slate-400 w-4 h-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Results for "{searchQuery}"
                </p>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Clear Search
              </button>
            </div>

            {loadingAll ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
                <p className="text-sm text-slate-400 font-medium">Searching all roles...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                <p className="text-xs text-slate-400 font-bold">
                  Found <span className="text-primary-600">{filteredJobs.length}</span>{" "}
                  {filteredJobs.length === 1 ? "role" : "roles"}
                </p>
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Briefcase size={24} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold mb-1 uppercase tracking-tight">No roles found</h3>
                <p className="text-sm text-slate-500 mb-4">No results for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
                >
                  ← Back to Featured
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ─── DEFAULT VIEW: 6 RANDOM FEATURED JOBS ─── */
          <div className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary-500 w-5 h-5 animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Featured Opportunities
              </h2>
              <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Use the search to find more →
              </span>
            </div>

            {filteredFeatured.length > 0 ? (
              <div className="grid gap-4">
                {filteredFeatured.map((job) => (
                  <JobCard key={job.id} job={job} isFeatured />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                <Briefcase size={32} className="text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  No {filterType === "intern" ? "internships" : "full-time roles"} right now
                </p>
              </div>
            )}

            {/* Search prompt */}
            <div className="mt-4 p-6 rounded-3xl border border-dashed border-primary-100 bg-primary-50/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
                <Search size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700 uppercase tracking-tight">
                  Looking for a specific role or company?
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Use the search bar above to find roles by title, company name, or city.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default JobsListPage;
