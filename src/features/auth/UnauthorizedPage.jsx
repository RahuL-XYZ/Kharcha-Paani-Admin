import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Administrator Access Required
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You are signed in as <strong className="text-slate-900">{user?.email || 'an authenticated user'}</strong>, but this account does not possess the required <code className="px-1.5 py-0.5 rounded bg-slate-100 text-xs font-mono text-slate-800">admin: true</code> custom claim.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs text-slate-500 mb-6 text-left space-y-1">
          <p className="font-semibold text-slate-700">How to get access:</p>
          <p>Administrator privileges must be assigned through a secure server-side process using the Firebase Admin SDK or Cloud Functions.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/login')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
          <button
            onClick={handleSignOut}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-sm font-medium text-white transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
