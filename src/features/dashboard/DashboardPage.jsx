import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UsersRound,
  Receipt,
  IndianRupee,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatCard from '../../components/StatCard';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { fetchDashboardSummary } from './dashboardService';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const summary = await fetchDashboardSummary();
      setData(summary);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err.message || 'Failed to connect to Firestore.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Fetching live metrics from Firestore..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <ErrorState
          title="Could Not Load Dashboard"
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={data?.totalUsers ?? '0'}
          subtitle="Mobile application accounts"
          icon={Users}
        />
        <StatCard
          title="Active Households"
          value={data?.totalGroups ?? '0'}
          subtitle="Shared expense pools"
          icon={UsersRound}
        />
        <StatCard
          title="Total Expenses"
          value={data?.totalExpenses ?? '0'}
          subtitle="Audited transactions"
          icon={Receipt}
        />
        <StatCard
          title="Recorded Volume"
          value={formatCurrency(data?.totalRecordedVolume || 0)}
          subtitle="Recent transactions total"
          icon={IndianRupee}
        />
      </div>

      {/* Main Section: Trend Chart & Quick Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent Expense Trends
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Timeline of recorded expenditures
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-xl font-semibold shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Firestore Data</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.trendData || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={isDark ? 0.4 : 0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString('en-IN')}`,
                    'Amount',
                  ]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.15)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Recent Users List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Users
            </h3>
            <button
              onClick={() => navigate('/users')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
            {!data?.recentUsers || data.recentUsers.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                No recent users found.
              </p>
            ) : (
              data.recentUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => navigate(`/users/${u.id}`)}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl px-2.5 -mx-2.5 transition-all duration-150 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {u.name || 'Anonymous User'}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[130px]">
                        {u.email || u.id}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {formatDateShort(u.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Households / Groups Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recently Created Households
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active group expense accounts
            </p>
          </div>
          <button
            onClick={() => navigate('/groups')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            Manage Households <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase font-semibold text-[10px]">
                <th className="py-2.5">Household Name</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Invite Code</th>
                <th className="py-2.5">Members</th>
                <th className="py-2.5">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {!data?.recentGroups || data.recentGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                    No households found.
                  </td>
                </tr>
              ) : (
                data.recentGroups.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => navigate(`/groups/${g.id}`)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {g.name || 'Unnamed'}
                    </td>
                    <td className="py-3 capitalize text-slate-500 dark:text-slate-400">
                      {g.category || 'General'}
                    </td>
                    <td className="py-3">
                      <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono font-semibold text-[11px] border border-slate-200/60 dark:border-slate-700/60">
                        {g.inviteCode || '—'}
                      </code>
                    </td>
                    <td className="py-3 font-medium text-slate-600 dark:text-slate-400">
                      {g.memberIds?.length || g.memberCount || 1} member(s)
                    </td>
                    <td className="py-3 text-slate-400 dark:text-slate-500">
                      {formatDateShort(g.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
