import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';

function StudentLoginPage() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role !== 'student') {
        setError('Please login with a student account.');
        setLoading(false);
        return;
      }
      setUser(data.user);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to host session. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-left">
        {/* Mobile Logo */}
        <Link to="/" className="md:hidden inline-block mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#27187E] flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
           </div>
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-4">
           <ShieldCheck size={12} className="text-primary-600" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">
             Talent Portal
           </p>
        </div>
        <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
          The premium gateway to your next career chapter.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="email">
            Corporate / Student Email
          </label>
          <div className="relative group">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@university.edu"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="password">
              Security Key
            </label>
            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 transition-colors">
              Forgot?
            </button>
          </div>
          <div className="relative group">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all font-medium"
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

        <div className="flex items-center gap-3 ml-1">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-200 text-primary-500 focus:ring-primary-500/20" />
            <label htmlFor="remember" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer select-none">Stay Signed in</label>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 animate-in shake duration-500">
            <p className="text-[11px] text-rose-600 font-bold uppercase tracking-tight leading-relaxed">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group w-full flex justify-center items-center gap-3 px-6 py-4 rounded-2xl bg-[#27187E] text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-primary-600 shadow-2xl shadow-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? 'Authenticating…' : (
            <>
              Access Portal <Lock size={14} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="pt-10 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">New around here?</span>
            </div>
          </div>

          <Link 
            to="/auth/register" 
            className="w-full flex items-center justify-center py-4 rounded-2xl border-2 border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
          >
            Create your account
          </Link>

          <div className="text-center">
             <Link to="/auth/company/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-primary-600 transition-colors">
                Organization Access →
             </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default StudentLoginPage;
