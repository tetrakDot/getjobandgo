import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standardized Primary CTA Button for Auth Module
 */
function AuthButton({ children, loading = false, disabled = false, type = 'submit', onClick, variant = 'primary' }) {
  const baseStyles = "relative w-full flex justify-center items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed group";
  
  const variants = {
    primary: "bg-[#27187E] text-white hover:bg-[#1C1064] shadow-2xl shadow-[#27187E]/10 border-0",
    secondary: "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-400 border-0 hover:text-primary-600 hover:bg-slate-50"
  };

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-white/80" />
      ) : (
        <>
          {children}
        </>
      )}
    </button>
  );
}

export default AuthButton;
