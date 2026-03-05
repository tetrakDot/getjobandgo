import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  User, 
  Clock, 
  Globe, 
  Terminal,
  LogIn,
  LogOut,
  RefreshCcw,
  Activity,
  Layers,
  Trash2,
  ChevronDown,
  FileSpreadsheet,
  FileText as FilePdf,
  FileJson
} from 'lucide-react';
import { toast } from 'react-toastify';
import { confirmAction } from '../utils/confirmToast.jsx';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [showExportOptions, setShowExportOptions] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('auth/activities/');
      setLogs(response.data.results || response.data);
    } catch (err) {
      toast.error('Failed to retrieve audit logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAction('Are you sure you want to delete this log entry?', async () => {
      try {
        await api.delete(`auth/activities/${id}/`);
        toast.success('Log entry deleted successfully.');
        fetchLogs();
      } catch (err) {
        toast.error('Failed to delete log entry.');
        console.error(err);
      }
    });
  };

  const handleClearAll = () => {
    confirmAction('CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE ALL log entries? This cannot be undone.', async () => {
      try {
        await api.delete('auth/activities/clear-all/');
        toast.success('Registry cleared successfully.');
        fetchLogs();
      } catch (err) {
        toast.error('Failed to clear registry.');
        console.error(err);
      }
    });
  };

  const exportToExcel = () => {
    if (filteredLogs.length === 0) return toast.info('No logs to export.');
    
    const worksheet = XLSX.utils.json_to_sheet(filteredLogs.map(log => ({
      Event: log.action.toUpperCase(),
      Identity: log.user_email,
      Role: log.user_role.toUpperCase(),
      IP_Address: log.ip_address || 'Internal',
      Timestamp: new Date(log.timestamp).toLocaleString(),
      User_Agent: log.user_agent
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Security Logs");
    XLSX.writeFile(workbook, `Security_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel registry exported successfully.');
    setShowExportOptions(false);
  };

  const exportToPDF = () => {
    if (filteredLogs.length === 0) return toast.info('No logs to export.');
    
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(18);
    doc.setTextColor(39, 24, 126); // #27187E
    doc.text("GetJobAndGo Security Audit Registry", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Records: ${filteredLogs.length}`, 14, 35);

    const tableColumn = ["Event", "Subject Identity", "Role", "Network Origin", "Timestamp"];
    const tableRows = filteredLogs.map(log => [
      log.action.toUpperCase(),
      log.user_email,
      log.user_role.toUpperCase(),
      log.ip_address || '---',
      new Date(log.timestamp).toLocaleString()
    ]);

    doc.autoTable({
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      headStyles: { fillColor: [39, 24, 126], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { top: 45 }
    });

    doc.save(`Security_Audit_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF registry exported successfully.');
    setShowExportOptions(false);
  };

  const exportToCSV = () => {
    if (filteredLogs.length === 0) return toast.info('No logs to export.');
    
    const headers = ['Event', 'User Email', 'User Role', 'IP Address', 'Timestamp', 'User Agent'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.action,
        log.user_email,
        log.user_role,
        log.ip_address || 'Internal',
        new Date(log.timestamp).toLocaleString(),
        `"${log.user_agent?.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Security_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success('CSV registry exported successfully.');
    setShowExportOptions(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = Array.isArray(logs) ? logs.filter(log => {
    const matchesSearch = (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.ip_address || '').includes(searchTerm);
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  }) : [];

  const getActionStyles = (action) => {
    switch(action) {
      case 'login': return { icon: <LogIn size={14} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' };
      case 'logout': return { icon: <LogOut size={14} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' };
      default: return { icon: <Activity size={14} />, color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' };
    }
  };

  return (
    <div className="min-h-screen p-8 text-slate-200 font-['DM_Sans']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }

        .dropdown-card {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(96, 165, 250, 0.5);
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.1);
        }

        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        select option {
          background: #0f172a;
          color: #f1f5f9;
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 animate-fade-up relative z-30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <ShieldAlert size={14} className="text-blue-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Security Audit</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Audit Registry</h1>
          <p className="text-slate-400 font-medium">Monitoring real-time access events across the GetJobAndGo infrastructure.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-bold text-sm text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Sync Logs
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 active:scale-95 transition-all"
          >
            <Trash2 size={16} />
            Clear Registry
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-2xl font-bold text-sm text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Download size={16} />
              Export Registry
              <ChevronDown size={14} className={`transition-transform duration-300 ${showExportOptions ? 'rotate-180' : ''}`} />
            </button>

            {showExportOptions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportOptions(false)}
                />
                <div className="absolute right-0 mt-3 w-64 dropdown-card z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2.5 space-y-1">
                    <button 
                      onClick={exportToPDF}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                        <FilePdf size={14} />
                      </div>
                      Export as PDF
                    </button>
                    <button 
                      onClick={exportToExcel}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileSpreadsheet size={14} />
                      </div>
                      Export as Excel (XLSX)
                    </button>
                    <button 
                      onClick={exportToCSV}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                        <FileJson size={14} />
                      </div>
                      Export as CSV
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-fade-up relative z-20" style={{ animationDelay: '100ms' }}>
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by identity or host address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none transition-all font-medium text-sm text-white search-input"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select 
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none transition-all font-bold text-xs uppercase tracking-widest text-white appearance-none cursor-pointer"
          >
            <option value="all">All Operations</option>
            <option value="login">Authentications</option>
            <option value="logout">Terminations</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            Registry: {filteredLogs.length}
          </div>
        </div>
      </div>

      {/* Logs Table Container */}
      <div className="glass-card overflow-hidden animate-fade-up shadow-2xl" style={{ animationDelay: '200ms' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">Event Signature</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">Subject Identity</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">Network Origin</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">Registry Time</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-8 py-6"><div className="h-4 bg-white/5 rounded-lg w-full"></div></td>
                    ))}
                  </tr>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const styles = getActionStyles(log.action);
                  return (
                    <tr key={log.id} className="table-row-hover transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-xl border transition-transform group-hover:scale-110"
                            style={{ backgroundColor: styles.bg, borderColor: styles.border, color: styles.color }}
                          >
                            {styles.icon}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: styles.color }}>{log.action}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white mb-0.5">{log.user_email}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{log.user_role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] font-medium">
                          <Globe size={12} className="text-slate-600" />
                          {log.ip_address || '---'}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <Clock size={12} className="text-slate-600" />
                          {new Date(log.timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleDelete(log.id)}
                          className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-transparent transition-all active:scale-90"
                          title="Delete Security Log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-5 rounded-full bg-white/5 border border-white/10">
                        <Search className="text-slate-600" size={40} />
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No matching activities found in registry</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
