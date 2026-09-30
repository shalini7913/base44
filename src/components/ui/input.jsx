import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';
