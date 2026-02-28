import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../services/authService';

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
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
          Student portal
        </p>
        <h2 className="text-xl font-semibold text-slate-50 tracking-tight">Create account</h2>
        <p className="mt-1 text-xs text-slate-400">
          Build your profile, upload your resume, and start applying to verified jobs.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="full_name">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200" htmlFor="skills">
            Skills
          </label>
          <input
            id="skills"
            name="skills"
            placeholder="React, Django, SQL"
            value={form.skills}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="state">
              State
            </label>
            <input
              id="state"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="district">
              District
            </label>
            <input
              id="district"
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200" htmlFor="resume">
            Resume (PDF)
          </label>
          <input
            id="resume"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-xs file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-600 file:text-slate-50 file:mr-3 text-slate-300"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 px-3 py-2 rounded-xl bg-primary-600 text-sm font-medium text-slate-50 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

export default StudentRegisterPage;

