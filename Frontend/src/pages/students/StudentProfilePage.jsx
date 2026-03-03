import React, { useState, useEffect, useRef } from 'react';
import { listStudents, updateStudent } from '../../services/studentService';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';

function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    skills: '',
    education: '',
    about: '',
    country: '',
    state: '',
    district: '',
    verification_status: 'pending',
  });
  
  const fileInputRef = useRef(null);
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Resume PDF must be under 2MB.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
    } else {
      setResumeFile(null);
    }
  };

  useEffect(() => {
    // For students, listStudents() only returns their own user profile because of backend filtering.
    listStudents()
      .then((data) => {
        const result = data.results ? data.results[0] : data[0];
        if (result) {
          setProfileId(result.id);
          setFormData({
            full_name: result.full_name || '',
            phone: result.phone || '',
            skills: result.skills || '',
            education: result.education || '',
            about: result.about || '',
            country: result.country || '',
            state: result.state || '',
            district: result.district || '',
            verification_status: result.verification_status || 'pending',
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    // Use FormData since we might upload a file
    const payload = new FormData();
    payload.append('full_name', formData.full_name);
    payload.append('phone', formData.phone);
    payload.append('skills', formData.skills);
    payload.append('education', formData.education);
    payload.append('about', formData.about);
    payload.append('country', formData.country);
    payload.append('state', formData.state);
    payload.append('district', formData.district);
    
    if (resumeFile) {
      payload.append('resume', resumeFile);
    }

    try {
      await updateStudent(profileId, payload);
      setSuccess('Profile updated successfully!');
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!profileId) {
    return <p className="text-sm text-slate-400">Profile data not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-3">
          My Profile
          {formData.verification_status === 'verified' && (
            <span title="Verified Student" className="text-emerald-500 bg-emerald-50 p-1 rounded-full border border-emerald-100 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal information, skills, and resume. Keep your profile updated to stand out.
        </p>
      </div>
      
      <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <input required type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Skills (comma separated)</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
              placeholder="e.g. ReactJS, Django, Python" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
              <input 
                type="text"
                value={formData.country} 
                onChange={e => setFormData({ ...formData, country: e.target.value })} 
                placeholder="e.g. India"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
              <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
              <input type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Education</label>
            <input type="text" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium"
              placeholder="e.g. B.Tech in Computer Science from XYZ University" />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About</label>
            <textarea rows={5} value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-medium resize-none"
              placeholder="Write a little about yourself..."></textarea>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume Upload</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <label className="cursor-pointer group relative flex items-center justify-center gap-3 px-8 py-4 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl text-sm text-slate-500 hover:border-primary-400 hover:bg-primary-50 transition-all">
                <UploadCloud size={20} className="group-hover:text-primary-500 transition-colors" />
                <span className="font-bold group-hover:text-primary-600 transition-colors">Choose File (PDF)</span>
                <input 
                  type="file" 
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"  
                />
              </label>
              {resumeFile ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 animate-in zoom-in-95">
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-bold truncate max-w-[200px]">{resumeFile.name}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Max size: 2MB</p>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                {success && (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in slide-in-from-left-4">
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}
            </div>
            <button disabled={saving} type="submit" className="min-w-[220px] px-8 py-5 bg-[#27187E] hover:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-500/10 active:scale-95 disabled:opacity-50 transition-all">
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfilePage;
