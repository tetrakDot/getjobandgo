import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanies } from '../../services/companyService';
import { Search, Loader2, Building2, CheckCircle2, MapPin, Globe, ExternalLink, Sparkles, X } from 'lucide-react';

function CompanyCard({ company, isFeatured }) {
  return (
    <Link
      to={`/companies/${company.id}`}
      className={`group relative bg-white border rounded-3xl p-5 transition-all duration-500 active:scale-[0.99] overflow-hidden block ${
        isFeatured 
        ? 'border-primary-100 shadow-[0_20px_40px_rgba(39,24,126,0.06)] hover:shadow-[0_25px_60px_rgba(39,24,126,0.12)] hover:border-primary-300' 
        : 'border-slate-100 hover:border-primary-200 hover:shadow-[0_20px_50px_rgba(39,24,126,0.08)]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary-50 transition-colors shrink-0 overflow-hidden">
          {company.logo ? (
            <img src={company.logo} alt={company.company_name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-slate-300 group-hover:text-primary-500 transition-transform duration-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate uppercase tracking-tight">
              {company.company_name}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {company.verification_status === 'verified' && (
                <CheckCircle2 size={16} className="text-emerald-500" />
              )}
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 uppercase font-black tracking-widest">
                {company.company_type || 'Org'}
              </span>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
            {company.company_description || 'Innovation driven technology partner focusing on future solutions.'}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
              <MapPin size={14} className="text-primary-400" />
              {company.location?.toLowerCase().includes('remote') ? 'Remote' : (company.location || 'Pan India')}
            </div>
            {company.website && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 hidden sm:flex">
                <Globe size={14} className="text-primary-400" />
                <span className="truncate max-w-[120px]">{company.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            <div className="ml-auto text-primary-600 font-black tracking-widest uppercase text-[10px] group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              Explore <ExternalLink size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompaniesListPage() {
  const [companies, setCompanies] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCompanies, setFeaturedCompanies] = useState([]);

  const isSearching = searchQuery !== "";

  useEffect(() => {
    if (isSearching) {
      setLoadingAll(true);
      const timer = setTimeout(() => {
        const params = {};
        if (searchQuery) params.search = searchQuery;

        listCompanies(params)
          .then((data) => setCompanies(data.results ?? data))
          .catch((err) => console.error(err))
          .finally(() => setLoadingAll(false));
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setCompanies([]);
    }
  }, [searchQuery, isSearching]);

  useEffect(() => {
    // Fetch 6 random featured companies for default view
    listCompanies({ random: 6 })
      .then((data) => {
        setFeaturedCompanies(data.results ?? data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredCompanies = companies;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Partner Companies</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Connecting students with leading organizations and innovative startups across the nation.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search companies by name, type..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary-500 w-10 h-10" />
          <p className="text-sm text-slate-500 font-medium tracking-tight">Loading partner network...</p>
        </div>
      ) : isSearching ? (
        /* ─── SEARCH RESULTS VIEW ─── */
        <div className="space-y-6 pb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="text-slate-400 w-4 h-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Search Results for "{searchQuery}"
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          </div>

          {loadingAll ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
              <p className="text-sm text-slate-400 font-medium">Searching all companies...</p>
            </div>
          ) : filteredCompanies.length > 0 ? (
            <>
              <p className="text-xs text-slate-400 font-bold">
                Found <span className="text-primary-600">{filteredCompanies.length}</span> {filteredCompanies.length === 1 ? 'company' : 'companies'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Building2 size={24} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1 uppercase tracking-tight">No companies found</h3>
              <p className="text-sm text-slate-500 mb-4">No results for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors"
              >
                ← Back to Featured
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── DEFAULT VIEW : 6 RANDOM FEATURED ─── */
        <div className="space-y-6 pb-12">
          <div className="flex items-center gap-3">
            <Sparkles className="text-primary-500 w-5 h-5 animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Featured Organizations</h2>
            <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Use the search to find more →
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} isFeatured />
            ))}
          </div>

          {/* Prompt to search */}
          <div className="mt-8 p-6 rounded-3xl border border-dashed border-primary-100 bg-primary-50/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center shrink-0">
              <Search size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Looking for a specific company?</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Use the search bar above to find any company by name, type, or industry.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesListPage;
