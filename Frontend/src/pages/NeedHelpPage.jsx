import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronRight, Menu, X, ArrowRight, User, Building2, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../hooks/useAuth';
import SEO from '../SEO';

function NeedHelpPage() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiClient.post('/help/', formData);
      setIsSuccess(true);
      toast.success('Your request has been sent successfully!');
      setFormData({ ...formData, description: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Need Help? | GetJobAndGo"
        description="Facing any issue with GetJobAndGo? Tell us your problem and we will fix it quickly."
        canonical="https://getjobandgo.com/help"
      />

      <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-primary-500/10 selection:text-primary-700">
        {/* Navigation Bar */}
        <nav className="border-b border-slate-100/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 h-[88px] flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                 <img src="/logo.png" alt="Get Job And Go Logo" draggable="false" className="w-7 h-7 md:w-8 md:h-8 object-contain rounded-lg select-none" />
              </div>
              <span className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#27187E]">
                GetJob<span className="text-primary-500 italic relative">AndGo</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest">
                <Link to="/" className="text-slate-400 hover:text-[#27187E] transition-colors">Home</Link>
                <Link to="/about" className="text-slate-400 hover:text-[#27187E] transition-colors">About</Link>
                <Link to="/2ex" className="text-slate-400 hover:text-[#27187E] transition-colors">2eX AI</Link>
                <Link to="/jobs" className="text-slate-400 hover:text-[#27187E] transition-colors">Opportunities</Link>
                <Link to="/help" className="text-[#27187E]">Need Help?</Link>
              </div>

              {user ? (
                <Link to={user.role === 'company' ? '/company/dashboard' : '/student/dashboard'} className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                  Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <div className="flex items-center gap-4 pl-10 border-l border-slate-100 h-10">
                  <Link to="/auth/login" className="px-6 py-3.5 rounded-full text-slate-500 hover:text-[#27187E] hover:bg-slate-50 transition-all font-black text-[11px] uppercase tracking-widest">Login</Link>
                  <Link to="/auth/register" className="px-8 py-3.5 rounded-full bg-[#27187E] text-white hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20 font-black text-[11px] uppercase tracking-widest">Start Free</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2.5 rounded-2xl bg-slate-50 text-[#27187E] hover:bg-primary-50 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Mobile Navigation Drawer */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-[88px] inset-x-0 h-[calc(100vh-88px)] bg-white/95 backdrop-blur-2xl flex flex-col pt-8 animate-in slide-in-from-top-4 duration-300 z-50 px-6 pb-12 overflow-y-auto">
              {/* Similar to AboutPage Mobile Nav */}
              <div className="flex flex-col gap-8 text-sm font-black uppercase tracking-widest pb-10 border-b border-slate-100">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-400">Home</Link>
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-slate-400">About</Link>
                <Link to="/help" onClick={() => setIsMenuOpen(false)} className="text-[#27187E]">Need Help?</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Content Section */}
        <main className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100">
                    <HelpCircle className="w-8 h-8 text-[#27187E]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight mb-4">
                    Need Help?
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    Facing any issue with GetJobAndGo?<br className="hidden sm:block" /> Tell us your problem and we will fix it quickly.
                </p>
            </div>

            {!user ? (
                <div className="bg-white border border-slate-100 p-12 md:p-16 rounded-[3.5rem] text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
                        <User className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-3xl font-serif font-black tracking-tight text-slate-900 mb-4">
                        Login Required
                    </h2>
                    <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto mb-8">
                        Sign in to your account to submit a help request. This ensures our support team can verify your details and respond directly to you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/auth/login"
                            className="w-full sm:w-auto px-10 py-4 bg-[#27187E] text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20"
                        >
                            Student Login
                        </Link>
                        <Link
                            to="/auth/company/login"
                            className="w-full sm:w-auto px-10 py-4 bg-primary-50 text-primary-700 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-primary-100 transition-colors border border-primary-100"
                        >
                            Company Login
                        </Link>
                    </div>
                </div>
            ) : isSuccess ? (
                <div className="bg-white border border-emerald-100 p-12 rounded-[3.5rem] shadow-sm text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-serif font-black tracking-tight text-slate-900 mb-4">Request Received!</h2>
                    <p className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto mb-10">
                        Thank you for reaching out, {formData.name}. Our support engineers are looking into your request. We'll get back to you shortly via {formData.email}.
                    </p>
                    <button 
                        onClick={() => setIsSuccess(false)}
                        className="px-8 py-4 bg-[#27187E] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-[#27187E]/20"
                    >
                        Submit Another Request
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-slate-100 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <MessageSquare className="w-64 h-64 text-[#27187E] -mt-10 -mr-10 rotate-12" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-[#27187E] ml-2">Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <User size={18} className="text-slate-300" />
                                    </div>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-12 pr-6 py-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[11px] font-black uppercase tracking-widest text-[#27187E] ml-2">Email</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[11px] font-black uppercase tracking-widest text-[#27187E] ml-2">Describe your problem</label>
                            <textarea 
                                required
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium resize-none leading-relaxed"
                                placeholder="Please provide all necessary details regarding the issue you're facing..."
                            ></textarea>
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-12 py-5 bg-[#27187E] hover:bg-primary-600 text-white rounded-full font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-[#27187E]/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            )}
        </main>
      </div>
    </>
  );
}

export default NeedHelpPage;
