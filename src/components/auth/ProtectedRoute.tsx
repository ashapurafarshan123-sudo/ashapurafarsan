import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream-50 gap-3">
        <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-brown-500">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }

  return children;
};
export default ProtectedRoute;
