import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, Shield, RefreshCw } from 'lucide-react';
import DataTable from '../../components/DataTable';
import ErrorState from '../../components/ErrorState';
import { fetchUsers } from './usersService';
import { formatDate } from '../../utils/formatters';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorHistory, setCursorHistory] = useState([]);
  const [currentCursor, setCurrentCursor] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  const loadUsers = async (cursor = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchUsers({ pageSize: 10, cursor });
      setUsers(res.users);
      setHasMore(res.hasMore);
      setCurrentCursor(res.lastVisible);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Could not load users list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleNextPage = () => {
    if (!currentCursor || !hasMore) return;
    setCursorHistory((prev) => [...prev, users[0]?._rawDoc || null]);
    setPage((p) => p + 1);
    loadUsers(currentCursor);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();
    setCursorHistory(newHistory);
    setPage((p) => p - 1);
    loadUsers(prevCursor);
  };

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      u.id.toLowerCase().includes(term)
    );
  });

  const columns = [
    {
      header: 'User Profile',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shadow-2xs">
            {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {row.name || 'Anonymous User'}
              </span>
              {row.isAdmin && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                  <Shield className="w-2.5 h-2.5" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{row.email || 'No email attached'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'User ID (UID)',
      accessor: 'id',
      render: (row) => (
        <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700/60">
          {row.id}
        </code>
      ),
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Account Status',
      accessor: 'status',
      align: 'center',
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
          <UserCheck className="w-3 h-3" />
          Active
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-2xs"
          />
        </div>

        <button
          onClick={() => loadUsers()}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Users"
          message={error}
          onRetry={() => loadUsers()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          emptyTitle="No users found"
          emptyDescription="No registered user profiles matched your search."
          onRowClick={(row) => navigate(`/users/${row.id}`)}
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
