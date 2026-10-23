import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GuestRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream-50 gap-3">
        <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={redirect ? decodeURIComponent(redirect) : '/account'} replace />;
  }

  return children;
};
export default GuestRoute;
