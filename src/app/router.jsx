import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import UnauthorizedPage from '../features/auth/UnauthorizedPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import UsersPage from '../features/users/UsersPage';
import UserDetailsPage from '../features/users/UserDetailsPage';
import GroupsPage from '../features/groups/GroupsPage';
import GroupDetailsPage from '../features/groups/GroupDetailsPage';
import ExpensesPage from '../features/expenses/ExpensesPage';
import ExpenseDetailsPage from '../features/expenses/ExpenseDetailsPage';
import SettingsPage from '../features/settings/SettingsPage';
import EmptyState from '../components/EmptyState';
import { AlertCircle } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <EmptyState
        icon={AlertCircle}
        title="Page Not Found"
        description="The requested admin page or resource does not exist."
        action={
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Return to Dashboard
          </a>
        }
      />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'users/:userId',
        element: <UserDetailsPage />,
      },
      {
        path: 'groups',
        element: <GroupsPage />,
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetailsPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'expenses/:expenseId',
        element: <ExpenseDetailsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
