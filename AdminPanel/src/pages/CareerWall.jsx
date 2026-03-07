import { useState, useEffect } from "react";
import { MessageSquare, Search, Loader2, Trash2, ThumbsUp, X, User, Building2, FileText, Eye } from "lucide-react";
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

const CareerWall = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  });

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/community/admin-thoughts/?page=${page}`;
      if (roleFilter !== "all") url += `&role_type=${roleFilter}`;
      const res = await api.get(url);
      let results = res.data.results || res.data;
      setPosts(results);

      if (res.data.count !== undefined) {
        setPagination({
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          currentPage: page,
          totalPages: Math.ceil(res.data.count / 10),
        });
      }
    } catch (error) {
      console.error("Failed to fetch career wall posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [roleFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Career Wall post?")) return;
    try {
      await api.delete(`/community/admin-thoughts/${id}/`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelectedPost(null);
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const s = search.toLowerCase();
    return (
      (p.user_name || "").toLowerCase().includes(s) ||
      (p.user_email || "").toLowerCase().includes(s) ||
      (p.title || "").toLowerCase().includes(s) ||
      (p.description || "").toLowerCase().includes(s)
    );
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cw-root * { box-sizing: border-box; }
        .cw-root { font-family: 'DM Sans', sans-serif; }
        @keyframes cw-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes cw-up   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes cw-row  { from { opacity:0; transform:translateX(-6px) } to { opacity:1; transform:translateX(0) } }
        @keyframes cw-spin { to { transform:rotate(360deg) } }
        @keyframes cw-modal { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        .cw-tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          animation: cw-row 0.3s ease both;
        }
        .cw-tr:hover { background: rgba(168,85,247,0.04) !important; }
        .cw-tr:last-child { border-bottom: none; }
        .cw-input:focus {
          border-color: rgba(168,85,247,0.4) !important;
          box-shadow: 0 0 0 3px rgba(168,85,247,0.08) !important;
          background: rgba(168,85,247,0.04) !important;
        }
        .cw-input::placeholder { color: rgba(100,116,139,0.5); }
        .cw-scroll::-webkit-scrollbar { height: 3px; }
        .cw-scroll::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.2); border-radius: 99px; }
        .cw-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          animation: cw-fade 0.2s ease;
        }
        .cw-modal-content {
          background: #0f1629; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; width: 100%; max-width: 640px;
          max-height: 85vh; overflow-y: auto;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          animation: cw-modal 0.25s ease;
          margin: 12px;
        }
        .cw-modal-content::-webkit-scrollbar { width: 4px; }
        .cw-modal-content::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.2); border-radius: 99px; }
        @media (max-width: 640px) {
          .cw-modal-content { border-radius: 12px; max-height: 90vh; }
          .cw-modal-overlay { padding: 8px; align-items: flex-end; }
        }
      `}</style>

      <div className="cw-root">
        {/* ── Page Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
            animation: "cw-fade 0.35s ease",
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
              <MessageSquare size={22} style={{ color: "#a855f7", flexShrink: 0 }} />
              Career Wall
            </h1>
            <p
              style={{
                color: "rgba(100,116,139,0.7)",
                fontSize: 13,
                margin: "6px 0 0 32px",
                fontWeight: 300,
              }}
            >
              Manage all community posts, view likes, and moderate content.
            </p>
          </div>

          {/* Stats pills */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 9,
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.2)",
                fontSize: 12,
                fontWeight: 600,
                color: "#c084fc",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <MessageSquare size={14} />
              {pagination.count || posts.length} Posts
            </div>
          </div>
        </div>

        {/* ── Table Container ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            animation: "cw-up 0.35s ease 0.08s both",
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
                placeholder="Search by name, email, title..."
                className="cw-input"
                style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {["all", "student", "company"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
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
                    border:
                      "1px solid " +
                      (roleFilter === role
                        ? "rgba(168,85,247,0.3)"
                        : "rgba(255,255,255,0.05)"),
                    background:
                      roleFilter === role
                        ? "rgba(168,85,247,0.1)"
                        : "rgba(255,255,255,0.02)",
                    color:
                      roleFilter === role
                        ? "#c084fc"
                        : "rgba(100,116,139,0.7)",
                  }}
                >
                  {role === "all" ? "All" : role === "student" ? "Students" : "Companies"}
                </button>
              ))}
            </div>
          </div>

          {/* Table wrapper */}
          <div
            style={{ overflowX: "auto", borderRadius: "0 0 14px 14px" }}
            className="cw-scroll"
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.18)" }}>
                  {["Author", "Title", "Type", "Likes", "Date", "Actions"].map(
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
                          textAlign: i === 5 ? "right" : "left",
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
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
                          color: "#a855f7",
                          animation: "cw-spin 0.8s linear infinite",
                          margin: "0 auto",
                        }}
                      />
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "56px 20px" }}
                    >
                      <MessageSquare
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
                        No Career Wall posts found
                        {search ? ` for "${search}"` : ""}.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post, idx) => (
                    <tr
                      key={post.id}
                      className="cw-tr"
                      style={{ animationDelay: `${idx * 35}ms`, cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Author */}
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                post.role_type === "company"
                                  ? "rgba(16,185,129,0.1)"
                                  : "rgba(99,102,241,0.1)",
                              border:
                                "1px solid " +
                                (post.role_type === "company"
                                  ? "rgba(16,185,129,0.2)"
                                  : "rgba(99,102,241,0.2)"),
                              flexShrink: 0,
                            }}
                          >
                            {post.role_type === "company" ? (
                              <Building2
                                size={14}
                                style={{ color: "#34d399" }}
                              />
                            ) : (
                              <User
                                size={14}
                                style={{ color: "#818cf8" }}
                              />
                            )}
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
                              {post.user_name || "Unknown"}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "rgba(100,116,139,0.7)",
                                marginTop: 2,
                              }}
                            >
                              {post.user_email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            maxWidth: 220,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {post.title}
                        </div>
                      </td>

                      {/* Role Type */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px 4px 8px",
                            borderRadius: 6,
                            background:
                              post.role_type === "company"
                                ? "rgba(16,185,129,0.08)"
                                : "rgba(99,102,241,0.08)",
                            border:
                              "1px solid " +
                              (post.role_type === "company"
                                ? "rgba(16,185,129,0.2)"
                                : "rgba(99,102,241,0.2)"),
                            color:
                              post.role_type === "company"
                                ? "#6ee7b7"
                                : "#a5b4fc",
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background:
                                post.role_type === "company"
                                  ? "#34d399"
                                  : "#818cf8",
                              flexShrink: 0,
                            }}
                          />
                          {post.role_type}
                        </div>
                      </td>

                      {/* Likes */}
                      <td style={{ padding: "13px 20px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: post.likes_count > 0 ? "rgba(244,63,94,0.08)" : "rgba(255,255,255,0.03)",
                            border: "1px solid " + (post.likes_count > 0 ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.06)"),
                            color: post.likes_count > 0 ? "#fda4af" : "rgba(100,116,139,0.6)",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          <ThumbsUp
                            size={12}
                            style={{
                              fill: post.likes_count > 0 ? "#f43f5e" : "none",
                              color: post.likes_count > 0 ? "#f43f5e" : "rgba(100,116,139,0.5)",
                            }}
                          />
                          {post.likes_count}
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: "13px 20px" }}>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: "rgba(100,116,139,0.8)",
                          }}
                        >
                          {new Date(post.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "13px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPost(post);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              cursor: "pointer",
                              transition: "all 0.15s",
                              border: "1px solid rgba(168,85,247,0.3)",
                              background: "rgba(168,85,247,0.1)",
                              color: "#c084fc",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(168,85,247,0.18)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                            }}
                          >
                            <Eye size={12} />
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(post.id);
                            }}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              cursor: "pointer",
                              transition: "all 0.15s",
                              border: "1px solid rgba(239,68,68,0.3)",
                              background: "rgba(239,68,68,0.08)",
                              color: "#fca5a5",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                            }}
                          >
                            <Trash2 size={12} />
                            Delete
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
              animation: "cw-up 0.35s ease 0.12s both",
            }}
          >
            <button
              onClick={() => fetchPosts(pagination.currentPage - 1)}
              disabled={!pagination.previous}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: pagination.previous
                  ? "#e2e8f0"
                  : "rgba(100,116,139,0.4)",
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
              Page{" "}
              <span style={{ color: "#a855f7" }}>
                {pagination.currentPage}
              </span>{" "}
              of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchPosts(pagination.currentPage + 1)}
              disabled={!pagination.next}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: pagination.next
                  ? "#e2e8f0"
                  : "rgba(100,116,139,0.4)",
                cursor: pagination.next ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              Next
            </button>
          </div>
        )}

        {/* ── Detail Modal ── */}
        {selectedPost && (
          <div
            className="cw-modal-overlay"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="cw-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        selectedPost.role_type === "company"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(99,102,241,0.1)",
                      border:
                        "1px solid " +
                        (selectedPost.role_type === "company"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(99,102,241,0.2)"),
                    }}
                  >
                    {selectedPost.role_type === "company" ? (
                      <Building2 size={16} style={{ color: "#34d399" }} />
                    ) : (
                      <User size={16} style={{ color: "#818cf8" }} />
                    )}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#f1f5f9",
                        margin: 0,
                      }}
                    >
                      {selectedPost.user_name}
                    </h2>
                    <p
                      style={{
                        fontSize: 11,
                        color: "rgba(100,116,139,0.7)",
                        margin: "2px 0 0",
                      }}
                    >
                      {selectedPost.user_email} ·{" "}
                      <span style={{ textTransform: "capitalize" }}>
                        {selectedPost.role_type}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer",
                    color: "rgba(100,116,139,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: "24px" }}>
                {/* Title */}
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(71,85,105,0.7)",
                      marginBottom: 6,
                    }}
                  >
                    {selectedPost.role_type === "company"
                      ? "Hiring For"
                      : "Role Interested"}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#c084fc",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {selectedPost.title}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(71,85,105,0.7)",
                      marginBottom: 6,
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "rgba(226,232,240,0.8)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 10,
                      padding: "14px 16px",
                    }}
                  >
                    {selectedPost.description}
                  </div>
                </div>

                {/* Resume */}
                {selectedPost.resume_file && (
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(71,85,105,0.7)",
                        marginBottom: 6,
                      }}
                    >
                      Resume Attachment
                    </div>
                    <a
                      href={selectedPost.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "rgba(168,85,247,0.08)",
                        border: "1px solid rgba(168,85,247,0.2)",
                        color: "#c084fc",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <FileText size={14} />
                      View Resume
                    </a>
                  </div>
                )}

                {/* Date */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(71,85,105,0.7)",
                      marginBottom: 6,
                    }}
                  >
                    Posted On
                  </div>
                  <div style={{ fontSize: 13, color: "#e2e8f0" }}>
                    {new Date(selectedPost.created_at).toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>

                {/* Likes Section */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(71,85,105,0.7)",
                      }}
                    >
                      Likes
                    </div>
                    <div
                      style={{
                        padding: "2px 8px",
                        borderRadius: 5,
                        background: "rgba(244,63,94,0.1)",
                        border: "1px solid rgba(244,63,94,0.2)",
                        color: "#fda4af",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {selectedPost.likes_count}
                    </div>
                  </div>

                  {selectedPost.liked_by &&
                  selectedPost.liked_by.length > 0 ? (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      {selectedPost.liked_by.map((like, i) => (
                        <div
                          key={like.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                            padding: "10px 16px",
                            borderBottom:
                              i < selectedPost.liked_by.length - 1
                                ? "1px solid rgba(255,255,255,0.04)"
                                : "none",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(244,63,94,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 7,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                  like.role === "company"
                                    ? "rgba(16,185,129,0.1)"
                                    : "rgba(99,102,241,0.1)",
                                border:
                                  "1px solid " +
                                  (like.role === "company"
                                    ? "rgba(16,185,129,0.15)"
                                    : "rgba(99,102,241,0.15)"),
                                flexShrink: 0,
                              }}
                            >
                              {like.role === "company" ? (
                                <Building2
                                  size={12}
                                  style={{ color: "#34d399" }}
                                />
                              ) : (
                                <User
                                  size={12}
                                  style={{ color: "#818cf8" }}
                                />
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#e2e8f0",
                                }}
                              >
                                {like.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "rgba(100,116,139,0.6)",
                                  marginTop: 1,
                                }}
                              >
                                {like.email}
                              </div>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              textTransform: "capitalize",
                              color:
                                like.role === "company"
                                  ? "#6ee7b7"
                                  : "#a5b4fc",
                              padding: "3px 8px",
                              borderRadius: 5,
                              background:
                                like.role === "company"
                                  ? "rgba(16,185,129,0.08)"
                                  : "rgba(99,102,241,0.08)",
                              border:
                                "1px solid " +
                                (like.role === "company"
                                  ? "rgba(16,185,129,0.15)"
                                  : "rgba(99,102,241,0.15)"),
                            }}
                          >
                            {like.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 10,
                        color: "rgba(100,116,139,0.6)",
                        fontSize: 13,
                      }}
                    >
                      No likes yet on this post.
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => setSelectedPost(null)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDelete(selectedPost.id)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Trash2 size={14} />
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CareerWall;
