import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { confirmAction } from "../utils/confirmToast.jsx";
import {
  Search,
  X,
  FileBadge,
  FileText,
  Loader2,
  Eye,
  Building2,
  Trash2,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

/* ─── Shared input style ─────────────────────────────────── */
const inp = {
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

const lbl = {
  display: "block",
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "rgba(100,116,139,0.7)",
  marginBottom: 7,
  fontFamily: "'DM Sans', sans-serif",
};

/* ─── Modal shell ────────────────────────────────────────── */
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
      animation: "co-fade 0.18s ease",
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
        animation: "co-up 0.22s ease",
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

/* ─── Status badge ────────────────────────────────────────── */
const statusMap = {
  verified: {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
    color: "#4ade80",
    dot: "#22c55e",
  },
  pending: {
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    color: "#fbbf24",
    dot: "#f59e0b",
  },
  rejected: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    color: "#fca5a5",
    dot: "#ef4444",
  },
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

const StatusPill = ({ status }) => {
  const s = statusMap[status?.toLowerCase()] || statusMap.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        letterSpacing: "0.04em",
        textTransform: "capitalize",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
};

/* ─── Field ──────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label style={lbl}>{label}</label>
    {children}
  </div>
);

/* ════════════════════════════════════════════════════════════
   COMPANIES PAGE
═══════════════════════════════════════════════════════════ */
const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    email: "",
    password: "",
    phone: "",
    company_type: "Enterprise",
    country: "",
    state: "",
    district: "",
    gst_number: "",
    cin_number: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const q =
        filter !== "All" ? `?verification_status=${filter.toLowerCase()}` : "";
      const res = await api.get(`companies/${q}`);
      setCompanies(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const updateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      if (status === "Verified")
        await api.post(`companies/${id}/verify/`, { admin_remarks: remarks });
      else if (status === "Rejected")
        await api.post(`companies/${id}/reject/`, { admin_remarks: remarks });
      else
        await api.post(`companies/${id}/mark_pending/`, {
          admin_remarks: remarks,
        });
      setCompanies(
        companies.map((c) =>
          c.id === id ? { ...c, verification_status: status.toLowerCase() } : c,
        ),
      );
      setSelectedCompany(null);
      setRemarks("");
      toast.success("Status updated successfully.");
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCompany = (id) => {
    confirmAction(
      "Are you sure you want to permanently delete this company? All their jobs will be removed.",
      async () => {
        try {
          await api.delete(`companies/${id}/`);
          setCompanies(companies.filter((c) => c.id !== id));
          toast.success("Company deleted successfully.");
        } catch (err) {
          console.error("Failed to delete company:", err);
          toast.error("Error deleting company");
        }
      }
    );
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append("company_name", newCompany.company_name);
      formData.append("email", newCompany.email);
      formData.append("password", newCompany.password);
      formData.append("phone", newCompany.phone);
      formData.append("company_type", newCompany.company_type);
      formData.append("country", newCompany.country);
      formData.append("state", newCompany.state);
      formData.append("district", newCompany.district);
      formData.append(
        "gst_number",
        newCompany.gst_number ||
          `GST_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      );
      formData.append(
        "cin_number",
        newCompany.cin_number ||
          `CIN_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      );
      await api.post("companies/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Company created successfully. Fetching updated list...");
      setShowAddModal(false);
      setNewCompany({
        company_name: "",
        email: "",
        password: "",
        phone: "",
        company_type: "Enterprise",
        country: "",
        state: "",
        district: "",
        gst_number: "",
        cin_number: "",
      });
      fetchCompanies();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.email?.[0] ||
          err.response?.data?.phone?.[0] ||
          err.response?.data?.gst_number?.[0] ||
          err.response?.data?.cin_number?.[0] ||
          err.response?.data?.detail ||
          err.response?.data?.company_name?.[0] ||
          "Error creating company. Check details!",
      );
    } finally {
      setAddLoading(false);
    }
  };

  const StatusSelect = ({ company }) => {
    const norm = company.verification_status?.toLowerCase() || "pending";
    const s = statusMap[norm] || statusMap.pending;
    return (
      <select
        value={norm}
        onChange={(e) => {
          const val = e.target.value;
          const mapped =
            val === "verified"
              ? "Verified"
              : val === "rejected"
                ? "Rejected"
                : "Pending";
          updateStatus(company.id, mapped);
        }}
        disabled={actionLoading}
        style={{
          background: s.bg,
          border: `1px solid ${s.border}`,
          color: s.color,
          borderRadius: 20,
          padding: "3px 10px 3px 26px",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.04em",
          cursor: "pointer",
          outline: "none",
          backgroundImage: `radial-gradient(circle at 10px 50%, ${s.dot} 2.5px, transparent 2.5px)`,
          backgroundRepeat: "no-repeat",
          appearance: "none",
          WebkitAppearance: "none",
          paddingRight: 14,
        }}
      >
        <option
          value="pending"
          style={{ background: "#0b0f22", color: "#e2e8f0" }}
        >
          Pending
        </option>
        <option
          value="verified"
          style={{ background: "#0b0f22", color: "#e2e8f0" }}
        >
          Verified
        </option>
        <option
          value="rejected"
          style={{ background: "#0b0f22", color: "#e2e8f0" }}
        >
          Rejected
        </option>
      </select>
    );
  };

  const filtered = companies.filter(
    (c) =>
      !search ||
      c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .co-root * { box-sizing: border-box; }
        .co-root { font-family: 'DM Sans', sans-serif; }

        @keyframes co-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes co-up   { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes co-row  { from { opacity: 0; transform: translateX(-5px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes co-spin { to { transform: rotate(360deg) } }

        .co-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: co-row 0.28s ease both;
        }
        .co-tr:hover { background: rgba(96,165,250,0.04) !important; }
        .co-tr:last-child { border-bottom: none; }

        .co-inp:focus {
          border-color: rgba(96,165,250,0.4) !important;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.07) !important;
          background: rgba(96,165,250,0.04) !important;
        }
        .co-inp::placeholder { color: rgba(51,65,85,0.8); }

        .co-filter-btn {
          padding: 6px 14px; border-radius: 7px; border: none;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.01em;
        }
        .co-filter-btn.active {
          background: rgba(96,165,250,0.15);
          border: 1px solid rgba(96,165,250,0.3);
          color: #93c5fd;
        }
        .co-filter-btn:not(.active) {
          background: transparent; border: 1px solid transparent;
          color: rgba(100,116,139,0.7);
        }
        .co-filter-btn:not(.active):hover { background: rgba(255,255,255,0.04); color: #94a3b8; }

        .co-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer; border: none;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #fff; box-shadow: 0 4px 16px rgba(99,102,241,0.28);
          transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
          letter-spacing: 0.01em;
        }
        .co-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(99,102,241,0.38); }
        .co-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .co-btn-cancel {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px; border-radius: 9px;
          font-size: 13px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: rgba(100,116,139,0.8); transition: background 0.15s, color 0.15s;
        }
        .co-btn-cancel:hover { background: rgba(255,255,255,0.07); color: #94a3b8; }

        .co-act {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px; border-radius: 7px;
          font-size: 12px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
        }
        .co-act-view { border: 1px solid rgba(96,165,250,0.2); background: rgba(96,165,250,0.08); color: #93c5fd; }
        .co-act-del  { border: 1px solid rgba(239,68,68,0.2);  background: rgba(239,68,68,0.07);  color: #fca5a5; }
        .co-act-view:hover { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.35); }
        .co-act-del:hover  { background: rgba(239,68,68,0.14);  border-color: rgba(239,68,68,0.35); }

        .co-type-chip {
          display: inline-block;
          padding: 2px 8px; border-radius: 5px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 11px; font-weight: 500;
          color: rgba(148,163,184,0.8);
        }

        .co-detail-row {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; padding: 13px 15px;
        }

        .co-doc-card {
          display: flex; flex-direction: column; gap: 6px;
          padding: 13px 14px; border-radius: 9px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .co-doc-card:hover { background: rgba(96,165,250,0.06); border-color: rgba(96,165,250,0.2); }

        .co-scroll::-webkit-scrollbar { width: 3px; }
        .co-scroll::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }

        .co-select-inline {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px; padding: 10px 14px;
          color: #e2e8f0; font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          outline: none; width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .co-select-inline:focus { border-color: rgba(96,165,250,0.4); box-shadow: 0 0 0 3px rgba(96,165,250,0.07); }
        .co-select-inline option { background: #0b0f22; }
      `}</style>

      <div className="co-root">
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "co-fade 0.35s ease",
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
              <Building2
                size={22}
                style={{ color: "#60a5fa", flexShrink: 0 }}
              />
              Companies
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              Review and verify employer registrations.
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
                  className={`co-filter-btn${filter === s ? " active" : ""}`}
                  onClick={() => setFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              className="co-btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={15} /> Add Company
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
            animation: "co-up 0.35s ease 0.08s both",
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
                placeholder="Search companies…"
                className="co-inp"
                style={{ ...inp, paddingLeft: 36, fontSize: 13 }}
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
                {filtered.length} compan{filtered.length !== 1 ? "ies" : "y"}
                {search && ` · "${search}"`}
              </span>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }} className="co-scroll">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {["Company", "Type", "GST / CIN", "Status", "Actions"].map(
                    (h, i) => (
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
                    ),
                  )}
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
                          animation: "co-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Building2
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
                        No companies found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((company, idx) => (
                    <tr
                      key={company.id}
                      className="co-tr"
                      style={{ animationDelay: `${idx * 35}ms` }}
                    >
                      <td style={{ padding: "13px 20px" }}>
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
                          {company.company_name}
                          <StatusTick status={company.verification_status} size={14} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 3,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 12,
                              color: "rgba(100,116,139,0.7)",
                            }}
                          >
                            <Mail size={10} />
                            {company.email}
                          </span>
                          {company.phone && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 12,
                                color: "rgba(100,116,139,0.7)",
                              }}
                            >
                              · <Phone size={10} />
                              {company.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span className="co-type-chip">
                          {company.company_type}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontFamily: "monospace",
                            color: "rgba(148,163,184,0.7)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {company.GST_number || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <StatusSelect company={company} />
                      </td>
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
                            className="co-act co-act-view"
                            onClick={() => setSelectedCompany(company)}
                          >
                            <Eye size={13} /> Review
                          </button>
                          <button
                            className="co-act co-act-del"
                            onClick={() => deleteCompany(company.id)}
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

        {/* ══ REVIEW MODAL ══ */}
        {selectedCompany && (
          <Modal onClose={() => setSelectedCompany(null)} maxWidth={600}>
            <ModalHeader
              icon={<Building2 size={15} />}
              title={selectedCompany.company_name}
              onClose={() => setSelectedCompany(null)}
            />
            <div
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
              className="co-scroll"
            >
              {/* Hero row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
                    {selectedCompany.company_name}
                  </span>
                  <StatusTick status={selectedCompany.verification_status} size={20} />
                </div>
              </div>

              {/* Status row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ ...lbl, margin: 0 }}>Current Status</span>
                <StatusSelect company={selectedCompany} />
              </div>

              {/* Info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { label: "Email", value: selectedCompany.email },
                  { label: "Phone", value: selectedCompany.phone || "—" },
                  {
                    label: "GST Number",
                    value: selectedCompany.GST_number || "—",
                  },
                  {
                    label: "Location",
                    value: `${selectedCompany.country || "—"}, ${selectedCompany.state || "—"}, ${selectedCompany.district || "—"}`,
                  },
                  {
                    label: "Company Type",
                    value: selectedCompany.company_type,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="co-detail-row">
                    <div style={{ ...lbl, marginBottom: 5 }}>{label}</div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#cbd5e1",
                        wordBreak: "break-all",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <div
                  style={{
                    ...lbl,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FileBadge size={11} /> Uploaded Documents
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {[
                    "Incorporation Certificate",
                    "PAN Document",
                    "Founder ID",
                    "Registration Proof",
                  ].map((doc) => (
                    <a key={doc} href="#" className="co-doc-card">
                      <FileText
                        size={18}
                        style={{ color: "rgba(100,116,139,0.5)" }}
                      />
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 500,
                          color: "#cbd5e1",
                        }}
                      >
                        {doc}
                      </span>
                      <span style={{ fontSize: 11, color: "#93c5fd" }}>
                        View →
                      </span>
                    </a>
                  ))}
                </div>
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
                className="co-btn-cancel"
                onClick={() => setSelectedCompany(null)}
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {/* ══ ADD COMPANY MODAL ══ */}
        {showAddModal && (
          <Modal onClose={() => setShowAddModal(false)}>
            <ModalHeader
              icon={<Building2 size={15} />}
              title="Add Company"
              onClose={() => setShowAddModal(false)}
            />
            <form onSubmit={handleCreateCompany}>
              <div
                style={{
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <Field label="Company Name">
                  <input
                    type="text"
                    required
                    className="co-inp"
                    style={inp}
                    value={newCompany.company_name}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        company_name: e.target.value,
                      })
                    }
                    placeholder="Acme Corp."
                  />
                </Field>
                <Field label="Company Email">
                  <input
                    type="email"
                    required
                    className="co-inp"
                    style={inp}
                    value={newCompany.email}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, email: e.target.value })
                    }
                    placeholder="hr@company.com"
                  />
                </Field>
                <Field label="Password">
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="co-inp"
                    style={inp}
                    value={newCompany.password}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, password: e.target.value })
                    }
                    placeholder="Min. 8 characters"
                  />
                </Field>
                <Field label="Phone Number (Optional)">
                  <input
                    type="text"
                    className="co-inp"
                    style={inp}
                    value={newCompany.phone}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, phone: e.target.value })
                    }
                    placeholder="+91 00000 00000"
                  />
                </Field>
                <Field label="Company Type">
                  <select
                    className="co-select-inline"
                    value={newCompany.company_type}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        company_type: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>Select company type</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Startup">Startup</option>
                    <option value="SME">SME</option>
                    <option value="MNC">MNC</option>
                  </select>
                </Field>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="Country">
                    <input
                      type="text"
                      className="co-inp"
                      style={inp}
                      value={newCompany.country}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          country: e.target.value,
                        })
                      }
                      placeholder="Country"
                    />
                  </Field>
                  <Field label="State">
                    <input
                      type="text"
                      className="co-inp"
                      style={inp}
                      value={newCompany.state}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          state: e.target.value,
                        })
                      }
                      placeholder="State"
                    />
                  </Field>
                  <Field label="District">
                    <input
                      type="text"
                      className="co-inp"
                      style={inp}
                      value={newCompany.district}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          district: e.target.value,
                        })
                      }
                      placeholder="District"
                    />
                  </Field>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="GST Number (Optional)">
                    <input
                      type="text"
                      className="co-inp"
                      style={inp}
                      placeholder="Auto-generated if empty"
                      value={newCompany.gst_number}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          gst_number: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="CIN Number (Optional)">
                    <input
                      type="text"
                      className="co-inp"
                      style={inp}
                      placeholder="Auto-generated if empty"
                      value={newCompany.cin_number}
                      onChange={(e) =>
                        setNewCompany({
                          ...newCompany,
                          cin_number: e.target.value,
                        })
                      }
                    />
                  </Field>
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
                  className="co-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="co-btn-primary"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: "co-spin 0.8s linear infinite" }}
                      />{" "}
                      Creating…
                    </>
                  ) : (
                    <>
                      <Building2 size={14} /> Create Company
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

export default Companies;
