import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Receipt,
  Settings,
  LogOut,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthProvider';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Groups', path: '/groups', icon: UsersRound },
    { label: 'Expenses', path: '/expenses', icon: Receipt },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-300 border-r border-slate-800 dark:border-slate-800/80 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-emerald-400/40 transition-all duration-200">
              <Wallet className="w-5 h-5 text-emerald-400 group-hover:rotate-6 transition-transform duration-200" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">Kharcha Paani</span>
              <span className="block text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-400 font-semibold border-l-2 border-emerald-400 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 hover:translate-x-1'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Status & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 dark:bg-slate-950/60">
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 active:scale-[0.98] hover:translate-x-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
