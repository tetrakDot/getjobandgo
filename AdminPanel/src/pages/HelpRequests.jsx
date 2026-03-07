import { useState, useEffect } from "react";
import { LifeBuoy, Search, Loader2, Eye, Trash2, X, CheckCircle2, Clock } from "lucide-react";
import api from "../services/api";
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

const HelpRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const helpRes = await api.get(`/help/?page=${page}`);
      let results = helpRes.data.results || helpRes.data;
      setRequests(results);
      
      if (helpRes.data.count) {
        setPagination({
          count: helpRes.data.count,
          next: helpRes.data.next,
          previous: helpRes.data.previous,
          currentPage: page,
          totalPages: Math.ceil(helpRes.data.count / 10),
        });
      }
    } catch (error) {
      console.error("Failed to fetch help requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const toggleResolution = async (id, currentStatus) => {
    try {
      await api.patch(`/help/${id}/`, { is_resolved: !currentStatus });
      setRequests((prev) => 
        prev.map((req) => req.id === id ? { ...req, is_resolved: !currentStatus } : req)
      );
      toast.success(`Request marked as ${!currentStatus ? 'Resolved' : 'Pending'}!`);
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, is_resolved: !currentStatus });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this help request? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/help/${id}/`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
      toast.success("Request deleted successfully.");
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" ? true : statusFilter === "resolved" ? r.is_resolved : !r.is_resolved;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .hr-root * { box-sizing: border-box; }
        .hr-root { font-family: 'DM Sans', sans-serif; }
        @keyframes hr-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes hr-up   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes hr-row  { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:translateX(0) } }
        @keyframes hr-spin { to { transform:rotate(360deg) } }
        @keyframes hr-pop  { from { opacity:0; transform:scale(0.95) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        
        .hr-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: hr-row 0.3s ease both;
        }
        .hr-tr:hover { background: rgba(14,165,233,0.04) !important; }
        .hr-tr:last-child { border-bottom: none; }
        .hr-input:focus {
          border-color: rgba(14,165,233,0.4) !important;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.08) !important;
          background: rgba(14,165,233,0.04) !important;
        }
        .hr-input::placeholder { color: rgba(100,116,139,0.5); }
        .hr-scroll::-webkit-scrollbar { height: 3px; }
        .hr-scroll::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.2); border-radius: 99px; }
        
        .action-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          alignItems: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          color: rgba(100,116,139,0.7);
        }
        .view-btn:hover { background: rgba(14,165,233,0.1); border-color: rgba(14,165,233,0.2); color: #0ea5e9; }
        .resolve-btn:hover { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.2); color: #10b981; }
        .delete-btn:hover { background: rgba(244,63,94,0.1); border-color: rgba(244,63,94,0.2); color: #f43f5e; }
      `}</style>
      
      <div className="hr-root">
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "hr-fade 0.35s ease",
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
              <LifeBuoy size={22} style={{ color: "#0ea5e9", flexShrink: 0 }} />
              Help Requests
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              Monitor and resolve user support tickets across the platform.
            </p>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            animation: "hr-up 0.35s ease 0.08s both",
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
            <div style={{ position: "relative", width: 280, maxWidth: "100%" }}>
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
                placeholder="Search by name, email..."
                className="hr-input"
                style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {["all", "pending", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border: "1px solid " + (statusFilter === status ? "rgba(14,165,233,0.3)" : "rgba(255,255,255,0.05)"),
                    background: statusFilter === status ? "rgba(14,165,233,0.1)" : "rgba(255,255,255,0.02)",
                    color: statusFilter === status ? "#38bdf8" : "rgba(100,116,139,0.7)",
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table wrapper */}
          <div
            style={{ overflowX: "auto", borderRadius: "0 0 14px 14px" }}
            className="hr-scroll"
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {["User", "Description", "Date", "Status", "Action"].map((h, i) => (
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
                      colSpan="5"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <Loader2
                        size={28}
                        style={{
                          color: "#0ea5e9",
                          animation: "hr-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <LifeBuoy
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
                        No help requests found{search ? ` for "${search}"` : ""}.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req, idx) => (
                    <tr
                      key={req.id}
                      className="hr-tr"
                      style={{ animationDelay: `${idx * 35}ms` }}
                    >
                      {/* Name / Email */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            letterSpacing: "-0.1px",
                          }}
                        >
                          {req.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "rgba(100,116,139,0.7)",
                            marginTop: 2,
                          }}
                        >
                          {req.email}
                        </div>
                      </td>

                      {/* Description */}
                      <td style={{ padding: "13px 20px" }}>
                        <p
                          style={{
                            fontSize: 12.5,
                            color: "rgba(100,116,139,0.8)",
                            margin: 0,
                            maxWidth: 340,
                            lineHeight: 1.4,
                          }}
                          title={req.description}
                        >
                          {req.description.length > 90 ? req.description.slice(0, 90) + '...' : req.description}
                        </p>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "13px 20px" }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: "rgba(100,116,139,0.8)",
                          }}
                        >
                          {new Date(req.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "13px 20px" }}>
                        {req.is_resolved ? (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "4px 10px 4px 8px",
                              borderRadius: 6,
                              background: "rgba(52,211,153,0.08)",
                              border: "1px solid rgba(52,211,153,0.2)",
                              color: "#6ee7b7",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                            Resolved
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "4px 10px 4px 8px",
                              borderRadius: 6,
                              background: "rgba(251,191,36,0.08)",
                              border: "1px solid rgba(251,191,36,0.2)",
                              color: "#fcd34d",
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", flexShrink: 0 }} />
                            Pending
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "13px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
                          <button 
                            className="action-btn view-btn"
                            title="View Details"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button 
                            className="action-btn resolve-btn"
                            title={req.is_resolved ? "Reopen Request" : "Mark as Resolved"}
                            onClick={() => toggleResolution(req.id, req.is_resolved)}
                          >
                            {req.is_resolved ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                          
                          <button 
                            className="action-btn delete-btn"
                            title="Delete Request"
                            onClick={() => deleteRequest(req.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={16} />
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

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              padding: "0 4px",
              animation: "hr-up 0.35s ease 0.12s both",
            }}
          >
            <button
              onClick={() => fetchRequests(pagination.currentPage - 1)}
              disabled={!pagination.previous}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: pagination.previous ? "#e2e8f0" : "rgba(100,116,139,0.4)",
                cursor: pagination.previous ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              Prev
            </button>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(100,116,139,0.7)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Page <span style={{ color: "#0ea5e9" }}>{pagination.currentPage}</span> of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRequests(pagination.currentPage + 1)}
              disabled={!pagination.next}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: pagination.next ? "#e2e8f0" : "rgba(100,116,139,0.4)",
                cursor: pagination.next ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* ── Detail Modal ── */}
        {selectedRequest && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 20,
              animation: "hr-fade 0.2s ease",
            }}
            onClick={() => setSelectedRequest(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 480,
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: 32,
                position: "relative",
                animation: "hr-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "none",
                  borderRadius: "50%",
                  padding: 6,
                  color: "rgba(100,116,139,0.6)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(14,165,233,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0ea5e9" }}>
                  <LifeBuoy size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#f1f5f9", fontFamily: "'Instrument Serif', serif" }}>Help Request Details</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 700, color: "rgba(100,116,139,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ticket ID: {selectedRequest.id.slice(0,8)}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "rgba(100,116,139,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>User Info</label>
                  <p style={{ margin: 0, fontSize: 14, color: "#e2e8f0", fontWeight: 600 }}>{selectedRequest.name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(14,165,233,0.8)" }}>{selectedRequest.email}</p>
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "rgba(100,116,139,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Status & Date</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "rgba(100,116,139,0.8)" }}>{new Date(selectedRequest.created_at).toLocaleString()}</span>
                    <span style={{ color: "rgba(255,255,255,0.05)" }}>•</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: selectedRequest.is_resolved ? "#10b981" : "#fbbf24" }}>{selectedRequest.is_resolved ? "RESOLVED" : "PENDING"}</span>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: 16 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 800, color: "rgba(100,116,139,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Message Body</label>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {selectedRequest.description}
                  </p>
                </div>

                <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
                  <button 
                    onClick={() => toggleResolution(selectedRequest.id, selectedRequest.is_resolved)}
                    style={{ flex: 1, padding: "12px", borderRadius: 10, background: selectedRequest.is_resolved ? "transparent" : "#0ea5e9", border: selectedRequest.is_resolved ? "1px solid rgba(14,165,233,0.3)" : "none", color: selectedRequest.is_resolved ? "#0ea5e9" : "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    {selectedRequest.is_resolved ? "Reopen Request" : "Resolve Request"}
                  </button>
                  <button 
                    onClick={() => { if(window.confirm("Delete this request?")) { deleteRequest(selectedRequest.id); setSelectedRequest(null); } }}
                    style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.1)", color: "#f43f5e", cursor: "pointer" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HelpRequests;
