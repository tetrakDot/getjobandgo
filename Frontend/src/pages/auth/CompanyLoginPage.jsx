import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

function CompanyLoginPage() {
  const navigate = useNavigate();
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
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
        setError('Please login with a company account.');
        setLoading(false);
        return;
      }
      setUser(data.user);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      navigate('/company/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to login. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
          Company portal
        </p>
        <h2 className="text-xl font-semibold text-slate-50 tracking-tight">
          Sign in to manage jobs
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Access your job postings, review applicants, and manage your hiring pipeline.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200" htmlFor="email">
            Company email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 px-3 py-2 rounded-xl bg-primary-600 text-sm font-medium text-slate-50 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/auth/company/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Register here
            </Link>
          </p>
          <div className="mt-2 text-center text-xs text-slate-500">
             <Link to="/auth/login" className="hover:text-slate-300 underline underline-offset-2">Go to Student Portal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CompanyLoginPage;

