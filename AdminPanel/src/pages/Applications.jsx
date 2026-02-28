import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  FileText,
  Search,
  Loader2,
  Plus,
  X,
  Download,
  ChevronDown,
  Briefcase,
  Building2,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

/* ─── Shared styles ──────────────────────────────────────── */
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 9,
  color: "#e2e8f0",
  fontSize: 13.5,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "rgba(100,116,139,0.7)",
  marginBottom: 7,
  fontFamily: "'DM Sans', sans-serif",
};

/* ─── Status config ──────────────────────────────────────── */
const statusConfig = {
  applied: {
    label: "Applied",
    dot: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    text: "#93c5fd",
    border: "rgba(96,165,250,0.2)",
  },
  under_review: {
    label: "Under Review",
    dot: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    text: "#fcd34d",
    border: "rgba(251,191,36,0.2)",
  },
  shortlisted: {
    label: "Shortlisted",
    dot: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    text: "#c4b5fd",
    border: "rgba(167,139,250,0.2)",
  },
  hired: {
    label: "Hired",
    dot: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    text: "#6ee7b7",
    border: "rgba(52,211,153,0.2)",
  },
  rejected: {
    label: "Rejected",
    dot: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    text: "#fca5a5",
    border: "rgba(248,113,113,0.2)",
  },
};

/* ─── Field ──────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

/* ─── Modal ──────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(6px)",
      animation: "ap-fade 0.18s ease",
    }}
  >
    <div
      style={{
        background: "#0b0f22",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        width: "100%",
        maxWidth: 480,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 72px rgba(0,0,0,0.6)",
        animation: "ap-up 0.22s ease",
      }}
    >
      {children}
    </div>
  </div>
);

const ModalHeader = ({ icon, title, onClose }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 22px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: "rgba(96,165,250,0.12)",
          border: "1px solid rgba(96,165,250,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#60a5fa",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "#f1f5f9",
          letterSpacing: "-0.2px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {title}
      </span>
    </div>
    <button
      onClick={onClose}
      style={{
        width: 30,
        height: 30,
        borderRadius: 7,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        cursor: "pointer",
        color: "rgba(100,116,139,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.18s, color 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
        e.currentTarget.style.color = "#fca5a5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "rgba(100,116,139,0.7)";
      }}
    >
      <X size={14} />
    </button>
  </div>
);

const StatusBadge = ({ status, onChange }) => {
  const cfg = statusConfig[status] || statusConfig.applied;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <select
        value={status || "applied"}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 6,
          padding: "4px 24px 4px 22px",
          color: cfg.text,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.04em",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {Object.entries(statusConfig).map(([key, c]) => (
          <option
            key={key}
            value={key}
            style={{ background: "#0b0f22", color: "#e2e8f0" }}
          >
            {c.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          pointerEvents: "none",
        }}
      />
      <ChevronDown
        size={11}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.6,
          color: cfg.text,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   APPLICATIONS PAGE
════════════════════════════════════════════════════════════ */
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    student: "",
    job: "",
    status: "applied",
    resume_snapshot: null,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [sRes, jRes] = await Promise.all([
        api.get("students/"),
        api.get("jobs/?is_active=true"),
      ]);
      setStudentsList(sRes.data.results || []);
      setJobsList(jRes.data.results || []);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("applications/");
      setApplications(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`applications/${id}/`, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app,
        ),
      );
      toast.success("Application status updated.");
    } catch {
      toast.error("Error updating application status.");
    }
  };

  const downloadResume = async (appId, fileName) => {
    try {
      const res = await api.get(`applications/${appId}/download-resume/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `resume_${appId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error(
        "Unable to download resume securely. The file may no longer exist.",
      );
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append("student", newApp.student);
      formData.append("job", newApp.job);
      formData.append("status", newApp.status);
      if (newApp.resume_snapshot)
        formData.append("resume_snapshot", newApp.resume_snapshot);
      await api.post("applications/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Application created successfully.");
      setShowAddModal(false);
      setNewApp({
        student: "",
        job: "",
        status: "applied",
        resume_snapshot: null,
      });
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.student?.[0] ||
          "Error creating application.",
      );
    } finally {
      setAddLoading(false);
    }
  };

  const filteredApps = applications.filter(
    (a) =>
      (a.student_name &&
        a.student_name.toLowerCase().includes(search.toLowerCase())) ||
      (a.job_title &&
        a.job_title.toLowerCase().includes(search.toLowerCase())) ||
      (a.company_name &&
        a.company_name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .ap-root * { box-sizing: border-box; }
        .ap-root { font-family: 'DM Sans', sans-serif; }
        @keyframes ap-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes ap-up   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ap-row  { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:translateX(0) } }
        @keyframes ap-spin { to { transform:rotate(360deg) } }
        .ap-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: ap-row 0.3s ease both;
        }
        .ap-tr:hover { background: rgba(96,165,250,0.04) !important; }
        .ap-tr:last-child { border-bottom: none; }
        .ap-input:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08) !important;
          background: rgba(96,165,250,0.04) !important;
        }
        .ap-input::placeholder { color: rgba(51,65,85,0.8); }
        .ap-input::-webkit-file-upload-button {
          background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2);
          border-radius: 6px; color: #93c5fd; padding: 4px 10px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; margin-right: 10px;
        }
        .ap-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff; box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; letter-spacing: 0.01em;
        }
        .ap-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.4); }
        .ap-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .ap-btn-cancel {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07); color: rgba(100,116,139,0.8);
          transition: background 0.15s, color 0.15s;
        }
        .ap-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }
        .ap-act-download {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px; font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer; white-space: nowrap;
          border: 1px solid rgba(96,165,250,0.2); background: rgba(96,165,250,0.08); color: #93c5fd;
          transition: background 0.15s, border-color 0.15s;
        }
        .ap-act-download:hover { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); }
        .ap-scroll::-webkit-scrollbar { width: 3px; }
        .ap-scroll::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }
      `}</style>

      <div className="ap-root">
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "ap-fade 0.35s ease",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(22px, 2.6vw, 30px)",
                fontWeight: 400,
                margin: 0,
                color: "#f1f5f9",
                letterSpacing: "-0.4px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <FileText size={22} style={{ color: "#60a5fa", flexShrink: 0 }} />
              Application Tracking
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              Monitor all student applications across the platform.
            </p>
          </div>
          <button
            className="ap-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={15} /> Add Application
          </button>
        </div>

        {/* ── Table Card ── overflow:hidden is REMOVED to let dropdown escape ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            /* ⚠️ NO overflow:hidden here — that was clipping the dropdown */
            animation: "ap-up 0.35s ease 0.08s both",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              borderRadius: "14px 14px 0 0",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <div style={{ position: "relative", width: 280 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(100,116,139,0.5)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search by student, job, or company…"
                className="ap-input"
                style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {!loading && (
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(100,116,139,0.5)",
                  flexShrink: 0,
                }}
              >
                {filteredApps.length} application
                {filteredApps.length !== 1 ? "s" : ""}
                {search && ` · "${search}"`}
              </span>
            )}
          </div>

          {/* Table wrapper — only horizontal scroll, no vertical clip */}
          <div
            style={{ overflowX: "auto", borderRadius: "0 0 14px 14px" }}
            className="ap-scroll"
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {[
                    "Applicant",
                    "Job Title",
                    "Company",
                    "Applied",
                    "Status",
                    "Resume",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 20px",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(71,85,105,0.8)",
                        fontFamily: "'DM Sans', sans-serif",
                        textAlign: i === 5 ? "right" : "left",
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Loader2
                        size={28}
                        style={{
                          color: "#60a5fa",
                          animation: "ap-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <FileText
                        size={32}
                        style={{
                          color: "rgba(30,41,59,0.8)",
                          margin: "0 auto 10px",
                        }}
                      />
                      <p
                        style={{
                          color: "rgba(71,85,105,0.7)",
                          fontSize: 13,
                          margin: 0,
                        }}
                      >
                        No applications found{search ? ` for "${search}"` : ""}.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app, idx) => (
                    <tr
                      key={app.id}
                      className="ap-tr"
                      style={{ animationDelay: `${idx * 35}ms` }}
                    >
                      {/* Applicant */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 9,
                              flexShrink: 0,
                              background: "rgba(96,165,250,0.1)",
                              border: "1px solid rgba(96,165,250,0.18)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#60a5fa",
                            }}
                          >
                            <User size={15} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: "#e2e8f0",
                                letterSpacing: "-0.1px",
                              }}
                            >
                              {app.student_name || `Student #${app.student}`}
                            </div>
                            {app.student_email && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "rgba(100,116,139,0.7)",
                                  marginTop: 2,
                                }}
                              >
                                {app.student_email}
                              </div>
                            )}
                            {app.student_skills && (
                              <span
                                title={app.student_skills}
                                style={{
                                  display: "inline-block",
                                  marginTop: 4,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  background: "rgba(96,165,250,0.08)",
                                  border: "1px solid rgba(96,165,250,0.15)",
                                  color: "#93c5fd",
                                  borderRadius: 4,
                                  padding: "1px 7px",
                                  maxWidth: 160,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {app.student_skills}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Briefcase
                            size={12}
                            style={{
                              color: "rgba(100,116,139,0.5)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: "#cbd5e1",
                              fontWeight: 500,
                            }}
                          >
                            {app.job_title || `Job #${app.job}`}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Building2
                            size={12}
                            style={{
                              color: "rgba(100,116,139,0.5)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12.5,
                              color: "rgba(100,116,139,0.8)",
                            }}
                          >
                            {app.company_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Applied At */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Calendar
                            size={12}
                            style={{
                              color: "rgba(100,116,139,0.5)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 12.5,
                              color: "rgba(100,116,139,0.8)",
                            }}
                          >
                            {new Date(app.applied_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 20px" }}>
                        <StatusBadge
                          status={app.status || "applied"}
                          onChange={(val) => updateStatus(app.id, val)}
                        />
                      </td>

                      {/* Resume */}
                      <td style={{ padding: "13px 20px", textAlign: "right" }}>
                        {app.resume_snapshot ? (
                          <button
                            className="ap-act-download"
                            onClick={() =>
                              downloadResume(
                                app.id,
                                app.resume_snapshot.split("/").pop(),
                              )
                            }
                          >
                            <Download size={12} /> Resume
                          </button>
                        ) : (
                          <span
                            style={{
                              fontSize: 12,
                              color: "rgba(71,85,105,0.6)",
                              fontStyle: "italic",
                            }}
                          >
                            No resume
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ ADD MODAL ══ */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <ModalHeader
              icon={<Plus size={15} />}
              title="Add Application"
              onClose={() => setShowAddModal(false)}
            />
            <form onSubmit={handleCreate}>
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Field label="Student">
                  <select
                    required
                    className="ap-input"
                    style={inputStyle}
                    value={newApp.student}
                    onChange={(e) =>
                      setNewApp({ ...newApp, student: e.target.value })
                    }
                  >
                    <option value="">Select student…</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.email})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Job">
                  <select
                    required
                    className="ap-input"
                    style={inputStyle}
                    value={newApp.job}
                    onChange={(e) =>
                      setNewApp({ ...newApp, job: e.target.value })
                    }
                  >
                    <option value="">Select job…</option>
                    {jobsList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} at {j.company_name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    className="ap-input"
                    style={inputStyle}
                    value={newApp.status}
                    onChange={(e) =>
                      setNewApp({ ...newApp, status: e.target.value })
                    }
                  >
                    {Object.entries(statusConfig).map(([key, c]) => (
                      <option key={key} value={key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Resume Snapshot">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="ap-input"
                    style={{ ...inputStyle, padding: "8px 14px" }}
                    onChange={(e) =>
                      setNewApp({
                        ...newApp,
                        resume_snapshot: e.target.files[0],
                      })
                    }
                  />
                </Field>
              </div>
              <div
                style={{
                  padding: "14px 22px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="ap-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ap-btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "ap-spin 0.8s linear infinite" }}
                      />{" "}
                      Creating…
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Create Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Applications;
