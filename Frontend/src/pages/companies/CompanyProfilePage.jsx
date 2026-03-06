import React, { useState, useEffect } from 'react';
import { listCompanies, updateCompany } from '../../services/companyService';
import { Loader2, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2
import { toast } from 'react-toastify';

function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_description: '',
    company_type: '',
    contact_phone: '',
    country: '',
    state: '',
    district: '',
  });

  useEffect(() => {
    // For companies, listCompanies() filters by current user on the backend.
    listCompanies()
      .then((data) => {
        const result = data.results ? data.results[0] : data[0];
        if (result) {
          setProfileId(result.id);
          setFormData({
            company_name: result.company_name || '',
            company_description: result.company_description || '',
            company_type: result.company_type || '',
            contact_phone: result.phone || '',
            country: result.country || '',
            state: result.state || '',
            district: result.district || '',
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
    
    const payload = new FormData();
    payload.append('company_name', formData.company_name);
    payload.append('company_description', formData.company_description);
    payload.append('company_type', formData.company_type);
    payload.append('phone', formData.contact_phone);
    payload.append('country', formData.country);
    payload.append('state', formData.state);
    payload.append('district', formData.district);

    try {
      await updateCompany(profileId, payload);
      setSuccess('Company profile updated successfully!');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && typeof err.response.data === 'object') {
        const errorData = err.response.data;
        const firstKey = Object.keys(errorData)[0];
        if (firstKey) {
          const msg = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
          toast.error(`${firstKey}: ${msg}`);
          return;
        }
      }
      toast.error('Error updating profile.');
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
    <div className="space-y-10 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">
          Organization Profile
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Manage your company's identity and public presence on the talent network.
        </p>
      </div>
      
      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Entity Name</label>
              <input required type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Corporate Contact</label>
              <input type="text" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Industry Vertical</label>
            <select 
              value={formData.company_type} 
              onChange={e => setFormData({ ...formData, company_type: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold appearance-none cursor-pointer"
            >
              <option value="" disabled>Select company type</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Startup">Startup</option>
              <option value="SME">SME</option>
              <option value="MNC">MNC</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country</label>
              <input 
                type="text"
                value={formData.country} 
                onChange={e => setFormData({ ...formData, country: e.target.value })} 
                placeholder="e.g. India"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
              <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
              <input type="text" value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all font-bold" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Organization Brief</label>
            <textarea rows={6} required value={formData.company_description} onChange={e => setFormData({ ...formData, company_description: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all resize-none font-medium leading-relaxed"
              placeholder="Tell candidates what your company does..."></textarea>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
                {success && (
                    <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-50 px-6 py-3 rounded-xl border border-emerald-100 animate-in slide-in-from-left-4">
                        <CheckCircle2 size={16} /> {success}
                    </div>
                )}
            </div>
            <button disabled={saving} type="submit" className="min-w-[240px] px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50 transition-all">
              {saving ? 'Synchronizing...' : 'Save Corporate Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfilePage;
