import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UsersRound, Calendar, RefreshCw } from 'lucide-react';
import DataTable from '../../components/DataTable';
import ErrorState from '../../components/ErrorState';
import { fetchGroups } from './groupsService';
import { formatDate } from '../../utils/formatters';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorHistory, setCursorHistory] = useState([]);
  const [currentCursor, setCurrentCursor] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const loadGroups = async (cursor = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchGroups({ pageSize: 10, cursor });
      setGroups(res.groups);
      setHasMore(res.hasMore);
      setCurrentCursor(res.lastVisible);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError(err.message || 'Could not load households list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleNextPage = () => {
    if (!currentCursor || !hasMore) return;
    setCursorHistory((prev) => [...prev, groups[0]?._rawDoc || null]);
    setPage((p) => p + 1);
    loadGroups(currentCursor);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();
    setCursorHistory(newHistory);
    setPage((p) => p - 1);
    loadGroups(prevCursor);
  };

  const filteredGroups = groups.filter((g) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (g.name && g.name.toLowerCase().includes(term)) ||
      (g.inviteCode && g.inviteCode.toLowerCase().includes(term)) ||
      (g.category && g.category.toLowerCase().includes(term)) ||
      g.id.toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'Household / Group',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center font-bold text-xs shadow-2xs">
            {row.name ? row.name.charAt(0).toUpperCase() : 'H'}
          </div>
          <div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {row.name || 'Unnamed Household'}
            </span>
            <span className="block text-xs text-slate-400 dark:text-slate-500 capitalize">
              {row.category || 'General'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Invite Code',
      accessor: 'inviteCode',
      render: (row) => (
        <code className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
          {row.inviteCode || '—'}
        </code>
      ),
    },
    {
      header: 'Total Members',
      accessor: 'memberCount',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
          {row.memberIds?.length || row.memberCount || 1} members
        </span>
      ),
    },
    {
      header: 'Created Date',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(row.createdAt)}</span>
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
            placeholder="Search by name, invite code or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-2xs"
          />
        </div>

        <button
          onClick={() => loadGroups()}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Households"
          message={error}
          onRetry={() => loadGroups()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredGroups}
          isLoading={isLoading}
          emptyTitle="No households found"
          emptyDescription="No household groups matched your search."
          onRowClick={(row) => navigate(`/groups/${row.id}`)}
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
