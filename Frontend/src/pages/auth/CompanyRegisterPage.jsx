import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerCompany } from '../../services/authService';

function CompanyRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    phone: '',
    company_type: '',
    country: '',
    state: '',
    district: '',
    gst_number: '',
    cin_number: '',
    password: ''
  });
  const [docs, setDocs] = useState({
    incorporation_certificate: null,
    pan_document: null,
    founder_id_proof: null,
    registration_proof: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Document must be under 2MB.');
        e.target.value = '';
        setDocs((prev) => ({ ...prev, [name]: null }));
        return;
      }
      setDocs((prev) => ({ ...prev, [name]: file }));
    } else {
      setDocs((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerCompany({ ...form, ...docs });
      navigate('/auth/company/login', { replace: true });
    } catch (err) {
      setError('Unable to register company. Please review your details and documents.');
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
          Onboard your company
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Submit your company details and documents. Admins will verify your profile before jobs go
          live.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="company_name">
              Company name
            </label>
            <input
              id="company_name"
              name="company_name"
              required
              value={form.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="company_type">
              Company type
            </label>
            <select
              id="company_type"
              name="company_type"
              required
              value={form.company_type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-600"
            >
              <option value="" disabled>Select company type</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Startup">Startup</option>
              <option value="SME">SME</option>
              <option value="MNC">MNC</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="email">
              Work email
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="gst_number">
              GST number
            </label>
            <input
              id="gst_number"
              name="gst_number"
              required
              value={form.gst_number}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="cin_number">
              CIN number
            </label>
            <input
              id="cin_number"
              name="cin_number"
              required
              value={form.cin_number}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              className="block text-xs font-medium text-slate-200"
              htmlFor="incorporation_certificate"
            >
              Incorporation certificate
            </label>
            <input
              id="incorporation_certificate"
              name="incorporation_certificate"
              type="file"
              onChange={handleFileChange}
              className="w-full text-xs file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-600 file:text-slate-50 file:mr-3 text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="pan_document">
              PAN document
            </label>
            <input
              id="pan_document"
              name="pan_document"
              type="file"
              onChange={handleFileChange}
              className="w-full text-xs file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-600 file:text-slate-50 file:mr-3 text-slate-300"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-200" htmlFor="founder_id_proof">
              Founder ID proof
            </label>
            <input
              id="founder_id_proof"
              name="founder_id_proof"
              type="file"
              onChange={handleFileChange}
              className="w-full text-xs file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-600 file:text-slate-50 file:mr-3 text-slate-300"
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="block text-xs font-medium text-slate-200"
              htmlFor="registration_proof"
            >
              Registration proof
            </label>
            <input
              id="registration_proof"
              name="registration_proof"
              type="file"
              onChange={handleFileChange}
              className="w-full text-xs file:text-xs file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-primary-600 file:text-slate-50 file:mr-3 text-slate-300"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-200" htmlFor="password">
            Admin password
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
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 px-3 py-2 rounded-xl bg-primary-600 text-sm font-medium text-slate-50 hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {loading ? 'Submitting details…' : 'Submit for verification'}
        </button>
      </form>
    </div>
  );
}

export default CompanyRegisterPage;

