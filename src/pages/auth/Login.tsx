import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { SectionHeading } from '../../components/SectionHeading';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error, isAdmin } = await signIn({ email, password });
      if (error) {
        setErrorMsg(error);
        setIsSubmitting(false);
        return;
      }

      // Redirection logic:
      // If user is verified admin, prioritize admin dashboard (unless explicit deep redirect)
      if (isAdmin) {
        navigate(redirect && redirect.startsWith('/admin') ? decodeURIComponent(redirect) : '/admin');
      } else {
        navigate(redirect ? decodeURIComponent(redirect) : '/account');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign In - Ashapura Farsan"
        description="Sign in to your Ashapura Farsan customer account to track your orders, manage saved delivery addresses and reorder fresh farsan."
      />

      <div className="bg-cream-50 min-h-[80vh] py-12 sm:py-16 flex items-center justify-center">
        <div className="container-custom max-w-md w-full px-4">
          <SectionHeading
            eyebrow="WELCOME BACK"
            titleRegular="Customer"
            titleItalic="Login"
            subtitle="Access your order history, delivery addresses and personal farsan favourites."
          />

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Supabase Setup Required</p>
                <p className="mt-0.5 leading-relaxed">
                  To log in with real accounts, configure your Supabase URL and Anon Key in <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code>. See documentation in <code className="bg-amber-100 px-1 py-0.5 rounded">docs/SUPABASE_SETUP.md</code>.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card mt-6">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full h-11 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-brown-900">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-orange-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 pl-10 pr-10 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs rounded-full shadow-cta flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Register prompt */}
            <div className="mt-6 pt-5 border-t border-line text-center text-xs text-brown-600">
              Don't have an Ashapura account yet?{' '}
              <Link
                to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
                className="text-orange-600 font-bold hover:underline"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
