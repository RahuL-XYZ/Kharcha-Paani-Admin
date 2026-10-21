import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null,
  className = '',
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-xs hover:shadow-lg dark:hover:shadow-emerald-950/20 hover:-translate-y-1 transition-all duration-300 ease-out ${className}`}
    >
      {/* Subtle top ambient accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60 shadow-2xs group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 transition-all duration-300">
            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-3" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </h4>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
