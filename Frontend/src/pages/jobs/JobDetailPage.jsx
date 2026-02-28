import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJob } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";
import { useAuth } from "../../hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Job
  useEffect(() => {
    getJob(id)
      .then((data) => setJob(data))
      .catch(() => {});
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    setSubmitting(true);
    try {
      await applyToJob(job.id);
      toast.success("Application submitted successfully.");
    } catch (err) {
      let errorMsg = "Unable to submit application.";

      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
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

  // Loading State
  if (!job) {
    return <p className="text-xs text-slate-400">Loading job…</p>;
  }

  // 🔥 SEO Structured Data
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
        title={`${job.title} at ${job.company_name} | GetJobAndGo`}
        description={`${job.title} job opening at ${job.company_name} in ${job.location}. Apply now on GetJobAndGo.`}
        canonical={`https://getjobandgo.com/jobs/${id}`}
        schema={schema}
      />

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
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-50">
                {job.title}
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                {job.company_name} • {job.location}
              </p>
            </div>

            <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              {job.is_active ? "Open" : "Closed"}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-200 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Salary:{" "}
            <span className="font-medium text-slate-200">
              {job.salary ? `₹${job.salary} / year` : "Not disclosed"}
            </span>
          </p>

          <button
            type="button"
            disabled={!job.is_active || submitting}
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-primary-600 text-sm font-medium text-slate-50 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Submitting…"
              : job.is_active
                ? "Apply now"
                : "Closed"}
          </button>
        </div>
      </div>
    </>
  );
}

export default JobDetailPage;
