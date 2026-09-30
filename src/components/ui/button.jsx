import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
  
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    rescue: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',
    outline: 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 shadow-sm',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
  };

  const sizes = {
    default: 'h-10 px-5 py-2 text-sm',
    sm: 'h-8 px-3.5 text-xs',
    lg: 'h-12 px-7 text-base font-semibold',
    icon: 'h-10 w-10 p-0',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';
