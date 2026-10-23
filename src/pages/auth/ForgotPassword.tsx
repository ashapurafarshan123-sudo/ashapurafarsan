import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { SectionHeading } from '../../components/SectionHeading';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email);
      // Always show success message to avoid account enumeration
      setIsSubmitted(true);
    } catch {
      setErrorMsg('Could not process password recovery request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password - Ashapura Farsan"
        description="Recover access to your Ashapura Farsan customer account. We will send a secure password reset link to your email."
      />

      <div className="bg-cream-50 min-h-[75vh] py-12 sm:py-16 flex items-center justify-center">
        <div className="container-custom max-w-md w-full px-4">
          <SectionHeading
            eyebrow="ACCOUNT RECOVERY"
            titleRegular="Forgot"
            titleItalic="Password"
            subtitle="Enter your email address and we'll send you a secure link to reset your account password."
          />

          <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card mt-6">
            {isSubmitted ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-serif font-semibold text-brown-900 text-lg">
                  Check Your Inbox
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed">
                  If an account exists for <strong>{email}</strong>, a password reset link has been dispatched. Please check your spam or promotions folder if it doesn't appear shortly.
                </p>
                <div className="pt-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-bold hover:underline"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                    Registered Email Address <span className="text-red-600">*</span>
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs rounded-full shadow-cta flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-brown-600 hover:text-orange-600 font-medium transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Remember your password? Sign in</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassword;
