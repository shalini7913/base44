import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AuthLayout({ icon: Icon = ShieldAlert, title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-md mb-2">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
            <span>RESQ</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">NETWORK</span>
          </h1>
          {title && <h2 className="text-base font-semibold text-slate-800">{title}</h2>}
          {subtitle && <p className="text-xs text-slate-500 max-w-xs mx-auto">{subtitle}</p>}
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {children}
        </div>

        {footer && (
          <div className="text-center text-xs text-slate-500">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
