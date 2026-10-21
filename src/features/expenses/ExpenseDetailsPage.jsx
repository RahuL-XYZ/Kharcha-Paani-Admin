import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Receipt, IndianRupee, Users, Calendar, FileText, ExternalLink } from 'lucide-react';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { fetchExpenseById } from './expensesService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function ExpenseDetailsPage() {
  const { expenseId } = useParams();
  const [searchParams] = useSearchParams();
  const householdId = searchParams.get('householdId');
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadExpense() {
      setIsLoading(true);
      setError(null);
      try {
        if (!householdId) {
          setError('Missing household context for this expense.');
          setIsLoading(false);
          return;
        }

        const data = await fetchExpenseById(householdId, expenseId);
        if (!data) {
          setError('Expense record not found in Firestore.');
        } else {
          setExpense(data);
        }
      } catch (err) {
        console.error('Error fetching expense:', err);
        setError(err.message || 'Failed to load expense details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadExpense();
  }, [householdId, expenseId]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading expense transaction details..." />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="py-12 space-y-4">
        <button
          onClick={() => navigate('/expenses')}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Expenses
        </button>
        <ErrorState
          title="Expense Not Found"
          message={error || 'Could not locate this expense transaction.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/expenses')}
          type="button"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{expense.title || 'Untitled Expense'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ID: <code className="font-mono text-slate-700 dark:text-slate-300">{expense.id}</code>
          </p>
        </div>
      </div>

      {/* Main Expense Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center font-bold text-xl shadow-xs">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{expense.title}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize mt-1 inline-block">
                {expense.category || 'General'}
              </span>
            </div>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">Total Amount</span>
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{formatCurrency(expense.amount)}</span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Paid By (UID)</span>
            <code className="text-xs font-mono bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg block text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60">
              {expense.paidBy || '—'}
            </code>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Split Type</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{expense.splitType || 'Equal'}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Transaction Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(expense.date || expense.createdAt)}</span>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Associated Household</span>
            <button
              onClick={() => navigate(`/groups/${householdId}`)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline cursor-pointer"
            >
              Inspect Household Group <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Notes / Description</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
              {expense.notes || 'No extra notes provided for this transaction.'}
            </p>
          </div>
        </div>

        {/* Participants Section */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Split Participants ({expense.participants?.length || 0})
          </h4>
          <div className="flex flex-wrap gap-2">
            {expense.participants?.map((uid) => (
              <span
                key={uid}
                onClick={() => navigate(`/users/${uid}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono cursor-pointer transition-colors"
              >
                <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                {uid}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
