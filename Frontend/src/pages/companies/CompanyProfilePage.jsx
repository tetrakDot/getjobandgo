import React, { useState, useEffect } from 'react';
import { listCompanies, updateCompany } from '../../services/companyService';
import { Loader2 } from 'lucide-react';

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
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
          Company Profile
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manage your company's public information.
        </p>
      </div>
      
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
              <input required type="text" value={formData.company_name} onChange={e => setFormData({ ...formData, company_name: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
              <input type="text" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company Type (e.g. IT, Healthcare, Finance)</label>
            <input type="text" value={formData.company_type} onChange={e => setFormData({ ...formData, company_type: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500" />
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
            <label className="block text-xs font-medium text-slate-300 mb-1">Company Description</label>
            <textarea rows={6} required value={formData.company_description} onChange={e => setFormData({ ...formData, company_description: e.target.value })} 
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary-500"
              placeholder="Tell candidates what your company does..."></textarea>
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

export default CompanyProfilePage;
