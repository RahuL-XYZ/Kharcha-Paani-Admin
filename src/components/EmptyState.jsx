import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display.',
  action = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-200 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 border border-slate-100 dark:border-slate-700/60 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
