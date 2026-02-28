import React, { useEffect, useState } from 'react';
import { listMyApplications } from '../../services/applicationService';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    listMyApplications()
      .then((data) => setApplications(data.results ?? data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
          Your applications
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Review every role you&apos;ve applied to and current statuses.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3 shadow-sm shadow-slate-900/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-50">{app.job_title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{app.company_name}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Applied on {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[11px] px-2 py-1 rounded-full bg-slate-800 text-slate-100 border border-slate-700 capitalize">
                {app.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="text-xs text-slate-500">
            You haven&apos;t applied to any jobs yet. Start from the jobs page.
          </p>
        )}
      </div>
    </div>
  );
}

export default ApplicationsPage;

