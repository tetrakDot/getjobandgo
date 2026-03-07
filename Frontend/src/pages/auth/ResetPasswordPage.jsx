import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SEO from '../../SEO';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!email || !otp) {
      navigate('/auth/forgot-password');
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, password);
      setSuccess('Password updated successfully!');
      setTimeout(() => {
        navigate('/auth/login', { replace: true, state: { resetSuccess: true } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Reset Password | Secure Recovery | GetJobAndGo"
        description="Set a new secure password for your GetJobAndGo account."
        canonical="https://getjobandgo.com/auth/reset-password"
      />
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/5 border border-[#10b981]/20 mb-4">
           <Lock size={14} className="text-[#10b981]" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981]">
             Security Re-configuration
           </p>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Set New Key</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
          Ensure your new security key is strong and memorable.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="New Security Key"
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <AuthInput
          label="Confirm Security Key"
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-[#10b981]/5 border border-[#10b981]/10 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
            <CheckCircle size={14} className="text-[#10b981]" />
            <p className="text-[11px] text-[#10b981] font-bold uppercase tracking-tight leading-relaxed">{success}</p>
          </div>
        )}

        <AuthButton loading={loading}>
          Update Credentials <CheckCircle size={14} className="group-hover:scale-110 transition-transform" />
        </AuthButton>

        <div className="pt-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            Account identity confirmed for {email}
        </div>
      </form>
    </>
  );
}

export default ResetPasswordPage;
