import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listStudents } from '../../services/studentService';
import { Search, Loader2, CheckCircle2, User, MapPin, GraduationCap, Briefcase } from 'lucide-react';

function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    listStudents()
      .then((data) => {
        setStudents(data.results ?? data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.skills?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Browse Talent
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Connect with the next generation of engineers and developers. Verified students ready to make an impact.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search skills, names..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
          <p className="text-sm text-slate-500 font-medium tracking-tight">Curating top talent...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const skills = student.skills ? student.skills.split(',').map(s => s.trim()) : [];
            const locationStr = [student.district, student.state].filter(Boolean).join(', ');
            
            return (
              <Link
                key={student.id}
                to={`/students/${student.id}`}
                className="group relative flex flex-col h-full bg-white border border-slate-100 rounded-3xl overflow-hidden hover:border-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(39,24,126,0.1)] active:scale-[0.98]"
              >
                {/* Visual Accent */}
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

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {student.full_name}
                  </h3>
                  
                  <div className="flex flex-col gap-2 mt-4 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <GraduationCap size={14} className="text-primary-300" />
                      <span className="truncate">{student.education || 'Education not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Briefcase size={14} className="text-primary-300" />
                      <span>{student.experience_level || 'Profile in build'}</span>
                    </div>
                  </div>

                  {/* Skills Cloud */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {skills.slice(0, 4).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-2.5 py-1 rounded-lg bg-primary-50 text-[10px] text-primary-700 font-bold border border-primary-100/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 font-bold py-1 ml-1">
                        +{skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-primary-600 group-hover:translate-x-1 transition-transform">
                    View Profile
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <MapPin size={12} />
                    {locationStr || 'Remote / Pan India'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && filteredStudents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <Search size={24} className="text-slate-600" />
          </div>
          <h3 className="text-slate-200 font-medium mb-1">No matches found</h3>
          <p className="text-sm text-slate-500 max-w-xs text-center">
            {students.length === 0 
              ? "The student community is still growing. Check back soon!" 
              : "Try adjusting your search terms to find the right talent."}
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentsListPage;
