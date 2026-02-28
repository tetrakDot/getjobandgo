import React, { useEffect, useState } from 'react';
import { listMyApplications } from '../../services/applicationService';

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3 shadow-sm shadow-slate-900/40">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}

function StudentDashboardPage() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0
  });

  useEffect(() => {
    async function load() {
      const apps = await listMyApplications();
      const totalApplications = apps.count ?? apps.results?.length ?? 0;
      const activeApplications = (apps.results ?? []).filter(
        (a) => a.status !== 'rejected' && a.status !== 'hired'
      ).length;
      setStats({ totalApplications, activeApplications });
    }
    load().catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Welcome back
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Track your job search and stay on top of every application.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Total applications" value={stats.totalApplications} />
        <StatCard label="In progress" value={stats.activeApplications} />
      </div>
    </div>
  );
}

export default StudentDashboardPage;

