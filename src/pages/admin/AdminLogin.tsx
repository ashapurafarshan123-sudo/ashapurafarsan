import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { user, isAdmin, isLoading, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in as administrator
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn({ email: email.trim(), password });
      
      if (result.error) {
        setErrorMsg(result.error);
        setIsSubmitting(false);
        return;
      }

      if (!result.isAdmin) {
        // Authenticated but does not possess admin role in public.admin_roles
        setErrorMsg('Access denied. This account does not possess verified administrator privileges.');
        setIsSubmitting(false);
        return;
      }

      navigate('/admin', { replace: true });
    } catch {
      setErrorMsg('An unexpected error occurred during admin authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  return (
    <>
      <SEO
        title="Admin Portal Login — Ashapura Farsan"
        description="Secure management portal sign-in for Ashapura Farsan store operators."
      />

      <div className="min-h-screen bg-cream-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Subtle Mandala Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-md w-full">
          {/* Brand Seal Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-600/30 mb-4 transform -rotate-2">
              <ShieldCheck size={36} strokeWidth={2.2} />
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-brown-900 tracking-tight">
              Ashapura Farsan
            </h1>
            <p className="text-xs uppercase tracking-widest font-semibold text-orange-700 mt-1">
              Store Operator & Admin Panel
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-line rounded-card shadow-card p-6 sm:p-8 backdrop-blur-sm">
            {/* If user is already logged in as regular customer */}
            {user && !isAdmin ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                  <AlertCircle size={24} />
                </div>
                <h3 className="font-serif font-bold text-lg text-brown-900">
                  Customer Account Detected
                </h3>
                <p className="text-xs text-brown-600 leading-relaxed">
                  You are currently signed in as <strong className="text-brown-900">{user.email}</strong>, which does not have administrator privileges.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSwitchAccount}
                    className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-cta transition-colors"
                  >
                    Sign In with Admin Account
                  </button>
                  <Link
                    to="/account"
                    className="w-full py-2.5 px-4 bg-cream-100 hover:bg-cream-200 text-brown-800 text-xs font-semibold rounded-lg border border-line transition-colors text-center"
                  >
                    Go to Customer Portal
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-line pb-4 mb-2">
                  <h2 className="font-serif font-semibold text-base text-brown-900">
                    Administrator Authentication
                  </h2>
                  <p className="text-xs text-brown-500 mt-0.5">
                    Enter authorized credentials to access product, order, and store controls.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-brown-800 mb-1.5 uppercase tracking-wider">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brown-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vaibhavchawda432@gmail.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-cream-50/50 border border-line rounded-lg text-xs text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-bold text-brown-800 mb-1.5 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brown-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-cream-50/50 border border-line rounded-lg text-xs text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brown-400 hover:text-brown-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-xs font-bold rounded-lg shadow-cta transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Authorization...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Access Admin Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Back Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Ashapura Farsan Live Store</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
