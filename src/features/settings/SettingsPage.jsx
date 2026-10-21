import React from 'react';
import {
  ShieldCheck,
  Server,
  Smartphone,
  Info,
  Mail,
  Code,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
  const { user, claims, isFirebaseConfigured } = useAuth();
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Theme Appearance Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60 shadow-2xs">
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customize admin panel interface styling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
            <div className="text-left">
              <span className="block text-sm font-bold">Light Theme</span>
              <span className="block text-xs opacity-75">Clean white and slate aesthetics</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-semibold ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div className="text-left">
              <span className="block text-sm font-bold">Dark Obsidian</span>
              <span className="block text-xs opacity-75">Sleek, high contrast dark theme</span>
            </div>
          </button>
        </div>
      </div>

      {/* Administrator Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/60 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Administrator Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Currently active authenticated session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5 font-medium">Admin Email</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email || '—'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5 font-medium">Account UID</span>
            <code className="text-xs font-mono text-slate-700 dark:text-slate-300">{user?.uid || '—'}</code>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5 font-medium">Admin Custom Claim</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {claims?.admin ? 'admin: true (Verified)' : 'Pending Claim'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
            <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5 font-medium">Auth Provider</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Firebase Authentication</span>
          </div>
        </div>
      </div>

      {/* System & Architecture Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Application Architecture</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Environment and build diagnostics</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Application Name</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Kharcha Paani Admin Portal</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Companion Client</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Kharcha Paani (Flutter Mobile App)</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Admin Panel Version</span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              v0.2.0 (Theme & Micro-interactions)
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-600 dark:text-slate-400">Firebase Connectivity</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              Connected (kharchapaani-890b8)
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">Read-Only Safety Guarantee</span>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Enabled (Destructive writes disabled)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
