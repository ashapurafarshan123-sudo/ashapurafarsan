import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream-50 gap-3">
        <div className="w-10 h-10 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-brown-500">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-cream-50">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-card p-8 text-center shadow-card">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="font-serif font-semibold text-xl text-brown-900 mb-2">Access Denied</h2>
          <p className="text-xs text-brown-700 leading-relaxed mb-6">
            You are signed in as a customer account. The admin dashboard is strictly restricted to verified shop administrators.
          </p>
          <a
            href="/account"
            className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
          >
            Go to My Customer Account
          </a>
        </div>
      </div>
    );
  }

  return children;
};
export default AdminRoute;
