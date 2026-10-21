import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry = null,
  className = '',
}) {
  return (
    <div
      className={`p-8 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 text-center flex flex-col items-center justify-center transition-colors duration-200 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100/90 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900 dark:text-rose-200 mb-1">{title}</h3>
      <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
