import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCompanies } from '../../services/companyService';
import { Search, Loader2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-50">
            Browse Companies
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Discover verified companies hiring on our platform.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search companies or industries..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredCompanies.map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="group rounded-2xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-primary-600 hover:bg-slate-900 transition-colors shadow-sm shadow-slate-900/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-50 group-hover:text-primary-100 flex items-center gap-2">
                    {company.company_name}
                    {company.verification_status === 'verified' && (
                      <span title="Verified" className="text-emerald-500 flex items-center">
                        <svg className="w-3.5 h-3.5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-2xl line-clamp-1">
                    {company.company_description || 'No description available'}
                  </p>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {company.company_type || 'Company'}
                </span>
              </div>
            </Link>
          ))}
          {filteredCompanies.length === 0 && (
            <p className="text-xs text-slate-500 text-center py-8">{companies.length === 0 ? "No companies available yet." : "No companies match your search."}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CompaniesListPage;
