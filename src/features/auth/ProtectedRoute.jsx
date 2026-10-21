import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import LoadingState from '../../components/LoadingState';

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading, isFirebaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingState message="Verifying administrative credentials..." />
      </div>
    );
  }

  // If Firebase environment is not yet configured, allow viewing the UI scaffold with an informative banner
  if (!isFirebaseConfigured) {
    return children;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
