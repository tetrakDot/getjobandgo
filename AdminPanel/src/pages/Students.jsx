import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { confirmAction } from "../utils/confirmToast.jsx";
import {
  Search,
  Loader2,
  Users,
  Eye,
  Trash2,
  Pencil,
  UserPlus,
  X,
  FileText,
  Phone,
  Calendar,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";


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
      animation: "st-fade 0.18s ease",
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
        animation: "st-up 0.22s ease",
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

/* ─── Avatar ─────────────────────────────────────────────── */
const Avatar = ({ name, size = 36 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = ((name || "").charCodeAt(0) * 13) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        flexShrink: 0,
        background: `linear-gradient(135deg, hsl(${hue},55%,38%), hsl(${hue + 35},55%,48%))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: Math.round(size * 0.34),
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "-0.3px",
      }}
    >
      {initials}
    </div>
  );
};

/* ─── Status Tick ────────────────────────────────────────── */
const StatusTick = ({ status, size = 16, style = {} }) => {
  const norm = (status || "pending").toLowerCase();
  if (norm === "verified") {
    return <CheckCircle2 size={size} color="#22c55e" style={style} title="Verified" />;
  }
  if (norm === "rejected") {
    return <XCircle size={size} color="#ef4444" style={style} title="Rejected" />;
  }
  return <Clock size={size} color="#f59e0b" style={style} title="Pending" />;
};

/* ════════════════════════════════════════════════════════════
   STUDENTS PAGE
═══════════════════════════════════════════════════════════ */
const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    skills: "",
    country: "",
    state: "",
    district: "",
    resume: null,
  });
  const [addLoading, setAddLoading] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter !== "All" ? `?verification_status=${filter.toLowerCase()}` : "";
      const res = await api.get(`students/${q}`);
      setStudents(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const deleteStudent = (id) => {
    confirmAction(
      "Are you sure you want to completely remove this student account?",
      async () => {
        try {
          await api.delete(`students/${id}/`);
          setStudents(students.filter((s) => s.id !== id));
          toast.success("Student deleted successfully.");
        } catch {
          toast.error("Error deleting student.");
        }
      }
    );
  };

  const updateStatus = async (id, status) => {
    try {
      if (status === "Verified")
        await api.post(`students/${id}/verify/`);
      else if (status === "Rejected")
        await api.post(`students/${id}/reject/`);
      else
        await api.post(`students/${id}/mark_pending/`);
        
      setStudents(
        students.map((s) =>
          s.id === id ? { ...s, verification_status: status.toLowerCase() } : s,
        ),
      );
      toast.success("Status updated to " + status);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", newStudent.full_name);
      formData.append("email", newStudent.email);
      formData.append("password", newStudent.password);
      formData.append("phone", newStudent.phone_number);
      formData.append("skills", newStudent.skills || "No skills provided yet");
      formData.append("country", newStudent.country);
      formData.append("state", newStudent.state);
      formData.append("district", newStudent.district);
      if (newStudent.resume) formData.append("resume", newStudent.resume);
      await api.post("students/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Student created successfully. Fetching updated list...");
      setShowAddModal(false);
      setNewStudent({
        full_name: "",
        email: "",
        password: "",
        phone_number: "",
        skills: "",
        country: "",
        state: "",
        district: "",
        resume: null,
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.full_name?.[0] ||
          "Error creating student. Check details!",
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", editStudent.full_name);
      formData.append("email", editStudent.email);
      if (editStudent.password)
        formData.append("password", editStudent.password);
      formData.append(
        "phone",
        editStudent.phone_number || editStudent.phone || "",
      );
      formData.append("skills", editStudent.skills || "No skills provided yet");
      formData.append("country", editStudent.country || "");
      formData.append("state", editStudent.state || "");
      formData.append("district", editStudent.district || "");
      if (editStudent.resume instanceof File)
        formData.append("resume", editStudent.resume);
      await api.patch(`students/${editStudent.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Student updated successfully.");
      setShowEditModal(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.full_name?.[0] ||
          "Error updating student. Check details!",
      );
    } finally {
      setEditLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.full_name &&
        s.full_name.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .st-root * { box-sizing: border-box; }
        .st-root { font-family: 'DM Sans', sans-serif; }

        @keyframes st-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes st-up   { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes st-row  { from { opacity: 0; transform: translateX(-6px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes st-spin { to { transform: rotate(360deg) } }

        .st-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: st-row 0.3s ease both;
        }
        .st-tr:hover { background: rgba(96,165,250,0.04) !important; }
        .st-tr:last-child { border-bottom: none; }

        .st-input:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.08) !important;
          background: rgba(96,165,250,0.04) !important;
        }
        .st-input::placeholder { color: rgba(51,65,85,0.8); }
        .st-input::-webkit-file-upload-button {
          background: rgba(96,165,250,0.1);
          border: 1px solid rgba(96,165,250,0.2);
          border-radius: 6px;
          color: #93c5fd;
          padding: 4px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          margin-right: 10px;
        }

        /* Filter buttons */
        .st-filter-btn {
          padding: 6px 14px; border-radius: 7px; border: none;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.01em;
        }
        .st-filter-btn.active {
          background: rgba(96,165,250,0.15);
          border: 1px solid rgba(96,165,250,0.3);
          color: #93c5fd;
        }
        .st-filter-btn:not(.active) {
          background: transparent; border: 1px solid transparent;
          color: rgba(100,116,139,0.7);
        }
        .st-filter-btn:not(.active):hover { background: rgba(255,255,255,0.04); color: #94a3b8; }

        /* Action buttons */
        .st-act {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
        }
        .st-act-view  { border: 1px solid rgba(96,165,250,0.2);  background: rgba(96,165,250,0.08);  color: #93c5fd;  }
        .st-act-edit  { border: 1px solid rgba(250,204,21,0.2);  background: rgba(250,204,21,0.07);  color: #fde047;  }
        .st-act-del   { border: 1px solid rgba(239,68,68,0.2);   background: rgba(239,68,68,0.07);   color: #fca5a5;  }
        .st-act-view:hover { background: rgba(96,165,250,0.15);  border-color: rgba(96,165,250,0.35); }
        .st-act-edit:hover { background: rgba(250,204,21,0.14);  border-color: rgba(250,204,21,0.35); }
        .st-act-del:hover  { background: rgba(239,68,68,0.14);   border-color: rgba(239,68,68,0.35);  }

        /* Primary / cancel btns */
        .st-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.01em;
        }
        .st-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
        }
        .st-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .st-btn-cancel {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 20px; border-radius: 9px;
          font-size: 13.5px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(100,116,139,0.8);
          transition: background 0.15s, color 0.15s;
        }
        .st-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }

        .st-detail-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 14px 16px;
        }

        .st-scroll::-webkit-scrollbar { width: 3px; }
        .st-scroll::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }
      `}</style>

      <div className="st-root">
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "st-fade 0.35s ease",
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
              <Users size={22} style={{ color: "#60a5fa", flexShrink: 0 }} />
              Students
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              View, add, or remove students from the platform.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {/* Filter pills */}
            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 4,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
              }}
            >
              {["All", "Pending", "Verified", "Rejected"].map((s) => (
                <button
                  key={s}
                  className={`st-filter-btn${filter === s ? " active" : ""}`}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              className="st-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            overflow: "hidden",
            animation: "st-up 0.35s ease 0.08s both",
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
                placeholder="Search by name or email…"
                className="st-input"
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
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""}
                {search && ` · "${search}"`}
              </span>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }} className="st-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {["Student", "Joined", "Contact", "Status", "Actions"].map((h, i) => (
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
                        textAlign: h === "Actions" ? "right" : "left",
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
                      colSpan="4"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Loader2
                        size={28}
                        style={{
                          color: "#60a5fa",
                          animation: "st-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Users
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
                        No students found{search ? ` for "${search}"` : ""}.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className="st-tr"
                      style={{ animationDelay: `${idx * 35}ms` }}
                    >
                      {/* Name / Email */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 11,
                          }}
                        >
                          <Avatar name={student.full_name} size={34} />
                          <div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13.5,
                                fontWeight: 600,
                                color: "#e2e8f0",
                                letterSpacing: "-0.1px",
                              }}
                            >
                              {student.full_name || "N/A"}
                              <StatusTick status={student.verification_status} size={14} />
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "rgba(100,116,139,0.7)",
                                marginTop: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Mail size={10} style={{ flexShrink: 0 }} />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Joined */}
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
                            {new Date(student.created_at).toLocaleDateString(
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

                      {/* Contact */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <Phone
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
                            {student.phone || student.phone_number || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 20px" }}>
                        <select
                          value={(student.verification_status || "pending").toLowerCase()}
                          onChange={(e) => {
                            const val = e.target.value;
                            const mapped =
                              val === "verified"
                                ? "Verified"
                                : val === "rejected"
                                  ? "Rejected"
                                  : "Pending";
                            updateStatus(student.id, mapped);
                          }}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#e2e8f0",
                            borderRadius: 6,
                            padding: "4px 8px",
                            fontSize: 11.5,
                            fontWeight: 500,
                            fontFamily: "'DM Sans', sans-serif",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          <option value="pending" style={{background: "#0b0f22"}}>Pending</option>
                          <option value="verified" style={{background: "#0b0f22"}}>Verified</option>
                          <option value="rejected" style={{background: "#0b0f22"}}>Rejected</option>
                        </select>
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
                            className="st-act st-act-view"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            className="st-act st-act-edit"
                            onClick={() => {
                              setEditStudent({ ...student, password: "" });
                              setShowEditModal(true);
                            }}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            className="st-act st-act-del"
                            onClick={() => deleteStudent(student.id)}
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

        {/* ══ ADD MODAL ══ */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <ModalHeader
              icon={<UserPlus size={15} />}
              title="Add Student"
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
                <Field label="Full Name">
                  <input
                    type="text"
                    required
                    className="st-input"
                    style={inputStyle}
                    value={newStudent.full_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        full_name: e.target.value,
                      })
                    }
                    placeholder="e.g. Jane Smith"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    required
                    className="st-input"
                    style={inputStyle}
                    value={newStudent.email}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, email: e.target.value })
                    }
                    placeholder="student@email.com"
                  />
                </Field>
                <Field label="Password">
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="st-input"
                    style={inputStyle}
                    value={newStudent.password}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, password: e.target.value })
                    }
                    placeholder="Min. 8 characters"
                  />
                </Field>
                <Field label="Phone Number (Optional)">
                  <input
                    type="text"
                    className="st-input"
                    style={inputStyle}
                    value={newStudent.phone_number}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        phone_number: e.target.value,
                      })
                    }
                    placeholder="+91 00000 00000"
                  />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Country">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={newStudent.country}
                      onChange={(e) => setNewStudent({ ...newStudent, country: e.target.value })}
                    />
                  </Field>
                  <Field label="State">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={newStudent.state}
                      onChange={(e) => setNewStudent({ ...newStudent, state: e.target.value })}
                    />
                  </Field>
                  <Field label="District">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={newStudent.district}
                      onChange={(e) => setNewStudent({ ...newStudent, district: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Resume">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="st-input"
                    style={{ ...inputStyle, padding: "8px 14px" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 2 * 1024 * 1024) {
                        toast.warning("Resume file must be under 2MB.");
                        e.target.value = "";
                        setNewStudent({ ...newStudent, resume: null });
                        return;
                      }
                      setNewStudent({
                        ...newStudent,
                        resume: file,
                      });
                    }}
                  />
                </Field>
                <Field label="Skills">
                  <textarea
                    className="st-input"
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    placeholder="Comma-separated list of skills"
                    value={newStudent.skills}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, skills: e.target.value })
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
                  className="st-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="st-btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "st-spin 0.8s linear infinite" }}
                      />{" "}
                      Creating…
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} /> Create Student
                    </>
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ══ EDIT MODAL ══ */}
        {showEditModal && editStudent && (
          <Modal onClose={() => setShowEditModal(false)}>
            <ModalHeader
              icon={<Pencil size={15} />}
              title="Edit Student"
              onClose={() => setShowEditModal(false)}
            />
            <form onSubmit={handleUpdate}>
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Field label="Full Name">
                  <input
                    type="text"
                    required
                    className="st-input"
                    style={inputStyle}
                    value={editStudent.full_name || ""}
                    onChange={(e) =>
                      setEditStudent({
                        ...editStudent,
                        full_name: e.target.value,
                      })
                    }
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    required
                    className="st-input"
                    style={inputStyle}
                    value={editStudent.email || ""}
                    onChange={(e) =>
                      setEditStudent({ ...editStudent, email: e.target.value })
                    }
                  />
                </Field>
                <Field label="New Password (Optional)">
                  <input
                    type="password"
                    minLength={8}
                    className="st-input"
                    style={inputStyle}
                    value={editStudent.password || ""}
                    onChange={(e) =>
                      setEditStudent({
                        ...editStudent,
                        password: e.target.value,
                      })
                    }
                    placeholder="Leave blank to keep current"
                  />
                </Field>
                <Field label="Phone Number (Optional)">
                  <input
                    type="text"
                    className="st-input"
                    style={inputStyle}
                    value={editStudent.phone_number || editStudent.phone || ""}
                    onChange={(e) =>
                      setEditStudent({
                        ...editStudent,
                        phone_number: e.target.value,
                      })
                    }
                  />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Country">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={editStudent.country || ""}
                      onChange={(e) => setEditStudent({ ...editStudent, country: e.target.value })}
                    />
                  </Field>
                  <Field label="State">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={editStudent.state || ""}
                      onChange={(e) => setEditStudent({ ...editStudent, state: e.target.value })}
                    />
                  </Field>
                  <Field label="District">
                    <input
                      type="text"
                      className="st-input"
                      style={inputStyle}
                      value={editStudent.district || ""}
                      onChange={(e) => setEditStudent({ ...editStudent, district: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Resume (Optional)">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="st-input"
                    style={{ ...inputStyle, padding: "8px 14px" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 2 * 1024 * 1024) {
                        toast.warning("Resume file must be under 2MB.");
                        e.target.value = "";
                        setEditStudent({ ...editStudent, resume: null });
                        return;
                      }
                      setEditStudent({
                        ...editStudent,
                        resume: file,
                      });
                    }}
                  />
                  {editStudent.resume &&
                    typeof editStudent.resume === "string" && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "#93c5fd",
                          marginTop: 5,
                          display: "block",
                        }}
                      >
                        Current: {editStudent.resume.split("/").pop()}
                      </span>
                    )}
                </Field>
                <Field label="Skills">
                  <textarea
                    className="st-input"
                    rows={3}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                    value={editStudent.skills || ""}
                    onChange={(e) =>
                      setEditStudent({ ...editStudent, skills: e.target.value })
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
                  className="st-btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="st-btn-primary"
                  disabled={editLoading}
                >
                  {editLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "st-spin 0.8s linear infinite" }}
                      />{" "}
                      Updating…
                    </>
                  ) : (
                    <>
                      <Pencil size={14} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ══ DETAILS MODAL ══ */}
        {showDetailsModal && selectedStudent && (
          <Modal onClose={() => setShowDetailsModal(false)}>
            <ModalHeader
              icon={<Users size={15} />}
              title="Student Details"
              onClose={() => setShowDetailsModal(false)}
            />
            <div
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Hero row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: "rgba(96,165,250,0.06)",
                  border: "1px solid rgba(96,165,250,0.12)",
                  borderRadius: 11,
                }}
              >
                <Avatar name={selectedStudent.full_name} size={48} />
                <div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#f1f5f9",
                      letterSpacing: "-0.3px",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {selectedStudent.full_name || "N/A"}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "rgba(100,116,139,0.7)",
                      marginTop: 3,
                    }}
                  >
                    {selectedStudent.email}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <div className="st-detail-row">
                  <div
                    style={{
                      ...labelStyle,
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Phone size={9} /> Phone
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#cbd5e1",
                    }}
                  >
                    {selectedStudent.phone ||
                      selectedStudent.phone_number ||
                      "—"}
                  </p>
                </div>
                <div className="st-detail-row">
                  <div
                    style={{
                      ...labelStyle,
                      marginBottom: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Calendar size={9} /> Joined
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#cbd5e1",
                    }}
                  >
                    {new Date(selectedStudent.created_at).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </p>
                </div>
                <div className="st-detail-row" style={{ gridColumn: "1 / -1" }}>
                  <div style={{ ...labelStyle, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>Location</div>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#cbd5e1" }}>
                    {`${selectedStudent.country || "—"}, ${selectedStudent.state || "—"}, ${selectedStudent.district || "—"}`}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="st-detail-row">
                <div style={{ ...labelStyle, marginBottom: 8 }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {(selectedStudent.skills || "No skills provided")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          background: "rgba(96,165,250,0.1)",
                          border: "1px solid rgba(96,165,250,0.2)",
                          color: "#93c5fd",
                          borderRadius: 5,
                          padding: "3px 9px",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>

              {/* Resume */}
              <div className="st-detail-row">
                <div
                  style={{
                    ...labelStyle,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FileText size={9} /> Resume
                </div>
                {selectedStudent.resume ? (
                  <a
                    href={selectedStudent.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#93c5fd",
                      background: "rgba(96,165,250,0.08)",
                      border: "1px solid rgba(96,165,250,0.18)",
                      borderRadius: 7,
                      padding: "6px 13px",
                      textDecoration: "none",
                    }}
                  >
                    <FileText size={13} /> View Resume
                  </a>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "rgba(71,85,105,0.7)",
                      fontStyle: "italic",
                    }}
                  >
                    No resume uploaded
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                padding: "13px 22px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="st-btn-cancel"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Students;
