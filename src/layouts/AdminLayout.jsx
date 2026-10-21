import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Sidebar (Desktop Persistent, Mobile Drawer) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        {/* Sticky Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Body with Route Change Animation */}
        <main
          key={location.pathname}
          className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-page-enter"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
