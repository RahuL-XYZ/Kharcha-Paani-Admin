import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ShieldCheck, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getPageTitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard Overview';
    if (pathname.startsWith('/users')) return 'User Management';
    if (pathname.startsWith('/groups')) return 'Group Management';
    if (pathname.startsWith('/expenses')) return 'Expense Records';
    if (pathname.startsWith('/settings')) return 'Admin Settings';
    return 'Admin Panel';
  };

  const getPageSubtitle = (pathname) => {
    if (pathname.startsWith('/dashboard')) return 'Real-time metrics and system pulse';
    if (pathname.startsWith('/users')) return 'Inspect registered user accounts';
    if (pathname.startsWith('/groups')) return 'Inspect shared expense groups';
    if (pathname.startsWith('/expenses')) return 'Audit recorded expense transactions';
    if (pathname.startsWith('/settings')) return 'Admin configuration and system info';
    return '';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          type="button"
          className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            {getPageSubtitle(location.pathname)}
          </p>
        </div>
      </div>

      {/* Right: Theme Toggle & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 -rotate-12 transition-transform duration-300" />
            )}
          </div>
        </button>

        {/* Administrator Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Administrator</span>
        </div>

        {/* User Avatar & Email */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-emerald-500/20">
            {user?.email ? user.email.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden lg:block text-left text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
              {user?.displayName || user?.email || 'Admin User'}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] truncate max-w-[140px]">
              {user?.email || 'Authenticated'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
