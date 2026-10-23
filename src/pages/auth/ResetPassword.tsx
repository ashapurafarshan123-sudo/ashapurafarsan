import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { SectionHeading } from '../../components/SectionHeading';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if hash has error from expired/invalid recovery token
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error=') || hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const desc = params.get('error_description') || 'This password reset link is invalid or has expired.';
      setErrorMsg(desc.replace(/\+/g, ' '));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setErrorMsg(error);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg('Failed to update password. Your recovery link may have expired.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Set New Password - Ashapura Farsan"
        description="Choose a new secure password for your Ashapura Farsan customer account."
      />

      <div className="bg-cream-50 min-h-[75vh] py-12 sm:py-16 flex items-center justify-center">
        <div className="container-custom max-w-md w-full px-4">
          <SectionHeading
            eyebrow="SECURITY"
            titleRegular="Set New"
            titleItalic="Password"
            subtitle="Please enter a new, strong password for your Ashapura Farsan account."
          />

          <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card mt-6">
            {isSuccess ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-serif font-semibold text-brown-900 text-lg">
                  Password Updated!
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed">
                  Your password has been changed successfully. You can now sign in with your new credentials.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
                  >
                    Go to Sign In
                  </button>
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

                {!session && !window.location.hash.includes('access_token') && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <p className="font-semibold">Notice</p>
                    <p className="mt-0.5">
                      If you opened this page directly without clicking a recovery email link, please{' '}
                      <Link to="/forgot-password" className="text-orange-600 font-bold underline">
                        request a reset link here
                      </Link>.
                    </p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                    New Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full h-11 pl-10 pr-10 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                    Confirm New Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className="w-full h-11 pl-10 pr-10 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
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
                      <span>Save New Password</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
