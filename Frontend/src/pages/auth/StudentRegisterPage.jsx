import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../../services/authService';
import { Eye, EyeOff, Lock } from 'lucide-react';

function StudentRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    skills: '',
    country: '',
    state: '',
    district: '',
    email: '',
    password: ''
  });
  const [resume, setResume] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Resume PDF must be under 2MB.');
        e.target.value = '';
        setResume(null);
        return;
      }
      setResume(file);
    } else {
      setResume(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerStudent({ ...form, resume });
      navigate('/auth/login', { replace: true });
    } catch (err) {
      setError('Unable to register. Please review your details.');
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
             Talent Network
           </p>
        </div>
        <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">Create your account</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
          Build your professional profile, upload your resume, and start applying to verified opportunities.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="full_name">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="phone">
              Phone Number
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
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="skills">
            Core Expertise
          </label>
          <input
            id="skills"
            name="skills"
            placeholder="e.g. React, Python, UI/UX Design"
            value={form.skills}
            onChange={handleChange}
            className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
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
              placeholder="e.g. Kerala"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="district">
              District
            </label>
            <input
              id="district"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="e.g. Ernakulam"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="resume">
            Digital Resume (PDF)
          </label>
          <div className="relative group">
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-xs font-bold text-slate-400 file:mr-6 file:py-3.5 file:px-8 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-slate-100 file:text-slate-700 hover:file:bg-primary-500 hover:file:text-white file:transition-all cursor-pointer bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="password">
              Account Password
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
          {loading ? 'Processing Registration…' : (
            <>
              Join the Network <Lock size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default StudentRegisterPage;

