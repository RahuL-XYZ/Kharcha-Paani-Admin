import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Receipt, Filter, RefreshCw, IndianRupee } from 'lucide-react';
import DataTable from '../../components/DataTable';
import ErrorState from '../../components/ErrorState';
import { fetchAllExpenses } from './expensesService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cursorHistory, setCursorHistory] = useState([]);
  const [currentCursor, setCurrentCursor] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const loadExpenses = async (cursor = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAllExpenses({ pageSize: 15, cursor });
      setExpenses(res.expenses);
      setHasMore(res.hasMore);
      setCurrentCursor(res.lastVisible);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setError(err.message || 'Could not load expense records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleNextPage = () => {
    if (!currentCursor || !hasMore) return;
    setCursorHistory((prev) => [...prev, expenses[0]?._rawDoc || null]);
    setPage((p) => p + 1);
    loadExpenses(currentCursor);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();
    setCursorHistory(newHistory);
    setPage((p) => p - 1);
    loadExpenses(prevCursor);
  };

  const categories = ['ALL', ...Array.from(new Set(expenses.map((e) => e.category || 'Other')))];

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      !searchTerm ||
      (e.title && e.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.groupName && e.groupName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.category && e.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || (e.category || 'Other') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      header: 'Expense Item',
      accessor: 'title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{row.title || 'Untitled Expense'}</span>
            <span className="block text-xs text-slate-400 dark:text-slate-500 capitalize">{row.category || 'General'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: 'Household Group',
      accessor: 'groupName',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
          {row.groupName}
        </span>
      ),
    },
    {
      header: 'Split & Participants',
      accessor: 'participants',
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
          {row.splitType || 'Equal'} ({row.participants?.length || 1} people)
        </span>
      ),
    },
    {
      header: 'Transaction Date',
      accessor: 'date',
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(row.date || row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, group or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer focus:outline-hidden"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <button
            onClick={() => loadExpenses()}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Expenses"
          message={error}
          onRetry={() => loadExpenses()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredExpenses}
          isLoading={isLoading}
          emptyTitle="No expenses found"
          emptyDescription="No recorded transaction records matched your search filters."
          onRowClick={(row) =>
            navigate(`/expenses/${row.id}?householdId=${row.householdId || ''}`)
          }
          pagination={{
            page,
            hasPrev: page > 1,
            hasNext: hasMore,
            onPrev: handlePrevPage,
            onNext: handleNextPage,
          }}
        />
      )}
    </div>
  );
}
