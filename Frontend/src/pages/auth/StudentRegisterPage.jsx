import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../../services/authService';
import { trackRegistration } from '../../utils/analytics';
import { ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

function StudentRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    country: '',
    state: '',
    district: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      const data = await registerStudent(form);
      trackRegistration(data.user?.id || 'new_student');
      navigate('/auth/login', { replace: true, state: { registrationSuccess: true } });
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData && typeof responseData === 'object') {
        // Extract field-level errors
        const fields = {};
        let generalError = '';
        Object.entries(responseData).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : msgs;
          if (['email', 'phone', 'password', 'full_name'].includes(field)) {
            fields[field] = msg;
          } else {
            generalError = msg;
          }
        });
        if (Object.keys(fields).length > 0) {
          setFieldErrors(fields);
          setError('Please fix the errors below.');
        } else {
          setError(generalError || 'Unable to register. Please review your details.');
        }
      } else {
        setError('Connection failed. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
           <UserPlus size={14} className="text-[#27187E]" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27187E]">
             Candidate Enrollment
           </p>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
          Join our professional community and start applying to premium opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AuthInput
            label="Full Name"
            id="full_name"
            name="full_name"
            required
            value={form.full_name}
            onChange={handleChange}
            placeholder="Alex Johnson"
          />
          <AuthInput
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 0000 000000"
          />
          {fieldErrors.phone && (
            <p className="text-[11px] text-rose-600 font-bold mt-1 ml-1">{fieldErrors.phone}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AuthInput
            label="Country"
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="e.g. India"
          />
          <AuthInput
            label="State"
            id="state"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="e.g. Kerala"
          />
          <AuthInput
            label="District"
            id="district"
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="e.g. Ernakulam"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AuthInput
            label="Email Address"
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="alex@example.com"
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-rose-600 font-bold mt-1 ml-1">{fieldErrors.email}</p>
          )}
          <AuthInput
            label="Security Key"
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed text-center">{error}</p>
          </div>
        )}

        <AuthButton loading={loading}>
          Join the Network <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </AuthButton>


        <div className="pt-8 space-y-6">
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Already a member?</p>
            <Link 
              to="/auth/login" 
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#27187E] hover:text-[#1C1064] transition-all"
            >
              Access your portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default StudentRegisterPage;
