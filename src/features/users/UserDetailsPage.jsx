import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, UsersRound, ExternalLink } from 'lucide-react';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { fetchUserById, fetchUserHouseholds } from './usersService';
import { formatDate } from '../../utils/formatters';

export default function UserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [households, setHouseholds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      setError(null);
      try {
        const [userData, userHouseholds] = await Promise.all([
          fetchUserById(userId),
          fetchUserHouseholds(userId),
        ]);
        if (!userData) {
          setError('User document not found in Firestore.');
        } else {
          setUser(userData);
          setHouseholds(userHouseholds);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err.message || 'Failed to load user profile.');
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading user details..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="py-12 space-y-4">
        <button
          onClick={() => navigate('/users')}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Users
        </button>
        <ErrorState
          title="User Not Found"
          message={error || 'Could not locate this user record.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header / Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/users')}
          type="button"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name || 'Anonymous User'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            UID: <code className="font-mono text-slate-700 dark:text-slate-300">{user.id}</code>
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-center font-bold text-xl shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user.name || 'User Record'}</h3>
                {user.isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email || 'No email attached'}</p>
            </div>
          </div>
        </div>

        {/* User Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-sm">
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">User Identifier</span>
            <code className="text-xs font-mono bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg block text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60">
              {user.id}
            </code>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Registered Email</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email || '—'}</span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">Registration Date</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Associated Households Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <UsersRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Associated Households</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
            {households.length} Joined
          </span>
        </div>

        {households.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
            This user has not joined any shared households yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {households.map((hh) => (
              <div
                key={hh.id}
                onClick={() => navigate(`/groups/${hh.id}`)}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs transition-all active:scale-[0.99] cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{hh.name || 'Unnamed Household'}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Invite Code: <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{hh.inviteCode}</code>
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
