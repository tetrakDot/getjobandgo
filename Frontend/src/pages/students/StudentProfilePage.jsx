import React, { useState, useEffect, useRef } from 'react';
import { getStudentProfile, updateStudent } from '../../services/studentService';
import { registerStudent } from '../../services/authService';
import { Loader2, UploadCloud, CheckCircle2, UserCircle2 } from 'lucide-react';
import SEO from '../../SEO';
import { toast } from 'react-toastify';

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
        toast.warning('Resume PDF must be under 2MB.');
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
    getStudentProfile()
      .then((data) => {
        if (data) {
          setProfileId(data.id);
          setFormData({
            full_name: data.full_name || '',
            phone: data.phone || '',
            skills: data.skills || '',
            education: data.education || '',
            about: data.about || '',
            country: data.country || '',
            state: data.state || '',
            district: data.district || '',
            verification_status: data.verification_status || 'pending',
          });
        }
      })
      .catch((err) => {
        console.error('Profile fetch failed:', err);
        // If 404, it just means no student record yet for this user
        if (err.response?.status !== 404) {
          toast.error('Failed to load profile data.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
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
      if (profileId) {
        await updateStudent(profileId, payload);
      } else {
        // This case handles users who exist but have no Student record
        // We might need a separate 'create profile' endpoint on the backend if registerStudent is strictly for registration
        // But for now, let's assume update works or we can't create one here easily without a dedicated endpoint.
        toast.info('Creating new profile record...');
        // If registerStudent uses POST /students/ it might work if we provide email/password (but we don't have them here)
        // Usually, the backend should have a way to create profile for existing user.
        toast.error('Profile creation for existing users is not supported yet. Please contact support.');
        return;
      }
      setSuccess('Profile updated successfully!');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const errorData = err.response.data;
        const firstKey = Object.keys(errorData)[0];
        const msg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
        toast.error(`${firstKey}: ${msg}`);
      } else {
        toast.error('Failed to save profile changes.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary-500 w-10 h-10" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Profile...</p>
      </div>
    );
  }

  // If no profileId, we still show the form so they can see what's happening or fill it (if we add creation support)
  // But for the bug fix, just showing the form is better than the "not found" text.

  return (
    <>
      <SEO 
        title="My Profile | Student Settings | GetJobAndGo"
        description="Update your personal details, skills, and resume to stay visible to recruiters on GetJobAndGo."
        canonical="https://getjobandgo.com/student/profile"
      />
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
  </>
  );
}

export default StudentProfilePage;
