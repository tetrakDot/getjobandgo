import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listStudents } from '../../services/studentService';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Browse Talent
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Discover passionate students and fresh graduates.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Link
              key={student.id}
              to={`/students/${student.id}`}
              className={`group rounded-2xl bg-slate-900/80 border px-5 py-4 transition-colors shadow-sm flex flex-col h-full ${
                student.verification_status === 'verified'
                  ? 'border-emerald-500/50 hover:border-emerald-500 hover:bg-slate-900'
                  : 'border-slate-800 hover:border-primary-600 hover:bg-slate-900'
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2">
                  <p className={`text-base font-semibold text-slate-50 ${student.verification_status === 'verified' ? 'group-hover:text-emerald-400' : 'group-hover:text-primary-100'}`}>
                    {student.full_name}
                  </p>
                  {student.verification_status === 'verified' && (
                    <span title="Verified Student" className="text-emerald-500">
                      <CheckCircle2 size={16} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 mb-3 line-clamp-2">
                  {student.skills || 'No skills listed'}
                </p>
                <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-primary-400">View Profile</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Student
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {filteredStudents.length === 0 && (
            <p className="text-xs text-slate-500 col-span-2 text-center py-8">{students.length === 0 ? "No students available yet." : "No talent found matching your search."}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentsListPage;
