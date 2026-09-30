import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFOUND() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
      <h1 className="text-3xl font-extrabold text-white">404 - Grid Node Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">The emergency route or command sector requested does not exist or has been relocated.</p>
      <Button asChild variant="rescue">
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
