import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listStudents } from '../../services/studentService';
import { Search, Loader2, CheckCircle2, User, MapPin, GraduationCap, Briefcase, Sparkles, X, ArrowUpDown } from 'lucide-react';

function StudentCard({ student, isFeatured }) {
  const skills = student.skills ? student.skills.split(',').map(s => s.trim()) : [];
  const locationStr = [student.district, student.state].filter(Boolean).join(', ');
  
  return (
    <Link
      to={`/students/${student.id}`}
      className={`group relative flex flex-col h-full bg-white border rounded-3xl overflow-hidden transition-all duration-500 active:scale-[0.98] ${
        isFeatured 
        ? 'border-primary-100 shadow-[0_20px_40px_rgba(39,24,126,0.06)] hover:shadow-[0_25px_60px_rgba(39,24,126,0.12)] hover:border-primary-300' 
        : 'border-slate-100 hover:border-primary-200 hover:shadow-[0_20px_50px_rgba(39,24,126,0.08)]'
      }`}
    >
      <div className={`h-1.5 w-full ${student.verification_status === 'verified' ? 'bg-emerald-500' : 'bg-slate-100 group-hover:bg-primary-500/20'}`} />
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 transition-colors">
            <User className="w-7 h-7 text-slate-400 group-hover:text-primary-500 transition-transform duration-500" />
          </div>
          {student.verification_status === 'verified' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 size={12} />
              Verified
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
          {student.full_name}
        </h3>
        
        <div className="flex flex-col gap-2 mt-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tight">
            <GraduationCap size={14} className="text-primary-300" />
            <span className="truncate">{student.education || 'Education not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-tight">
            <Briefcase size={14} className="text-primary-300" />
            <span>{student.experience_level || 'Profile in build'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {skills.slice(0, 4).map((skill, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 rounded-lg bg-primary-50 text-[10px] text-primary-700 font-black uppercase tracking-widest border border-primary-100/50"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="text-[10px] text-slate-400 font-black py-1 ml-1">+{skills.length - 4}</span>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-primary-600 group-hover:translate-x-1 transition-transform">
          Explore Profile
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <MapPin size={12} />
          {locationStr || 'Remote / Pan India'}
        </div>
      </div>
    </Link>
  );
}

function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [allFetched, setAllFetched] = useState(false);

  useEffect(() => {
    // Fetch only 6 random featured students initially
    listStudents({ random: 6 })
      .then((data) => {
        setFeaturedStudents(data.results ?? data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value && !allFetched) {
      setLoadingAll(true);
      listStudents()
        .then((data) => {
          setStudents(data.results ?? data);
          setAllFetched(true);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingAll(false));
    }
  };

  const getFilteredAndSortedStudents = () => {
    let result = [...students];

    if (searchQuery) {
      result = result.filter(student => 
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        student.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.education?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    }

    return result;
  };

  const filteredStudents = getFilteredAndSortedStudents();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Talent Pool</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Connect with the next generation of engineers and developers. Search and find verified talent.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, skills, education..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
          <p className="text-sm text-slate-500 font-medium tracking-tight">Curating top talent...</p>
        </div>
      ) : searchQuery ? (
        /* ─── SEARCH RESULTS VIEW ─── */
        <div className="space-y-6 pb-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Search className="text-slate-400 w-4 h-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Search Results for "{searchQuery}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none cursor-pointer shadow-sm"
                >
                  <option value="latest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ArrowUpDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            </div>
          </div>

          {loadingAll ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
              <p className="text-sm text-slate-400 font-medium">Searching all talent...</p>
            </div>
          ) : filteredStudents.length > 0 ? (
            <>
              <p className="text-xs text-slate-400 font-bold">
                Found <span className="text-primary-600">{filteredStudents.length}</span> {filteredStudents.length === 1 ? 'candidate' : 'candidates'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <User size={24} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1 uppercase tracking-tight">No talent found</h3>
              <p className="text-sm text-slate-500 mb-4">No results for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
              >
                ← Back to Featured
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── DEFAULT VIEW: 6 RANDOM FEATURED ─── */
        <div className="space-y-6 pb-12">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary-500 w-5 h-5 animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Featured Top Talent</h2>
            <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Use the search to find more →
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudents.map((student) => (
              <StudentCard key={student.id} student={student} isFeatured />
            ))}
          </div>

          {/* Prompt */}
          <div className="mt-8 p-6 rounded-3xl border border-dashed border-primary-100 bg-primary-50/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
              <Search size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Looking for specific skills or a candidate?</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Use the search bar above to find candidates by name, skills, or education background.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsListPage;
