import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOTP, forgotPassword } from '../../services/authService';
import { ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import SEO from '../../SEO';

function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const devOtp = location.state?.devOtp;
  const initialMessage = location.state?.message;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(initialMessage || '');

  useEffect(() => {
    if (!email) {
      navigate('/auth/forgot-password');
    }
    // If we have a dev OTP, pre-fill it for easier testing if needed, 
    // or just let the user see it.
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      setSuccess('Code verified successfully!');
      setTimeout(() => {
        navigate('/auth/reset-password', { state: { email, otp } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const data = await forgotPassword(email);
      setSuccess(data.detail || 'Verification code resent successfully!');
      if (data.otp_code) {
        // Update the visual feedback for the new code if in dev mode
        setSuccess(`New code sent! (Dev Mode: ${data.otp_code})`);
      }
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Wait before resending the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <SEO 
        title="Verify Account | GetJobAndGo"
        description="Verify your identity with OTP on GetJobAndGo's secure platform."
        canonical="https://getjobandgo.com/auth/verify-otp"
      />
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/5 border border-[#10b981]/20 mb-4">
           <ShieldCheck size={14} className="text-[#10b981]" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10b981]">
             Identity Verification
           </p>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verify Code</h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
          We’ve sent a 6-digit code to <span className="text-[#27187E] font-bold underline decoration-slate-200 underline-offset-4">{email}</span>.
        </p>

        {devOtp && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 animate-in fade-in zoom-in duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Development Fallback</p>
            <p className="text-sm font-bold text-amber-900">
               Your code is: <span className="text-xl tracking-[0.2em] ml-2">{devOtp}</span>
            </p>
            <p className="text-[9px] text-amber-500 mt-2 leading-tight">
              Email service failed to connect. Use this code to continue testing.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Verification Code (OTP)"
          id="otp"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="000000"
          type="number"
          minLength={6}
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-[#10b981]/5 border border-[#10b981]/10 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle size={14} className="text-[#10b981]" />
            <p className="text-[11px] text-[#10b981] font-bold uppercase tracking-tight leading-relaxed">{success}</p>
          </div>
        )}

        <AuthButton loading={loading}>
          Validate Code <CheckCircle size={14} className="group-hover:scale-110 transition-transform" />
        </AuthButton>

        <div className="pt-4 text-center">
            <button 
              type="button" 
              onClick={handleResend}
              disabled={resending}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-[#27187E] hover:text-[#1C1064] underline underline-offset-4 disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend verification code'}
            </button>
        </div>

        <div className="pt-8 text-center">
          <Link 
            to="/auth/forgot-password" 
            className="group inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#27187E] transition-all"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </Link>
        </div>
      </form>
    </>
  );
}

export default VerifyOTPPage;
