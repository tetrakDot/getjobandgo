import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanies } from '../../services/companyService';
import { Search, Loader2, Building2, CheckCircle2, MapPin, Globe, ExternalLink } from 'lucide-react';

function CompaniesListPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    listCompanies()
      .then((data) => {
        setCompanies(data.results ?? data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCompanies = companies.filter(company => 
    company.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.company_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Partner Companies
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Connecting students with leading organizations and innovative startups across the nation.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search companies, industries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-primary-500 w-10 h-10" />
          <p className="text-sm text-slate-500 font-medium tracking-tight">Loading partner network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="group relative bg-white border border-slate-100 rounded-3xl p-5 hover:border-primary-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(39,24,126,0.08)] active:scale-[0.99] overflow-hidden block"
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
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors truncate">
                      {company.company_name}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {company.verification_status === 'verified' && (
                        <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50/50" />
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
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
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
          ))}
        </div>
      )}

      {!loading && filteredCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Building2 size={24} className="text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold mb-1">Company not found</h3>
          <p className="text-sm text-slate-500">Check back later or try a different search phrase.</p>
        </div>
      )}
    </div>
  );
}

export default CompaniesListPage;
