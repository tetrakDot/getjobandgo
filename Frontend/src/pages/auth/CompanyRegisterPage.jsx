import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany } from '../../services/authService';
import { Eye, EyeOff, Lock } from 'lucide-react';

function CompanyRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    company_type: '',
    country: '',
    state: '',
    district: '',
    gst_number: '',
    cin_number: '',
    password: ''
  });
  const [docs, setDocs] = useState({
    incorporation_certificate: null,
    pan_document: null,
    founder_id_proof: null,
    registration_proof: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Document must be under 2MB.');
        e.target.value = '';
        setDocs((prev) => ({ ...prev, [name]: null }));
        return;
      }
      setDocs((prev) => ({ ...prev, [name]: file }));
    } else {
      setDocs((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerCompany({ ...form, ...docs });
      navigate('/auth/company/login', { replace: true });
    } catch (err) {
      setError('Unable to register company. Please review your details and documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        {/* Mobile Logo */}
        <Link to="/" className="md:hidden inline-block mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#27187E] flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
           </div>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">
             Corporate Onboarding
           </p>
        </div>
        <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">Verify organization</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-md">
          Submit your company profile and legal docs. Our compliance team will review your application within 24-48 hours.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="company_name">
              Registered Entity Name
            </label>
            <input
              id="company_name"
              name="company_name"
              required
              value={form.company_name}
              onChange={handleChange}
              placeholder="e.g. Acme Corporation Pvt Ltd"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="company_type">
              Industry Vertical
            </label>
            <select
              id="company_type"
              name="company_type"
              required
              value={form.company_type}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium appearance-none"
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="email">
              Primary Corporate Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="hiring@company.com"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="phone">
              Official Contact
            </label>
            <input
              id="phone"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 0000 000000"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="e.g. India"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="state">
              State
            </label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="district">
              Headquarters
            </label>
            <input
              id="district"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="gst_number">
              GSTIN
            </label>
            <input
              id="gst_number"
              name="gst_number"
              required
              value={form.gst_number}
              onChange={handleChange}
              placeholder="Corporate GST Identification"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="cin_number">
              CIN
            </label>
            <input
              id="cin_number"
              name="cin_number"
              required
              value={form.cin_number}
              onChange={handleChange}
              placeholder="Corporate Identity Number"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="space-y-5 pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Legal Documentation (PDF)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="incorporation_certificate">
                Incorporation Certificate
                </label>
                <input
                id="incorporation_certificate"
                name="incorporation_certificate"
                type="file"
                onChange={handleFileChange}
                className="w-full text-[10px] font-bold text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:bg-slate-100 file:text-slate-700 hover:file:bg-primary-500 hover:file:text-white file:transition-all cursor-pointer bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="pan_document">
                Corporate PAN Card
                </label>
                <input
                id="pan_document"
                name="pan_document"
                type="file"
                onChange={handleFileChange}
                className="w-full text-[10px] font-bold text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:bg-slate-100 file:text-slate-700 hover:file:bg-primary-500 hover:file:text-white file:transition-all cursor-pointer bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200"
                />
            </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="founder_id_proof">
                Founder ID Authorization
                </label>
                <input
                id="founder_id_proof"
                name="founder_id_proof"
                type="file"
                onChange={handleFileChange}
                className="w-full text-[10px] font-bold text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:bg-slate-100 file:text-slate-700 hover:file:bg-primary-500 hover:file:text-white file:transition-all cursor-pointer bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="registration_proof">
                MSME / Registration Proof
                </label>
                <input
                id="registration_proof"
                name="registration_proof"
                type="file"
                onChange={handleFileChange}
                className="w-full text-[10px] font-bold text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:bg-slate-100 file:text-slate-700 hover:file:bg-primary-500 hover:file:text-white file:transition-all cursor-pointer bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200"
                />
            </div>
            </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="password">
            Admin Access Password
          </label>
          <div className="relative group">
            <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-primary-500 transition-colors"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
                <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight">{error}</p>
            </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 px-6 py-4 rounded-2xl bg-[#27187E] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary-600 shadow-xl shadow-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 mt-4"
        >
          {loading ? 'Submitting Corporate Profile…' : (
            <>
              Initialize Verification Pipeline <Lock size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CompanyRegisterPage;

