import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountProfile: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!fullName.trim()) {
      setStatusMsg({ type: 'error', text: 'Full name cannot be blank.' });
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone && cleanPhone.length !== 10) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updateProfile({ full_name: fullName, phone: cleanPhone });
      if (error) {
        setStatusMsg({ type: 'error', text: error });
      } else {
        setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred while saving profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif font-semibold text-brown-900 text-xl">Profile Information</h2>
        <p className="text-xs text-brown-500 mt-0.5">
          Update your contact details used for order confirmations and home delivery.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-brown-900 mb-1.5">
            Full Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
              <User size={15} />
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full h-11 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Email Address (Read-only notice) */}
        <div>
          <label className="block text-xs font-semibold text-brown-900 mb-1.5">
            Registered Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
              <Mail size={15} />
            </span>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full h-11 pl-10 pr-3.5 text-xs text-brown-500 bg-cream-100/70 border border-line rounded-lg cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-brown-500 mt-1">
            Email is verified through Supabase Auth. To update email, contact store support.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-brown-900 mb-1.5">
            10-Digit Mobile Number (WhatsApp)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-400">
              <Phone size={15} />
            </span>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              className="w-full h-11 pl-10 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold rounded-full shadow-cta transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>

      {/* Password reset link box */}
      <div className="border-t border-line pt-6 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-cream-50 rounded-lg border border-line">
          <div>
            <div className="flex items-center gap-2 font-bold text-xs text-brown-900">
              <Lock size={14} className="text-orange-600" />
              <span>Password & Security</span>
            </div>
            <p className="text-[11px] text-brown-600 mt-0.5">
              Want to change your account password? Request a secure password reset link.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="px-4 py-1.5 bg-white hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors shrink-0"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AccountProfile;
