import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UsersRound,
  Receipt,
  UserCheck,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import {
  fetchGroupById,
  fetchGroupMembers,
  fetchGroupExpenses,
  fetchGroupSettlements,
} from './groupsService';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function GroupDetailsPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [activeTab, setActiveTab] = useState('expenses');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGroupData() {
      setIsLoading(true);
      setError(null);
      try {
        const [groupData, groupMembers, groupExpenses, groupSettlements] = await Promise.all([
          fetchGroupById(groupId),
          fetchGroupMembers(groupId),
          fetchGroupExpenses(groupId),
          fetchGroupSettlements(groupId),
        ]);

        if (!groupData) {
          setError('Household group document not found in Firestore.');
        } else {
          setGroup(groupData);
          setMembers(groupMembers);
          setExpenses(groupExpenses);
          setSettlements(groupSettlements);
        }
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError(err.message || 'Failed to load household details.');
      } finally {
        setIsLoading(false);
      }
    }

    loadGroupData();
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading household group details..." />
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="py-12 space-y-4">
        <button
          onClick={() => navigate('/groups')}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Households
        </button>
        <ErrorState
          title="Household Not Found"
          message={error || 'Could not locate this household group record.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalExpenseSum = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header / Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/groups')}
          type="button"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {group.name || 'Unnamed Household'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Invite Code:{' '}
            <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/60">
              {group.inviteCode}
            </code>
          </p>
        </div>
      </div>

      {/* Group Info Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center font-bold text-xl shadow-xs">
              <UsersRound className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{group.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                  {group.category || 'General'}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Created on {formatDate(group.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                Total Volume
              </span>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {formatCurrency(totalExpenseSum)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-100 dark:border-slate-800 -mb-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'expenses'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'members'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'settlements'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Settlements ({settlements.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Household Expense Ledger</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{expenses.length} records</span>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No expenses recorded in this household yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                    <th className="px-4 py-3">Expense Title</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Payer UID</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{exp.title || 'Untitled'}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(exp.amount)}</td>
                      <td className="px-4 py-3 capitalize text-slate-500 dark:text-slate-400">{exp.category || 'General'}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">{exp.paidBy?.slice(0, 10)}...</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">
                        {exp.participants?.length || 1} split
                      </td>
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{formatDate(exp.date || exp.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 transition-colors duration-200">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Household Member Directory</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/users/${m.id}`)}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                    {m.name ? m.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{m.name || 'Member'}</p>
                      {m.role === 'owner' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 uppercase">
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{m.email || m.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs p-6 transition-colors duration-200">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4">Settlement History</h4>
          {settlements.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">No settlement records found.</p>
          ) : (
            <div className="space-y-3">
              {settlements.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Payment of <strong className="text-emerald-700 dark:text-emerald-400">{formatCurrency(s.amount)}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        From: <code className="font-mono">{s.fromUser?.slice(0, 8)}</code> &rarr; To: <code className="font-mono">{s.toUser?.slice(0, 8)}</code>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{formatDate(s.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
