import React from 'react';
import { cn } from '@/lib/utils';

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      'text-xs font-semibold text-slate-700 select-none',
      className
    )}
    {...props}
  />
));
Label.displayName = 'Label';
