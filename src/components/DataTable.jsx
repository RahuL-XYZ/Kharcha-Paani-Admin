import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'No records match your criteria.',
  pagination = null,
  onRowClick = null,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3.5 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <LoadingState message="Loading records..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors duration-150 ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
                      : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-5 py-3.5 ${
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      } ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span>
              Page <strong className="text-slate-900 dark:text-slate-100">{pagination.page || 1}</strong>
              {pagination.totalPages ? ` of ${pagination.totalPages}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={pagination.onPrev}
              disabled={!pagination.hasPrev}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 font-medium shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <button
              onClick={pagination.onNext}
              disabled={!pagination.hasNext}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 font-medium shadow-2xs cursor-pointer"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
