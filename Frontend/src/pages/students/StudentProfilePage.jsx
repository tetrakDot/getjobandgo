import React, { useState, useEffect, useRef } from 'react';
import { listStudents, updateStudent } from '../../services/studentService';
import { Loader2, UploadCloud } from 'lucide-react';

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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50 flex items-center gap-2">
          My Profile
          {formData.verification_status === 'verified' && (
            <span title="Verified Student" className="text-emerald-500 bg-emerald-500/10 p-1 rounded-full border border-emerald-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </span>
          )}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage your personal information, skills, and resume.
        </p>
      </div>
      
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input required type="text" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Skills (comma separated)</label>
            <input type="text" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
              placeholder="e.g. ReactJS, Django, Python" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
              <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
              <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">District</label>
              <input type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Education</label>
            <input type="text" value={formData.education} onChange={e => setFormData({ ...formData, education: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
              placeholder="e.g. B.Tech in Computer Science from XYZ University" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About</label>
            <textarea rows={4} value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
              placeholder="Write a little about yourself..."></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Resume Upload</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-slate-700 bg-slate-900 rounded-lg text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors">
                <UploadCloud size={16} />
                <span>Choose File (PDF)</span>
                <input 
                  type="file" 
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"  
                />
              </label>
              {resumeFile && <span className="text-xs text-slate-400">{resumeFile.name}</span>}
            </div>
          </div>

          {success && <p className="text-xs text-emerald-400">{success}</p>}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button disabled={saving} type="submit" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentProfilePage;
