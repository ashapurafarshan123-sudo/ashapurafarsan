import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/SEO';
import { SectionHeading } from '../../components/SectionHeading';
import { Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    let cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'Please agree to the privacy policy & ordering terms.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
      });

      if (error) {
        setErrorMsg(error);
        setIsSubmitting(false);
        return;
      }

      setIsRegistered(true);
    } catch {
      setErrorMsg('An unexpected error occurred during account creation.');
      setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="bg-cream-50 min-h-[70vh] py-16 flex items-center justify-center">
        <div className="container-custom max-w-md w-full px-4 text-center">
          <div className="bg-white border border-line rounded-card p-8 shadow-card space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} strokeWidth={2} />
            </div>

            <h2 className="font-serif font-semibold text-brown-900 text-2xl">
              Account Created!
            </h2>

            <p className="text-xs text-brown-700 leading-relaxed">
              Welcome to the Ashapura Farsan family! You can now log in to view your orders, save delivery addresses, and enjoy traditional Gujarati snacks.
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => navigate(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Create Customer Account - Ashapura Farsan"
        description="Register for an Ashapura Farsan customer account. Track orders, manage saved delivery addresses in Mira Road, and reorder quickly."
      />

      <div className="bg-cream-50 min-h-[85vh] py-10 sm:py-14 flex items-center justify-center">
        <div className="container-custom max-w-md w-full px-4">
          <SectionHeading
            eyebrow="JOIN ASHAPURA FARSAN"
            titleRegular="Create"
            titleItalic="Account"
            subtitle="Sign up for seamless ordering, persistent order tracking and address management."
          />

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex gap-2.5 items-start">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Supabase Setup Required</p>
                <p className="mt-0.5 leading-relaxed">
                  Configure <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment to persist user registrations.
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

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full h-10 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                </div>
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full h-10 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1">
                  10-Digit Mobile Number (WhatsApp) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Phone size={15} />
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="9876543210"
                    className="w-full h-10 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    className="w-full h-10 pl-10 pr-10 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-brown-900 mb-1">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat your password"
                    className="w-full h-10 pl-10 pr-10 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms check */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-[11px] text-brown-700 leading-tight">
                    I agree to the Ashapura Farsan ordering terms and customer privacy policy.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.agreeTerms}</p>
                )}
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
                      <span>Create Account</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login prompt */}
            <div className="mt-5 pt-4 border-t border-line text-center text-xs text-brown-600">
              Already registered with us?{' '}
              <Link
                to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                className="text-orange-600 font-bold hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
