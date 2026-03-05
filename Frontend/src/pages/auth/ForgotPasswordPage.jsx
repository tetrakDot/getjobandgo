import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';
import { KeyRound, ArrowLeft, Send } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      // On success, redirect to verify OTP with email in state
      // If we are in dev mode and email failed, the code might be in data.otp_code
      navigate('/auth/verify-otp', { 
        state: { 
          email, 
          devOtp: data.otp_code,
          message: data.detail 
        } 
      });
    } catch (err) {
      const responseData = err.response?.data;
      let errorMsg = 'No account found with this email.';
      
      if (typeof responseData === 'object') {
        errorMsg = responseData.detail || responseData.email?.[0] || Object.values(responseData)[0]?.[0] || errorMsg;
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
           <KeyRound size={14} className="text-[#27187E]" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27187E]">
             Identity Recovery
           </p>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Forgot Password</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
          Enter your email and we'll send a verification code to reset your key.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Account Email"
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed text-center">{error}</p>
          </div>
        )}

        <AuthButton loading={loading}>
          Send Verification Code <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </AuthButton>

        <div className="pt-8 text-center">
          <Link 
            to="/auth/login" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#27187E] transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
          </Link>
        </div>
      </form>
    </>
  );
}

export default ForgotPasswordPage;
