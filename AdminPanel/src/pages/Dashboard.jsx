import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle2,
  LogIn,
  LogOut,
  Globe
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ─── Custom Tooltip ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, accent }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(8,12,28,0.97)",
          border: `1px solid ${accent}30`,
          borderRadius: 9,
          padding: "10px 14px",
          boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
        }}
      >
        <p
          style={{
            color: "rgba(148,163,184,0.6)",
            fontSize: 11,
            marginBottom: 5,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {label}
        </p>
        <p
          style={{
            color: accent,
            fontWeight: 700,
            fontSize: 20,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

/* ─── Stat Card ──────────────────────────────────────────── */
const StatCard = ({ title, value, icon, accent, trend, delay }) => (
  <div
    className="db-stat-card"
    style={{ animationDelay: `${delay}ms` }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.borderColor = `${accent}25`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(34,197,94,0.07)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: 6,
          padding: "3px 8px",
          color: "#4ade80",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <TrendingUp size={11} />
        {trend}
      </div>
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: "#f1f5f9",
        lineHeight: 1,
        letterSpacing: "-0.8px",
        marginBottom: 5,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {typeof value === "number" ? value.toLocaleString() : value}
    </div>
    <div
      style={{ color: "rgba(100,116,139,0.8)", fontSize: 13, fontWeight: 400 }}
    >
      {title}
    </div>
  </div>
);

/* ─── Chart Card wrapper ─────────────────────────────────── */
const ChartCard = ({ title, subtitle, badge, badgeColor, delay, children }) => (
  <div className="db-chart-card" style={{ animationDelay: `${delay}ms` }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
      }}
    >
      <div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#f1f5f9",
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "rgba(100,116,139,0.7)",
            marginTop: 3,
            fontWeight: 300,
          }}
        >
          {subtitle}
        </p>
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: `${badgeColor}15`,
          border: `1px solid ${badgeColor}25`,
          color: badgeColor,
          borderRadius: 6,
          padding: "4px 10px",
        }}
      >
        {badge}
      </span>
    </div>
    <div style={{ height: 280 }}>{children}</div>
  </div>
);

/* ─── Dashboard ──────────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState({
    total_students: 0,
    total_companies: 0,
    verified_companies: 0,
    active_jobs: 0,
    total_applications: 0,
    login_count: 0,
    logout_count: 0,
    student_geo: [],
    company_geo: [],
    company_growth: [],
    applications_growth: [],
    page_visits: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("reports/dashboard/");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setStats({
          total_students: 0,
          total_companies: 0,
          verified_companies: 0,
          active_jobs: 0,
          total_applications: 0,
          login_count: 0,
          logout_count: 0,
          student_geo: [],
          company_geo: [],
          company_growth: [],
          applications_growth: [],
          page_visits: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: <Users size={17} />,
      accent: "#60a5fa",
      trend: "+12%",
    },
    {
      title: "Total Companies",
      value: stats.total_companies,
      icon: <Building2 size={17} />,
      accent: "#a78bfa",
      trend: "+5%",
    },
    {
      title: "Verified Companies",
      value: stats.verified_companies,
      icon: <CheckCircle2 size={17} />,
      accent: "#34d399",
      trend: "+8%",
    },
    {
      title: "Active Jobs",
      value: stats.active_jobs,
      icon: <Briefcase size={17} />,
      accent: "#fbbf24",
      trend: "+15%",
    },
    {
      title: "Total Applications",
      value: stats.total_applications,
      icon: <FileText size={17} />,
      accent: "#f472b6",
      trend: "+22%",
    },
    {
      title: "User Logins",
      value: stats.login_count,
      icon: <LogIn size={17} />,
      accent: "#10b981",
      trend: "Total",
    },
    {
      title: "User Logouts",
      value: stats.logout_count,
      icon: <LogOut size={17} />,
      accent: "#ef4444",
      trend: "Total",
    },
  ];

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 500,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid rgba(96,165,250,0.15)",
            borderTop: "2px solid #60a5fa",
            animation: "db-spin 0.8s linear infinite",
          }}
        />
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        @keyframes db-spin { to { transform: rotate(360deg); } }
        @keyframes db-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .db-root * { box-sizing: border-box; }
        .db-root { font-family: 'DM Sans', sans-serif; }

        .db-stat-card {
          animation: db-up 0.45s ease both;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 22px;
          transition: transform 0.2s, border-color 0.2s;
          cursor: default;
        }

        .db-chart-card {
          animation: db-up 0.45s ease both;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 26px;
        }

        .recharts-cartesian-axis-tick text {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          fill: rgba(100,116,139,0.7);
        }

        /* scrollbar */
        .db-root::-webkit-scrollbar { width: 4px; }
        .db-root::-webkit-scrollbar-track { background: transparent; }
        .db-root::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }
      `}</style>

      <div
        className="db-root"
        style={{
          minHeight: "100vh",
          background: "#080c1c",
          padding: "32px 28px",
          color: "#f1f5f9",
          position: "relative",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
            backgroundSize: "52px 52px",
          }}
        />

        {/* Single ambient glow — top-left only */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 32,
              animation: "db-up 0.35s ease both",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(96,165,250,0.08)",
                  border: "1px solid rgba(96,165,250,0.18)",
                  borderRadius: 99,
                  padding: "3px 12px",
                  marginBottom: 10,
                  fontSize: 11,
                  color: "#93c5fd",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#60a5fa",
                    boxShadow: "0 0 6px #60a5fa",
                    display: "inline-block",
                  }}
                />
                Live Overview
              </div>
              <h1
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(24px, 2.8vw, 34px)",
                  fontWeight: 400,
                  color: "#f1f5f9",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Dashboard Overview
              </h1>
              <p
                style={{
                  color: "rgba(100,116,139,0.7)",
                  fontSize: 13,
                  marginTop: 7,
                  fontWeight: 300,
                }}
              >
                Here is what is happening with your platform today.
              </p>
            </div>

            {/* Date badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10,
                padding: "9px 16px",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(100,116,139,0.6)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Today
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e2e8f0",
                    marginTop: 2,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {statCards.map((card, i) => (
              <StatCard key={i} {...card} delay={i * 70} />
            ))}
          </div>

          {/* ── Charts ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            <ChartCard
              title="Applications Growth"
              subtitle="Monthly application trends"
              badge="Area"
              badgeColor="#60a5fa"
              delay={380}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.applications_growth}
                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(100,116,139,0.6)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(100,116,139,0.6)", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip accent="#60a5fa" />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradApps)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#60a5fa",
                      stroke: "rgba(96,165,250,0.3)",
                      strokeWidth: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Company Growth"
              subtitle="Monthly registrations"
              badge="Bar"
              badgeColor="#a78bfa"
              delay={460}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.company_growth}
                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradBars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                        stopOpacity={0.7}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(100,116,139,0.6)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(100,116,139,0.6)", fontSize: 11 }}
                  />
                  <Tooltip
                    content={<CustomTooltip accent="#a78bfa" />}
                    cursor={{ fill: "rgba(167,139,250,0.05)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#gradBars)"
                    radius={[5, 5, 0, 0]}
                    barSize={26}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Student Regional Distribution"
              subtitle="Where candidates are coming from"
              badge="Geography"
              badgeColor="#60a5fa"
              delay={540}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.student_geo}
                  margin={{ top: 8, right: 30, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip accent="#60a5fa" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Company Regional Distribution"
              subtitle="HQ locations of partners"
              badge="Geography"
              badgeColor="#a78bfa"
              delay={620}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.company_geo}
                  margin={{ top: 8, right: 30, left: 40, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip accent="#a78bfa" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" fill="#a78bfa" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Most Visited Pages"
              subtitle="Popular destinations on platform"
              badge="Traffic"
              badgeColor="#34d399"
              delay={700}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.page_visits}
                  margin={{ top: 8, right: 30, left: 60, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip accent="#34d399" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="count" fill="#34d399" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
