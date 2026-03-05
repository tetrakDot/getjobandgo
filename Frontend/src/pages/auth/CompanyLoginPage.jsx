import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { trackLogin } from '../../utils/analytics';
import { ShieldCheck, Lock, ArrowRight, Briefcase, CheckCircle } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

function CompanyLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
  
  const registrationSuccess = location.state?.registrationSuccess;
  const resetSuccess = location.state?.resetSuccess;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role !== 'company') {
        setError('Please use a company account for this portal.');
        setLoading(false);
        return;
      }
      setUser(data.user);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      trackLogin(data.user.id);
      navigate('/company/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-3">
           <Briefcase size={14} className="text-[#27187E]" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27187E]">
             Organization Portal
           </p>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Partner Login
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
          Access your talent management dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {(registrationSuccess || resetSuccess) && (
          <div className="p-4 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center gap-3 animate-in bounce-in duration-1000">
             <CheckCircle size={16} className="text-[#10b981]" />
             <p className="text-[11px] text-[#10b981] font-bold uppercase tracking-tight text-center">
               {registrationSuccess ? 'Company Onboarded Successfully!' : 'Password updated successfully!'}
             </p>
          </div>
        )}

        <AuthInput
          label="Organization Email"
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hr@enterprise.com"
          error={error.includes('email') ? error : ''}
        />

        <div className="space-y-1">
          <AuthInput
            label="Security Key"
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={error.includes('password') ? error : ''}
          />
        </div>

        {error && !error.includes('email') && !error.includes('password') && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed text-center">{error}</p>
          </div>
        )}

        <AuthButton loading={loading}>
          Access Dashboard <Lock size={14} className="group-hover:translate-x-1 transition-transform" />
        </AuthButton>

        <div className="pt-8 space-y-6">
          <div className="text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">New enterprise?</p>
            <Link 
              to="/auth/company/register" 
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#27187E] hover:text-[#1C1064] transition-all"
            >
              Onboard your company <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-50 text-center">
             <Link to="/auth/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary-600 transition-colors">
                Candidate Access →
             </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default CompanyLoginPage;
