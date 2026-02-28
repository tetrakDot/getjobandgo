import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudent, downloadStudentResume } from '../../services/studentService';
import { Loader2, ArrowLeft, Download } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

function StudentDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getStudent(id)
      .then((data) => setStudent(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!student) {
    return <p className="text-sm text-slate-400">Student not found.</p>;
  }

  const handleDownloadResume = async () => {
    try {
      setDownloading(true);
      const blob = await downloadStudentResume(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${student.full_name}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Resume not available or unable to download.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <Link to="/students" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft size={14} /> Back to students
      </Link>
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-6 py-5 shadow-sm shadow-slate-900/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
              {student.full_name}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              <strong>Email:</strong> {student.user?.email || student.email || 'N/A'}
            </p>
            {(student.country || student.state || student.district) && (
              <p className="mt-1 text-sm text-slate-300">
                <strong>Location:</strong> {[student.district, student.state, student.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          {user?.role === 'company' && student.resume && (
            <button
              onClick={handleDownloadResume}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {downloading ? 'Downloading...' : 'Download Resume'}
            </button>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-2">Skills & Expertise</h2>
          <p className="text-sm text-slate-200">{student.skills || 'No skills provided.'}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-2">Education</h2>
          <p className="text-sm text-slate-200">{student.education || 'No education provided.'}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-slate-400 mb-2">About</h2>
          <p className="text-sm text-slate-200 whitespace-pre-line">{student.about || 'No additional information.'}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailPage;
