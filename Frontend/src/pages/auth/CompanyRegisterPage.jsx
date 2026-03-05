import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCompany } from '../../services/authService';
import { trackRegistration } from '../../utils/analytics';
import { Briefcase, Building2, ArrowRight, ShieldCheck, FileText, Upload, CheckCircle, MapPin, Hash } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

function CompanyRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [form, setForm] = useState({
    company_name: '',
    company_type: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    district: '',
    gst_number: '',
    cin_number: '',
    password: ''
  });

  const [files, setFiles] = useState({
    incorporation_certificate: null,
    pan_document: null,
    founder_id_proof: null,
    registration_proof: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      ...files
    };

    try {
      const data = await registerCompany(payload);
      trackRegistration(data.user?.id || 'new_company');
      navigate('/auth/company/login', { replace: true, state: { registrationSuccess: true } });
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData && typeof responseData === 'object') {
        const fields = {};
        let generalError = '';
        Object.entries(responseData).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : msgs;
          if (['email', 'phone', 'password', 'company_name', 'gst_number', 'cin_number'].includes(field)) {
            fields[field] = msg;
          } else {
            generalError = msg;
          }
        });
        if (Object.keys(fields).length > 0) {
          setFieldErrors(fields);
          setError('Please fix the errors highlighted below.');
        } else {
          setError(generalError || 'Onboarding failed. Please review your credentials.');
        }
      } else {
        setError('Network error. Database synchronisation interrupted.');
      }
    } finally {
      setLoading(false);
    }
  };

  const FileField = ({ label, name }) => (
    <div className="space-y-1.5 flex-1">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#27187E]/60 ml-0.5">
        {label}
      </label>
      <label className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed transition-all cursor-pointer
        ${files[name] ? 'bg-[#10b981]/5 border-[#10b981]/30' : 'bg-slate-50 border-slate-200 hover:border-[#27187E]/30 hover:bg-white'}
      `}>
        <input type="file" name={name} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
        <div className={`p-2 rounded-lg ${files[name] ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-white text-slate-400 border border-slate-100'}`}>
          {files[name] ? <CheckCircle size={14} /> : <Upload size={14} />}
        </div>
        <span className={`text-[11px] font-bold truncate ${files[name] ? 'text-[#10b981]' : 'text-slate-400'}`}>
          {files[name] ? files[name].name : 'CHOOSE FILE (PDF)'}
        </span>
      </label>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[850px]">
      {/* Brand Sidebar */}
      <div className="lg:w-[320px] bg-[#27187E] p-10 flex flex-col justify-between relative overflow-hidden text-white shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-block mb-12">
            <img src="/logo.png" alt="GetJobAndGo" className="h-10 w-auto" />
          </Link>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight leading-tight">
              Scale your <br /><span className="text-blue-300">future today.</span>
            </h1>
            <p className="text-sm font-medium text-blue-100/70 leading-relaxed italic">
              "Connecting ambitious talent with enterprises that value innovation and execution."
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300/60 mb-6 font-black">Platform Pillars</p>
            <ul className="space-y-5">
              {[
                "Certified corporate onboarding.",
                "Live application funnel tracking.",
                "Data-driven dashboards."
              ].map((pill, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 shadow-[0_0_10px_rgba(39,24,126,0.3)]" />
                  <p className="text-[11px] font-bold text-blue-50/80">{pill}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 bg-white font-sans relative">
        <div className="mb-10 lg:flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
               <Briefcase size={12} className="text-[#27187E]" />
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#27187E]">
                 Corporate Onboarding
               </p>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify organization</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-md">
              Complete your entity profile. Verification requests are usually processed within 24-48 business hours.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AuthInput
              label="Registered Entity Name"
              id="company_name"
              name="company_name"
              required
              value={form.company_name}
              onChange={handleChange}
              placeholder="e.g. Acme Corporation"
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#27187E]/60">
                Industry Vertical <span className="text-red-500">*</span>
              </label>
              <select 
                name="company_type" 
                required 
                value={form.company_type}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-primary-100 focus:border-[#27187E] focus:bg-white text-sm font-medium transition-all"
              >
                <option value="">Select industry</option>
                <option value="IT Services">Software / IT</option>
                <option value="Finance">Finance / Fintech</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail & E-commerce</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <AuthInput label="Corporate Email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="hiring@company.com" />
              {fieldErrors.email && <p className="text-[11px] text-rose-600 font-bold mt-1 ml-1">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-1">
              <AuthInput label="Official Contact" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+91 0000 000000" />
              {fieldErrors.phone && <p className="text-[11px] text-rose-600 font-bold mt-1 ml-1">{fieldErrors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AuthInput label="Country" name="country" value={form.country} onChange={handleChange} placeholder="e.g. India" required />
            <AuthInput label="State" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Maharashtra" required />
            <AuthInput label="Headquarters" name="district" value={form.district} onChange={handleChange} placeholder="e.g. Mumbai" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AuthInput label="GSTIN" name="gst_number" required value={form.gst_number} onChange={handleChange} placeholder="GST Identity Number" />
            <AuthInput label="CIN" name="cin_number" required value={form.cin_number} onChange={handleChange} placeholder="Corporate Identity Number" />
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Legal Documentation (PDF)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileField label="Incorporation Certificate" name="incorporation_certificate" />
              <FileField label="Corporate PAN Card" name="pan_document" />
              <FileField label="Founder ID Authorization" name="founder_id_proof" />
              <FileField label="MSME / Registration Proof" name="registration_proof" />
            </div>
          </div>

          <AuthInput label="Admin Access Password" name="password" type="password" required minLength={8} value={form.password} onChange={handleChange} placeholder="••••••••" />

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500 text-center">
              <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <AuthButton loading={loading}>
              Initialize Verification Pipeline <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" />
            </AuthButton>
          </div>

          <div className="pt-8 text-center border-t border-slate-50">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Already partnered?</p>
            <Link to="/auth/company/login" className="group inline-flex items-center gap-2 text-sm font-bold text-[#27187E] hover:text-[#1C1064] transition-all">
              Access corporate portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyRegisterPage;
