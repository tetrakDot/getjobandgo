import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  User,
  Building2,
  FileText,
  Briefcase,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Filter,
  Send,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiClient } from "../services/apiClient";
import SEO from "../SEO";
import { toast } from "react-toastify";

function CareerWallPage() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("recent");
  const [accessDenied, setAccessDenied] = useState(false); // not verified or not logged in

  const [activeTab, setActiveTab] = useState("feed");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn = !!user;

  const fetchPosts = async () => {
    if (!isLoggedIn) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setAccessDenied(false);
    try {
      let url = "/community/thoughts/";
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("role_type", filter);
      }
      
      const res = await apiClient.get(`${url}?${params.toString()}`);
      let fetchedPosts = res.data.results || res.data;
      
      // Client-side sorting as a fallback if backend doesn't support order_by
      if (sortBy === "top") {
        fetchedPosts = [...fetchedPosts].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      } else {
        fetchedPosts = [...fetchedPosts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      setPosts(fetchedPosts);
      setAccessDenied(false);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setAccessDenied(true);
      } else {
        toast.error("Failed to load Career Wall");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter, sortBy, user]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to post on the Career Wall.");
      return;
    }
    if (!description || !title) {
      toast.error("Please provide a description and job role.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (resumeFile) {
        formData.append("resume_file", resumeFile);
      }

      await apiClient.post("/community/thoughts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Successfully posted to Career Wall!");
      setDescription("");
      setTitle("");
      setResumeFile(null);
      setActiveTab("feed");
      fetchPosts();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        toast.error("Your account must be verified to post.");
      } else {
        toast.error("Failed to create post.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) {
      toast.error("Please login to like a post.");
      return;
    }
    
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          is_liked: !p.is_liked, 
          likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 
        };
      }
      return p;
    }));

    try {
      await apiClient.post(`/community/thoughts/${postId}/toggle_like/`);
    } catch (e) {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { 
            ...p, 
            is_liked: !p.is_liked, 
            likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 
          };
        }
        return p;
      }));
      toast.error("Failed to update like status.");
    }
  };

  /* ─── Access Gate UI ─── */
  const renderAccessGate = () => (
    <div className="text-center py-12 sm:py-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="max-w-lg mx-auto bg-white rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-primary-100">
          {!isLoggedIn ? <User size={28} className="text-primary-600" /> : <ShieldCheck size={28} className="text-primary-600" />}
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mb-3 sm:mb-4">
          {!isLoggedIn ? "Login Required" : "Verification Required"}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed">
          {!isLoggedIn 
            ? "You must be logged in to access the Career Wall. Please login or create an account to view and share posts."
            : "Your account must be verified by our admin team before you can access the Career Wall. Please wait for verification or contact support."
          }
        </p>
        {!isLoggedIn ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/auth/login"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-[#27187E] text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest shadow-xl shadow-[#27187E]/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <User size={15} /> Login
            </Link>
            <Link
              to="/auth/register"
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-slate-50 text-[#27187E] font-black text-[11px] sm:text-[12px] uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              Create Account
            </Link>
          </div>
        ) : (
          <Link
            to={user.role === "company" ? "/company/dashboard" : "/student/dashboard"}
            className="inline-flex items-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-[#27187E] text-white font-black text-[11px] sm:text-[12px] uppercase tracking-widest shadow-xl shadow-[#27187E]/20 hover:bg-primary-600 transition-all"
          >
            Go to Dashboard <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title="Career Wall | GetJobAndGo"
        description="Share your resume, job interest, and hiring requirements on our community-driven Career Wall."
        canonical="https://getjobandgo.com/career-wall"
      />

      <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-primary-500/10 selection:text-primary-700">
        {/* ─── Navigation Bar ─── */}
        <nav className="border-b border-slate-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 h-[72px] sm:h-[80px] md:h-[88px] flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="Get Job And Go Logo"
                  draggable="false"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain rounded-lg select-none"
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-serif font-black tracking-tight text-[#27187E]">
                GetJob<span className="text-primary-500 italic relative">AndGo</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
                <Link to="/" className="text-slate-400 hover:text-[#27187E] transition-colors">Home</Link>
                <Link
                  to="/about"
                  className="text-slate-400 hover:text-[#27187E] transition-colors"
                >
                  About
                </Link>
                <Link to="/career-wall" className="text-[#27187E]">Career Wall</Link>
                <Link to="/2ex" className="text-slate-400 hover:text-[#27187E] transition-colors">2eX AI</Link>
                <Link to="/jobs" className="text-slate-400 hover:text-[#27187E] transition-colors">Opportunities</Link>
                <Link to="/help" className="text-slate-400 hover:text-[#27187E] transition-colors">Need Help?</Link>
              </div>

              {user ? (
                <Link
                  to={user.role === "company" ? "/company/dashboard" : "/student/dashboard"}
                  className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <div className="flex items-center gap-4 pl-10 border-l border-slate-100 h-10">
                   <Link to="/auth/login" className="px-6 py-3.5 rounded-full text-slate-500 hover:text-[#27187E] hover:bg-slate-50 transition-all font-black text-[11px] uppercase tracking-widest">Login</Link>
                   <Link to="/auth/register" className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 font-black text-[11px] uppercase tracking-widest">Start Free</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 text-[#27187E] hover:bg-primary-50 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          
          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-[72px] sm:top-[80px] md:top-[88px] inset-x-0 h-[calc(100vh-72px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-88px)] bg-white/95 backdrop-blur-2xl flex flex-col pt-6 sm:pt-8 animate-in slide-in-from-top-4 duration-300 z-50 px-5 sm:px-6 pb-12 overflow-y-auto">
              <div className="flex flex-col gap-6 sm:gap-8 text-sm font-black uppercase tracking-widest pb-8 sm:pb-10 border-b border-slate-100">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-400 flex items-center justify-between">Home <ChevronRight size={16} className="opacity-50" /></Link>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-[#27187E] flex items-center justify-between transition-colors"
                >
                  About <ChevronRight size={16} className="opacity-50" />
                </Link>
                <Link to="/career-wall" onClick={() => setIsMenuOpen(false)} className="text-[#27187E] flex items-center justify-between">Career Wall <ChevronRight size={16} className="opacity-50" /></Link>
                <Link to="/2ex" onClick={() => setIsMenuOpen(false)} className="text-slate-400 flex items-center justify-between">2eX AI <ChevronRight size={16} className="opacity-50" /></Link>
                <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="text-slate-400 flex items-center justify-between">Opportunities <ChevronRight size={16} className="opacity-50" /></Link>
                <Link to="/help" onClick={() => setIsMenuOpen(false)} className="text-slate-400 flex items-center justify-between">Need Help? <ChevronRight size={16} className="opacity-50" /></Link>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-col gap-4">
                {user ? (
                  <Link
                    to={user.role === "company" ? "/company/dashboard" : "/student/dashboard"}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center px-6 py-4 sm:py-5 rounded-2xl bg-[#27187E] text-white text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#27187E]/20 flex items-center justify-center gap-3"
                  >
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-4 sm:py-5 rounded-2xl bg-slate-50 text-[#27187E] text-[12px] font-black uppercase tracking-[0.2em] border border-slate-100 flex items-center justify-center gap-3"
                    >
                      <User size={16} /> Login
                    </Link>
                    <Link
                      to="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-center px-6 py-4 sm:py-5 rounded-2xl bg-[#27187E] text-white text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#27187E]/20 flex items-center justify-center gap-3"
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

         {/* ─── Main Content ─── */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          {/* Hero / Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27187E] to-primary-500 italic pr-1 sm:pr-2">Wall</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2">
              Share your resume, express your job interests, or post hiring requirements to our verified community.
            </p>
          </div>

          {/* Access Gate — show if not logged in or not verified */}
          {accessDenied ? (
            renderAccessGate()
          ) : (
          <>
            {/* Tab Switcher — only for verified users */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex bg-slate-50 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm mx-auto">
              <button 
                onClick={() => setActiveTab("feed")}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all ${activeTab === "feed" ? "bg-white text-[#27187E] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <MessageSquare size={14} className="hidden sm:block" />
                Feed
              </button>
              <button 
                onClick={() => setActiveTab("post")}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all ${activeTab === "post" ? "bg-white text-[#27187E] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Send size={14} className="hidden sm:block" />
                Post
              </button>
              </div>
            </div>

          {/* Layout Grid — stacks on mobile, side-by-side on lg+ */}
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-6 sm:gap-8 lg:gap-10">
            
            {/* ─── Sidebar (appears first on mobile for filters, second on desktop) ─── */}
            <div className="order-1 lg:order-2">
              {/* Mobile: horizontal filter pills / Desktop: sticky sidebar */}
              <div className="lg:sticky lg:top-28 space-y-4 sm:space-y-6">
                
                {/* Filter Box */}
                <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4 lg:mb-6">
                    <Filter className="text-primary-600" size={16} />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900">Filter</h3>
                  </div>
                  
                  {/* Mobile: horizontal row / Desktop: vertical stack */}
                  <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                    <button 
                      onClick={() => setFilter("all")}
                      className={`shrink-0 lg:w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-[#27187E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      All Posts
                    </button>
                    <button 
                      onClick={() => setFilter("student")}
                      className={`shrink-0 lg:w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${filter === 'student' ? 'bg-[#27187E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      Students
                    </button>
                    <button 
                      onClick={() => setFilter("company")}
                      className={`shrink-0 lg:w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${filter === 'company' ? 'bg-[#27187E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      Companies
                    </button>
                  </div>
                </div>

                {/* Sort Box */}
                <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4 lg:mb-6">
                    <Filter className="text-primary-600 rotate-90" size={16} />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900">Sort By</h3>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                    <button 
                      onClick={() => setSortBy("recent")}
                      className={`shrink-0 lg:w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'recent' ? 'bg-[#27187E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      Most Recent
                    </button>
                    <button 
                      onClick={() => setSortBy("top")}
                      className={`shrink-0 lg:w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${sortBy === 'top' ? 'bg-[#27187E] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      Top Liked
                    </button>
                  </div>
                </div>

                {/* Info Box — hidden on small mobile, visible on sm+ */}
                <div className="hidden sm:block bg-primary-50 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 lg:p-8 border border-primary-100 text-center">
                  <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-[11px] sm:text-sm font-black uppercase tracking-widest text-[#27187E] mb-2 sm:mb-3">
                    Community Driven
                  </h4>
                  <p className="text-[10px] sm:text-xs font-medium text-primary-800 leading-relaxed">
                    By making this public, we transform standard job sourcing into a deeply community-driven platform.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Main Content Area ─── */}
            <div className="space-y-5 sm:space-y-6 md:space-y-8 order-2 lg:order-1 min-w-0">
              
              {/* ═══ CREATE POST TAB ═══ */}
              {activeTab === "post" && (
              <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 shrink-0">
                    <MessageSquare size={18} className="sm:hidden" />
                    <MessageSquare size={20} className="hidden sm:block" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-serif font-black text-slate-900">Share Your Thoughts</h3>
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5 sm:mt-1">
                      Resume • Job Interest • Hiring Needs
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-4 sm:space-y-5">
                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#27187E] ml-1 sm:ml-2 mb-1.5 sm:mb-2">
                        Job Role Interested / Hiring For
                     </label>
                     <input 
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Software Developer"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-black uppercase tracking-widest text-[#27187E] ml-1 sm:ml-2 mb-1.5 sm:mb-2">
                        Description
                     </label>
                     <textarea 
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write something about your skills or hiring needs..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-3 sm:py-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium resize-none"
                     ></textarea>
                  </div>

                  <div className="flex flex-col gap-4 pt-1 sm:pt-2">
                     <div className="w-full">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#27187E] ml-1 sm:ml-2 mb-1.5 sm:mb-2">
                          Upload Resume (optional)
                        </label>
                        <input 
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                          className="w-full text-sm text-slate-500 file:mr-3 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-4 sm:file:px-6 file:rounded-full file:border-0 file:text-[10px] sm:file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                        />
                     </div>
                     <button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className="w-full sm:w-auto self-end px-8 sm:px-10 py-3.5 sm:py-4 bg-[#27187E] text-white rounded-full font-black text-[11px] sm:text-[12px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        <Send size={15} /> {isSubmitting ? 'Posting...' : 'Post'}
                     </button>
                  </div>
                  {!user && (
                    <p className="text-[11px] sm:text-xs text-red-500 font-medium text-center">
                      * You must be logged in to post on the Career Wall.
                    </p>
                  )}
                </form>
              </div>
              )}

              {/* ═══ COMMUNITY FEED TAB ═══ */}
              {activeTab === "feed" && (
              <div className="space-y-4 sm:space-y-5 md:space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                   <div className="text-center py-16 sm:py-20">
                     <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[3px] sm:border-4 border-[#27187E]/20 border-t-[#27187E] animate-spin mx-auto"></div>
                   </div>
                ) : posts.length === 0 ? (
                   <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-8 sm:p-12 text-center border border-slate-100 shadow-sm">
                      <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 mx-auto mb-3 sm:mb-4" />
                      <p className="text-slate-500 font-medium text-sm sm:text-base">No posts found on the Career Wall yet.</p>
                   </div>
                ) : (
                  posts.map((post, idx) => (
                    <div 
                      key={post.id} 
                      className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 lg:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] animate-in fade-in slide-in-from-bottom-8 duration-700"
                      style={{ animationDelay: `${(idx % 5) * 100}ms` }}
                    >
                      {/* Post Header */}
                      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6 pb-4 sm:pb-5 md:pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                           <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-[1rem] flex items-center justify-center shrink-0 ${post.role_type === 'company' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-primary-50 text-primary-600 border border-primary-100'}`}>
                             {post.role_type === 'company' ? <Building2 size={20} className="sm:hidden" /> : <User size={20} className="sm:hidden" />}
                             {post.role_type === 'company' ? <Building2 size={24} className="hidden sm:block" /> : <User size={24} className="hidden sm:block" />}
                           </div>
                           <div className="min-w-0 flex flex-col">
                             {post.profile_id ? (
                               <Link 
                                 to={post.role_type === 'student' ? `/students/${post.profile_id}` : `/companies/${post.profile_id}`}
                                 className="group/name flex items-center gap-1.5"
                               >
                                 <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover/name:text-[#27187E] transition-colors">
                                   {post.user_name || "Community Member"}
                                 </h4>
                                 <ChevronRight size={14} className="text-slate-300 group-hover/name:text-[#27187E] group-hover/name:translate-x-0.5 transition-all" />
                               </Link>
                             ) : (
                               <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{post.user_name || "Community Member"}</h4>
                             )}
                             <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5 sm:mt-1">
                               {post.role_type === 'student' ? 'Student' : 'Company'}
                             </p>
                           </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-slate-400 shrink-0 mt-1 sm:mt-0">
                          {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                        </span>
                      </div>

                      {/* Post Body */}
                      <div className="mb-4 sm:mb-5 md:mb-6">
                        <h3 className="text-base sm:text-lg md:text-xl font-serif font-black text-[#27187E] mb-2 sm:mb-3 md:mb-4 leading-snug">
                          {post.role_type === 'company' ? 'Hiring For: ' : 'Interested In: '} 
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                          {post.description}
                        </p>
                      </div>

                      {/* Post Footer / Actions */}
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 md:pt-6 border-t border-slate-50">
                         {post.resume_file ? (
                            <a 
                              href={post.resume_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-50 text-[#27187E] font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-100"
                            >
                              <FileText size={13} /> View Resume
                            </a>
                         ) : (
                           <div></div>
                         )}

                         <div className="flex items-center gap-3 sm:gap-4">
                            <button 
                              onClick={() => toggleLike(post.id)}
                              className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest ${
                                post.is_liked 
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
                                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-transparent'
                              }`}
                            >
                               <ThumbsUp size={14} className={`sm:w-4 sm:h-4 ${post.is_liked ? 'fill-rose-500' : ''}`} /> 
                               <span>{post.likes_count || 0}</span>
                               <span className="hidden sm:inline">Like{post.likes_count !== 1 ? 's' : ''}</span>
                            </button>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              )}
            </div>
          </div>
          </>
          )}
        </main>

        {/* ─── Footer ─── */}
        <footer className="bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8 sm:py-12 md:py-16">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  <img src="/logo.png" alt="Logo" draggable="false" className="w-4 h-4 sm:w-5 sm:h-5 object-contain select-none" />
                </div>
                <span className="text-sm sm:text-base font-serif font-black text-slate-900">
                  GetJob<span className="text-slate-400 italic">AndGo</span>
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 text-center">
                © 2026 GetJobAndGo Platform. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CareerWallPage;
