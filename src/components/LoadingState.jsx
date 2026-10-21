import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading data...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 ${className}`}>
      <div className="relative mb-3.5">
        {/* Ambient emerald blur ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 blur-md animate-pulse" />
        <Loader2 className="relative w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 animate-pulse">
        {message}
      </p>
    </div>
  );
}
