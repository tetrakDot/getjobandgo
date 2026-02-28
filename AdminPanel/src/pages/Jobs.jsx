import { useState, useEffect } from "react";
import api from "../services/api";
import { confirmAction } from "../utils/confirmToast.jsx";
import {
  Briefcase,
  Search,
  Power,
  Trash2,
  Loader2,
  Play,
  MapPin,
  IndianRupee,
  Building2,
  Plus,
  X,
  Pencil,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-toastify";

/* ─── Shared styles ──────────────────────────────────────── */
const inpStyle = {
  width: "100%",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 9,
  color: "#e2e8f0",
  fontSize: 13.5,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  boxSizing: "border-box",
};

const lblStyle = {
  display: "block",
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "rgba(100,116,139,0.7)",
  marginBottom: 7,
  fontFamily: "'DM Sans', sans-serif",
};

/* ─── Modal ──────────────────────────────────────────────── */
const Modal = ({ onClose, children, maxWidth = 480 }) => (
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
      animation: "jb-modal-fade 0.18s ease",
    }}
  >
    <div
      style={{
        background: "#0b0f22",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        width: "100%",
        maxWidth,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 24px 72px rgba(0,0,0,0.6)",
        animation: "jb-modal-up 0.22s ease",
      }}
      className="jb-scroll"
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
          background: "rgba(96,165,250,0.1)",
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
      type="button"
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
        transition: "background 0.15s, color 0.15s",
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

const Field = ({ label, children }) => (
  <div>
    <label style={lblStyle}>{label}</label>
    {children}
  </div>
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    description: "",
    job_type: "job",
    salary: "",
    location: "",
    is_active: true,
  });

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("jobs/");
      setJobs(res.data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get("companies/");
      // Assuming 'companies' endpoint returns a list of dictionaries with { id, company_name }
      setCompanies(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (job) => {
    try {
      await api.patch(`jobs/${job.id}/`, { is_active: !job.is_active });
      setJobs(
        jobs.map((j) =>
          j.id === job.id ? { ...j, is_active: !job.is_active } : j,
        ),
      );
      toast.success("Job status updated.");
    } catch (err) {
      toast.error("Error updating job status.");
    }
  };

  const deleteJob = (id) => {
    confirmAction(
      "Are you sure you want to delete this job?",
      async () => {
        try {
          await api.delete(`jobs/${id}/`);
          setJobs(jobs.filter((j) => j.id !== id));
          toast.success("Job deleted successfully.");
        } catch (err) {
          toast.error("Error deleting job.");
        }
      }
    );
  };

  const handleOpenAdd = () => {
    setFormData({
      company: "",
      title: "",
      description: "",
      job_type: "job",
      salary: "",
      location: "",
      is_active: true,
    });
    setEditingJob(null);
    setShowModal(true);
  };

  const handleOpenEdit = (job) => {
    setFormData({
      company: job.company || "",
      title: job.title || "",
      description: job.description || "",
      job_type: job.job_type || "job",
      salary: job.salary || "",
      location: job.location || "",
      is_active: job.is_active,
    });
    setEditingJob(job);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (!formData.company) {
        toast.error("Please select a company.");
        setFormLoading(false);
        return;
      }

      if (editingJob) {
        await api.patch(`jobs/${editingJob.id}/`, formData);
        toast.success("Job updated successfully.");
      } else {
        await api.post("jobs/", formData);
        toast.success("Job added successfully.");
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Error saving job.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.company_name &&
        j.company_name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .jb-root * { box-sizing: border-box; }
        .jb-root { font-family: 'DM Sans', sans-serif; }

        @keyframes jb-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes jb-up   { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes jb-row  { from { opacity: 0; transform: translateX(-5px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes jb-spin { to { transform: rotate(360deg) } }
        
        @keyframes jb-modal-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes jb-modal-up { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }

        .jb-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: jb-row 0.28s ease both;
        }
        .jb-tr:hover { background: rgba(96,165,250,0.04) !important; }
        .jb-tr:last-child { border-bottom: none; }

        .jb-inp {
          width: 100%; padding: 10px 14px 10px 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; color: #e2e8f0;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .jb-inp:focus {
          border-color: rgba(96,165,250,0.4);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.07);
          background: rgba(96,165,250,0.04);
        }
        .jb-inp::placeholder { color: rgba(51,65,85,0.8); }

        .jb-act {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
        }
        .jb-toggle-on  { border: 1px solid rgba(251,191,36,0.22); background: rgba(251,191,36,0.08); color: #fbbf24; }
        .jb-toggle-off { border: 1px solid rgba(34,197,94,0.22);  background: rgba(34,197,94,0.08);  color: #4ade80; }
        .jb-del        { border: 1px solid rgba(239,68,68,0.2);   background: rgba(239,68,68,0.07);  color: #fca5a5; }
        .jb-edit       { border: 1px solid rgba(96,165,250,0.22); background: rgba(96,165,250,0.08); color: #93c5fd; }
        
        .jb-toggle-on:hover  { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.38); }
        .jb-toggle-off:hover { background: rgba(34,197,94,0.15);  border-color: rgba(34,197,94,0.38); }
        .jb-del:hover        { background: rgba(239,68,68,0.14);  border-color: rgba(239,68,68,0.38); }
        .jb-edit:hover       { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.38); }

        .jb-scroll::-webkit-scrollbar { width: 3px; }
        .jb-scroll::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }

        .jb-textarea {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; color: #e2e8f0;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          outline: none; min-height: 100px; resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .jb-textarea:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08) !important;
          background: rgba(96,165,250,0.04) !important;
        }
        
        .jb-select {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; color: #e2e8f0;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .jb-select:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08) !important;
          background: rgba(96,165,250,0.04) !important;
        }
        .jb-select option { background: #0b0f22; color: #e2e8f0; }

        .jb-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff; box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .jb-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
        }
        .jb-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .jb-btn-cancel {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: rgba(100,116,139,0.8); transition: background 0.15s, color 0.15s;
        }
        .jb-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }
      `}</style>

      <div className="jb-root">
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "jb-fade 0.35s ease",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(22px,2.6vw,30px)",
                fontWeight: 400,
                margin: 0,
                color: "#f1f5f9",
                letterSpacing: "-0.4px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Briefcase
                size={22}
                style={{ color: "#fbbf24", flexShrink: 0 }}
              />
              Job Monitoring
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              Review active and inactive jobs across all companies.
            </p>
          </div>
          <div>
            <button className="jb-btn-primary" onClick={handleOpenAdd}>
              <Plus size={15} /> Add Job
            </button>
          </div>
        </div>

        {/* ── Table card ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            overflow: "hidden",
            animation: "jb-up 0.35s ease 0.08s both",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "15px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
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
                placeholder="Search jobs or companies…"
                className="jb-inp"
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
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
                {search && ` · "${search}"`}
              </span>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }} className="jb-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {[
                    "Job Title",
                    "Company",
                    "Location",
                    "Status",
                    "Actions",
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
                        textAlign: i === 4 ? "right" : "left",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        whiteSpace: "nowrap",
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
                      colSpan="5"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Loader2
                        size={28}
                        style={{
                          color: "#60a5fa",
                          animation: "jb-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Briefcase
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
                        No jobs found{search ? ` for "${search}"` : ""}.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job, idx) => (
                    <tr
                      key={job.id}
                      className="jb-tr"
                      style={{ animationDelay: `${idx * 35}ms` }}
                    >
                      {/* Title + Salary + Type */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            letterSpacing: "-0.1px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {job.title}
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                             {job.job_type === "intern" ? "Intern" : "Job"}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            marginTop: 3,
                          }}
                        >
                          <IndianRupee
                            size={10}
                            style={{ color: "rgba(100,116,139,0.5)" }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: "rgba(100,116,139,0.7)",
                            }}
                          >
                            {job.salary}
                          </span>
                        </div>
                      </td>

                      {/* Company */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Building2
                            size={12}
                            style={{
                              color: "rgba(100,116,139,0.45)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.85)",
                            }}
                          >
                            {job.company_name || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <MapPin
                            size={12}
                            style={{
                              color: "rgba(100,116,139,0.45)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.85)",
                            }}
                          >
                            {job.location}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 20px" }}>
                        {job.is_active ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 10px",
                              borderRadius: 20,
                              background: "rgba(34,197,94,0.1)",
                              border: "1px solid rgba(34,197,94,0.2)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "#4ade80",
                              letterSpacing: "0.04em",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "#22c55e",
                                boxShadow: "0 0 5px rgba(34,197,94,0.7)",
                              }}
                            />
                            Active
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 10px",
                              borderRadius: 20,
                              background: "rgba(100,116,139,0.1)",
                              border: "1px solid rgba(100,116,139,0.15)",
                              fontSize: 11,
                              fontWeight: 600,
                              color: "rgba(148,163,184,0.7)",
                              letterSpacing: "0.04em",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "rgba(100,116,139,0.5)",
                              }}
                            />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "13px 20px", textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 6,
                          }}
                        >
                          <button
                            className="jb-act jb-edit"
                            onClick={() => handleOpenEdit(job)}
                            title="Edit"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            className={`jb-act ${job.is_active ? "jb-toggle-on" : "jb-toggle-off"}`}
                            onClick={() => toggleStatus(job)}
                            title={job.is_active ? "Deactivate" : "Activate"}
                          >
                            {job.is_active ? (
                              <Power size={13} />
                            ) : (
                              <Play size={13} />
                            )}
                            {job.is_active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="jb-act jb-del"
                            onClick={() => deleteJob(job.id)}
                            title="Delete"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ ADD / EDIT MODAL ══ */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)} maxWidth={550}>
            <ModalHeader
              icon={editingJob ? <Pencil size={15} /> : <Briefcase size={15} />}
              title={editingJob ? "Edit Job" : "Add New Job"}
              onClose={() => setShowModal(false)}
            />
            <form onSubmit={handleSave}>
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Field label="Company">
                  <select
                    className="jb-select"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select a company...
                    </option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Job Title">
                  <input
                    type="text"
                    required
                    className="jb-inp"
                    style={{ ...inpStyle, paddingLeft: 14 }}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </Field>

                <Field label="Job Type">
                  <select
                    className="jb-select"
                    value={formData.job_type}
                    onChange={(e) =>
                      setFormData({ ...formData, job_type: e.target.value })
                    }
                    required
                  >
                    <option value="job">Job</option>
                    <option value="intern">Internship</option>
                  </select>
                </Field>

                <Field label="Description">
                  <textarea
                    required
                    className="jb-textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Provide a detailed description of the role..."
                  />
                </Field>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <Field label="Salary">
                    <input
                      type="text"
                      required
                      className="jb-inp"
                      style={{ ...inpStyle, paddingLeft: 14 }}
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      placeholder="e.g. ₹ 10,00,000"
                    />
                  </Field>

                  <Field label="Location">
                    <input
                      type="text"
                      required
                      className="jb-inp"
                      style={{ ...inpStyle, paddingLeft: 14 }}
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Remote, India"
                    />
                  </Field>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 6,
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 13.5,
                      color: "#e2e8f0",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "#3b82f6",
                        cursor: "pointer",
                      }}
                    />
                    Is Active
                  </label>
                </div>
              </div>

              <div
                style={{
                  padding: "13px 22px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  className="jb-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="jb-btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "jb-spin 0.8s linear infinite" }}
                      />{" "}
                      Saving…
                    </>
                  ) : (
                    <>
                      {editingJob ? <Pencil size={14} /> : <Plus size={14} />}
                      {editingJob ? "Update Job" : "Create Job"}
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

export default Jobs;
