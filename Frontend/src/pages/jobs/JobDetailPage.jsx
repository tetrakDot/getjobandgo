import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getJob } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";
import { useAuth } from "../../hooks/useAuth";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, Building2, CheckCircle2, Share2, Loader2, Send } from "lucide-react";
import { toast } from "react-toastify";
import SEO from "../../SEO";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJob(id)
      .then((data) => setJob(data))
      .catch((err) => {
        console.error(err);
        toast.error("Role no longer available.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (!job) return;
    
    const shareData = {
      title: `${job.title} at ${job.company_name}`,
      text: `Check out this opportunity: ${job.title} at ${job.company_name} on GetJobAndGo`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // Fallback: WhatsApp share link
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.info("Please sign in to apply.");
      navigate("/auth/login");
      return;
    }

    if (user.role !== 'student') {
        toast.warning("Only student accounts can apply to roles.");
        return;
    }

    setSubmitting(true);
    try {
      await applyToJob(job.id);
      toast.success("Application successfully submitted!");
    } catch (err) {
      let errorMsg = "Unable to submit application.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (err.response.data.detail) {
            errorMsg = err.response.data.detail;
        } else if (err.response.data.non_field_errors) {
          errorMsg = err.response.data.non_field_errors[0] || errorMsg;
        } else {
          const firstKey = Object.keys(err.response.data)[0];
          if (firstKey && Array.isArray(err.response.data[firstKey])) {
            errorMsg = err.response.data[firstKey][0] || errorMsg;
          }
        }
      }
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in duration-700">
        <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving role data...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative mb-12">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[3rem] shadow-2xl shadow-primary-500/10 flex flex-col items-center justify-center border border-slate-100 relative z-10">
                <Briefcase size={48} className="text-slate-200 mb-2 scale-110" />
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-bounce">
                    <span className="text-rose-500 font-black text-xs leading-none">!</span>
                </div>
            </div>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-full scale-150 -z-0" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-black text-[#27187E] tracking-tight mb-4">
            Opportunity Not Found
        </h2>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed font-medium mb-12 text-lg">
            This specific role index either expired, was archived by the organization, or never existed in our current Hiring Hub.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4">
            <Link 
                to="/jobs" 
                className="group flex items-center gap-3 px-10 py-5 bg-[#27187E] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#27187E]/20 hover:bg-[#27187E]/90 transition-all active:scale-95"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Browse Hiring Hub
            </Link>
            <button 
                onClick={() => navigate(-1)}
                className="px-10 py-5 bg-white text-slate-400 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
            >
                Previous Page
            </button>
        </div>
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    employmentType: job.job_type === "intern" ? "INTERN" : "FULL_TIME",
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: job.salary,
            unitText: "YEAR",
          },
        }
      : undefined,
  };

  return (
    <>
      <SEO
        title={`${job.title} Role at ${job.company_name} | GetJobAndGo`}
        description={`Hiring ${job.title} at ${job.company_name} in ${job.location}. View salary, requirements and apply on GetJobAndGo - the verified talent network.`}
        canonical={`https://getjobandgo.com/jobs/${id}`}
        schema={schema}
      />

      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between">
            <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary-600 transition-colors"
            >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Return to Listings
            </button>
            <button 
              onClick={handleShare}
              className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-100 transition-all shadow-sm"
            >
                <Share2 size={18} />
            </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
                {/* Main Card */}
                <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm transition-all hover:shadow-xl hover:shadow-black/[0.01]">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                             <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                job.job_type === "intern" 
                                    ? "bg-violet-50 text-violet-600 border-violet-100" 
                                    : "bg-blue-50 text-blue-600 border-blue-100"
                                }`}>
                                {job.job_type === "intern" ? "Internship Opportunity" : "Full Time Role"}
                            </span>
                            <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                job.is_active 
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                    : "bg-slate-50 text-slate-400 border-slate-200"
                                }`}>
                                {job.is_active ? "Active & Hiring" : "Position Filled"}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 leading-[1.15] mb-10 tracking-tight">
                            {job.title}
                        </h1>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 mb-12">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Location</p>
                                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <MapPin size={14} className="text-primary-400" /> {job.location?.toLowerCase().includes('remote') ? 'Remote' : job.location}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Compensation</p>
                                <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    {/* Fallback to ₹ if country is India or undefined (base target) */}
                                    {job.salary ? (
                                        job.salary.toString().startsWith('₹') || job.salary.toString().startsWith('$') 
                                            ? job.salary 
                                            : `${job.company_country?.toLowerCase() === 'usa' ? '$' : '₹'}${job.salary} ${job.salary_period === 'monthly' ? '/ Month' : 'LPA'}`
                                    ) : 'Competitive'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Posted</p>
                                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Clock size={14} className="text-primary-400" /> {new Date(job.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Type</p>
                                <p className="text-sm font-black text-primary-600 uppercase tracking-widest">
                                    {job.category || (job.job_type === "intern" ? "Internship" : "Full-Time")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-serif font-black text-slate-900 tracking-tight">The Opportunity</h3>
                            </div>
                            <div className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-line bg-slate-50/30 p-8 rounded-[2rem] border border-slate-50 font-medium">
                                {job.description || "The organization has not provided a detailed description for this role yet."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
                {/* Apply Card */}
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 sticky top-24 shadow-[0_30px_100px_rgba(0,0,0,0.03)] border-t-4 border-t-primary-500">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                             <Briefcase size={32} className="text-slate-300" />
                        </div>
                        <h4 className="text-2xl font-serif font-black text-slate-900 mb-3 tracking-tight">Join the team</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Verified Listing</p>
                    </div>

                    <button
                        disabled={!job.is_active || submitting}
                        onClick={handleApply}
                        className="w-full py-5 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 transition-all active:scale-95 disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-4 mb-6"
                    >
                        {submitting ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} className="rotate-45 -translate-y-0.5" />
                        )}
                        {job.is_active ? "Submit Application" : "Applications Closed"}
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400 leading-relaxed font-bold uppercase tracking-widest px-6">
                        Verified profile & contact details will be shared.
                    </p>
                </div>

                {/* Company Link Card */}
                <div className="bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:shadow-black/[0.01] transition-all">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                         <Building2 size={24} className="text-slate-300" />
                    </div>
                    <h5 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2 uppercase tracking-tight">
                        {job.company_name}
                        {job.company_verification_status === "verified" && <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mb-8">Corporate Partner</p>
                    <Link 
                        to={`/companies/${job.company}`}
                        className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-[0.2em] border-b-2 border-primary-500/20 hover:border-primary-500 transition-all pb-0.5"
                    >
                        Explore Organization
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default JobDetailPage;
