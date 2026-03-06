import { useState, useEffect } from "react";
import evaluatorService from "../services/evaluatorService";
import { confirmAction } from "../utils/confirmToast.jsx";
import { 
  Zap, 
  Trash2, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Calendar,
  User,
  FileText,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  RefreshCcw,
  BarChart2
} from "lucide-react";
import { toast } from "react-toastify";

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedEval, setSelectedEval] = useState(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await evaluatorService.getEvaluations();
      setEvaluations(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      toast.error("Failed to load evaluations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAction("Are you sure you want to delete this evaluation record?", async () => {
      try {
        await evaluatorService.deleteEvaluation(id);
        toast.success("Evaluation deleted");
        setEvaluations(evaluations.filter(e => e.id !== id));
        if (selectedEval?.id === id) setSelectedEval(null);
      } catch (error) {
        toast.error("Failed to delete evaluation");
      }
    });
  };

  const handleDeleteAll = () => {
    confirmAction("CRITICAL: This will delete ALL evaluation logs. Are you absolutely sure?", async () => {
      try {
        await evaluatorService.deleteAllEvaluations();
        toast.success("All logs cleared successfully");
        setEvaluations([]);
      } catch (error) {
        toast.error("Failed to clear logs");
      }
    });
  };

  const filteredEvaluations = evaluations.filter(e => 
    (e.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.filename?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === "all" || e.classification.toLowerCase().includes(filterType.toLowerCase()))
  );

  const stats = {
    total: evaluations.length,
    averageScore: evaluations.length ? Math.round(evaluations.reduce((acc, curr) => acc + curr.overall_score, 0) / evaluations.length) : 0,
    excellent: evaluations.filter(e => e.overall_score >= 90).length,
    poor: evaluations.filter(e => e.overall_score < 40).length
  };

  return (
    <div className="admin-page-container fade-in" style={{ padding: '24px', background: '#020617', minHeight: '100vh', color: '#f8fafc' }}>
      <style>{`
        .eval-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .eval-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
          background: rgba(15, 23, 42, 0.8);
          transform: translateY(-2px);
        }
        .stat-widget {
          padding: 20px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4));
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .score-badge {
          padding: 4px 12px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 12px;
        }
        .table-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }
        .table-row:hover {
          background: rgba(99, 102, 241, 0.03);
        }
        .search-input {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px 16px 10px 40px;
          border-radius: 10px;
          width: 300px;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus {
          border-color: #6366f1;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px' }}>
              <Zap size={24} className="text-indigo-400" />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>2eX Intelligence Logs</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Monitor AI Resume evaluations and system usage.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
             onClick={handleDeleteAll}
             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20 font-bold text-xs uppercase tracking-widest text-rose-400"
           >
             <Trash2 size={14} /> Clear All Logs
           </button>
           <button 
             onClick={fetchEvaluations}
             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 font-bold text-xs uppercase tracking-widest"
           >
             <RefreshCcw size={14} /> Refresh
           </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="stat-widget">
          <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Total Evaluations</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.total}</span>
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>+ Live</span>
          </div>
        </div>
        <div className="stat-widget">
          <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Avg. Score</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.averageScore}%</span>
            <BarChart2 size={16} className="text-indigo-400" />
          </div>
        </div>
        <div className="stat-widget">
          <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Excellent Matches</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.excellent}</span>
            <span style={{ color: '#10b981', fontSize: '12px' }}>🟢</span>
          </div>
        </div>
        <div className="stat-widget">
          <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Poor Matches</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 800 }}>{stats.poor}</span>
            <span style={{ color: '#ef4444', fontSize: '12px' }}>🔴</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search by email or file..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px', padding: '0 16px', fontSize: '13px' }}
          >
            <option value="all">All Classifications</option>
            <option value="Excellent">Excellent Match</option>
            <option value="Strong">Strong Match</option>
            <option value="Moderate">Moderate Match</option>
            <option value="Weak">Weak Match</option>
            <option value="Poor">Poor Match</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="eval-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>User / Email</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Document</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Score</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Recommendation</th>
              <th style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Date</th>
              <th style={{ textAlign: 'center', padding: '16px 24px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '60px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <Zap size={32} className="animate-pulse text-indigo-500" />
                      <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Decrypting evaluation logs...</p>
                   </div>
                </td>
              </tr>
            ) : filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                  No evaluations found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredEvaluations.map((evalItem) => (
                <tr key={evalItem.id} className="table-row">
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                        <User size={14} className="text-indigo-400" />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{evalItem.email || 'Guest User'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={14} className="text-slate-400" />
                      <span style={{ fontSize: '13px', color: '#cbd5e1' }}>{evalItem.filename}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px' }}>{evalItem.overall_score}%</span>
                        <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                           <div style={{ width: `${evalItem.overall_score}%`, height: '100%', background: evalItem.overall_score >= 75 ? '#10b981' : (evalItem.overall_score >= 50 ? '#f59e0b' : '#ef4444') }} />
                        </div>
                     </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      background: evalItem.recommendation === 'Strongly Recommend' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: evalItem.recommendation === 'Strongly Recommend' ? '#10b981' : '#f59e0b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {evalItem.recommendation}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '12px', color: '#64748b' }}>
                    {new Date(evalItem.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                     <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => setSelectedEval(evalItem)}
                          className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-400 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(evalItem.id)}
                          className="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"
                          title="Delete"
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

      {/* Detail Modal Overlay */}
      {selectedEval && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
           <div className="eval-card fade-in-up" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', background: '#0f172a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                 <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '4px' }}>Evaluation Breakdown</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>Detailed report for {selectedEval.filename}</p>
                 </div>
                 <button onClick={() => setSelectedEval(null)} style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer' }}>
                    <AlertCircle size={20} />
                 </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                 <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6366f1', marginBottom: '16px' }}>AI Match Stats</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {Object.entries(selectedEval.payload.breakdown).map(([key, val]) => (
                         <div key={key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                               <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                               <span>{val}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                               <div style={{ width: `${val}%`, height: '100%', background: '#6366f1' }} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginBottom: '16px' }}>Matched Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                       {selectedEval.payload.matchedSkills.map((skill, i) => (
                         <span key={i} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '11px', fontWeight: 600 }}>
                           {skill}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              <div>
                 <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b', marginBottom: '12px' }}>Gap Analysis</h3>
                 <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                   {selectedEval.payload.gapAnalysis}
                 </p>
              </div>

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                 <button 
                   onClick={() => setSelectedEval(null)}
                   style={{ padding: '12px 24px', borderRadius: '12px', background: '#6366f1', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                 >
                   Close Report
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations;
