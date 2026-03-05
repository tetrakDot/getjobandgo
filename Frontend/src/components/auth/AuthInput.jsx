import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Standardized Input Component for Auth Module
 */
function AuthInput({ label, id, name, type = 'text', required = false, placeholder, value, onChange, error, disabled = false, minLength }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center ml-0.5">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#27187E]/60" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      
      <div className="relative group">
        <input
          id={id}
          name={name}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-5 py-4 rounded-2xl bg-slate-50 border transition-all font-medium text-sm
            ${error 
              ? 'border-rose-100 ring-rose-500/10 focus:ring-rose-500/15 focus:border-rose-500 text-rose-600' 
              : 'border-slate-100 ring-primary-500/10 focus:ring-4 focus:ring-primary-100 focus:border-[#27187E] focus:bg-white text-slate-900 placeholder:text-slate-300'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        
        {isPassword && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-[#27187E] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="ml-1 text-[11px] font-bold text-rose-500 uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthInput;
