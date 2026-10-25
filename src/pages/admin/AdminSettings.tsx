import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { StoreSettings } from '../../types';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
  Save,
  Store,
  Phone,
  Truck,
  Tag,
  KeyRound,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getStoreSettings();
        setSettings(data);
      } catch (e) {
        console.error('Error fetching settings:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const ok = await adminService.updateStoreSetting('contact', settings.contact);
      if (ok) {
        setStatusMsg({ type: 'success', text: 'Store details and contact numbers updated successfully in Supabase!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update store contact settings.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOperational = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const ok = await adminService.updateStoreSetting('operational', settings.operational);
      if (ok) {
        setStatusMsg({ type: 'success', text: 'Operational hours and announcement banner saved!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update operational settings.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const ok = await adminService.updateStoreSetting('shipping', settings.shipping);
      if (ok) {
        setStatusMsg({ type: 'success', text: 'Delivery and coverage rules saved successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update delivery settings.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await updatePassword(newPassword);
      if (res.error) {
        setPasswordMsg({ type: 'error', text: res.error });
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully! Please use this password on your next sign-in.' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'An error occurred while changing password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-line rounded-card p-12 text-center shadow-card">
        <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-brown-500">Loading store configuration from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
          Store Operations & Settings
        </h2>
        <p className="text-xs text-brown-500 mt-0.5">
          Configure business details, WhatsApp dispatch number, local delivery coverage, currency, and operator credentials.
        </p>

        {statusMsg && (
          <div
            className={`mt-4 p-3.5 rounded-lg text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            <span>{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* Operational Status & Announcements */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-3 mb-4">
          <Store size={18} className="text-orange-600" />
          <h3 className="font-serif font-semibold text-brown-900 text-base">
            Live Store Status & Announcement
          </h3>
        </div>

        <form onSubmit={handleSaveOperational} className="space-y-4 text-xs max-w-xl">
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.operational?.is_store_open ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operational: {
                      ...settings.operational,
                      is_store_open: e.target.checked,
                      accepting_orders: settings.operational?.accepting_orders ?? true,
                      announcement: settings.operational?.announcement ?? '',
                    },
                  })
                }
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span className="font-semibold text-brown-900">Physical Store is Open</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.operational?.accepting_orders ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    operational: {
                      ...settings.operational,
                      accepting_orders: e.target.checked,
                      is_store_open: settings.operational?.is_store_open ?? true,
                      announcement: settings.operational?.announcement ?? '',
                    },
                  })
                }
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <span className="font-semibold text-brown-900">Accepting Online Orders</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-brown-800 mb-1">
              Top Announcement Banner Message
            </label>
            <input
              type="text"
              value={settings.operational?.announcement || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  operational: {
                    ...settings.operational,
                    announcement: e.target.value,
                    is_store_open: settings.operational?.is_store_open ?? true,
                    accepting_orders: settings.operational?.accepting_orders ?? true,
                  },
                })
              }
              placeholder="Fresh Farsan Prepared Daily in Pure Groundnut Oil · Free Mira Road Delivery"
              className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={13} />
            <span>Save Operational Status</span>
          </button>
        </form>
      </div>

      {/* Store Contact & WhatsApp Dispatch */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-3 mb-4">
          <Phone size={18} className="text-orange-600" />
          <h3 className="font-serif font-semibold text-brown-900 text-base">
            Store Contact Numbers & Address
          </h3>
        </div>

        <form onSubmit={handleSaveContact} className="space-y-4 text-xs max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brown-800 mb-1">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings.contact?.phone_primary || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      phone_primary: e.target.value,
                      whatsapp_number: settings.contact?.whatsapp_number || '',
                      address: settings.contact?.address || '',
                      hours: settings.contact?.hours || '',
                    },
                  })
                }
                placeholder="801058 0082"
                className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-brown-800 mb-1">
                Business WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.contact?.whatsapp_number || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      whatsapp_number: e.target.value,
                      phone_primary: settings.contact?.phone_primary || '',
                      address: settings.contact?.address || '',
                      hours: settings.contact?.hours || '',
                    },
                  })
                }
                placeholder="919772331014"
                className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-brown-400 mt-1">Format: 91XXXXXXXXXX (without + symbol)</p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-brown-800 mb-1">
              Shop Physical Address
            </label>
            <input
              type="text"
              value={settings.contact?.address || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    address: e.target.value,
                    phone_primary: settings.contact?.phone_primary || '',
                    whatsapp_number: settings.contact?.whatsapp_number || '',
                    hours: settings.contact?.hours || '',
                  },
                })
              }
              placeholder="Shop No 15, Shantipark, Mira Road, Mumbai - 401107"
              className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-brown-800 mb-1">Operating Hours</label>
            <input
              type="text"
              value={settings.contact?.hours || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: {
                    ...settings.contact,
                    hours: e.target.value,
                    phone_primary: settings.contact?.phone_primary || '',
                    whatsapp_number: settings.contact?.whatsapp_number || '',
                    address: settings.contact?.address || '',
                  },
                })
              }
              placeholder="Open Daily: 8:00 AM - 10:30 PM"
              className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={13} />
            <span>Save Contact Numbers</span>
          </button>
        </form>
      </div>

      {/* Delivery Coverage & Charges */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-3 mb-4">
          <Truck size={18} className="text-orange-600" />
          <h3 className="font-serif font-semibold text-brown-900 text-base">
            Local Delivery Coverage & Charges
          </h3>
        </div>

        <form onSubmit={handleSaveShipping} className="space-y-4 text-xs max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brown-800 mb-1">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={settings.shipping?.standard_fee ?? 0}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      standard_fee: Number(e.target.value),
                      free_shipping_min: settings.shipping?.free_shipping_min ?? 0,
                      local_delivery_area: settings.shipping?.local_delivery_area ?? 'Mira Road',
                    },
                  })
                }
                min="0"
                className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-brown-800 mb-1">
                Local Coverage Area
              </label>
              <input
                type="text"
                value={settings.shipping?.local_delivery_area || 'Mira Road, Mumbai'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: {
                      ...settings.shipping,
                      local_delivery_area: e.target.value,
                      standard_fee: settings.shipping?.standard_fee ?? 0,
                      free_shipping_min: settings.shipping?.free_shipping_min ?? 0,
                    },
                  })
                }
                placeholder="Mira Road, Mumbai"
                className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={13} />
            <span>Save Delivery Settings</span>
          </button>
        </form>
      </div>

      {/* Global Discount Quick Shortcut Card */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Tag size={20} />
          </div>
          <div>
            <h4 className="font-serif font-bold text-brown-900 text-sm">Storewide Discount Controls</h4>
            <p className="text-xs text-brown-500">Configure percentage or fixed discounts and preview live prices.</p>
          </div>
        </div>
        <Link
          to="/admin/discounts"
          className="px-4 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 font-semibold text-xs rounded-lg border border-line transition-colors flex items-center gap-1.5"
        >
          <span>Open Discounts</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* Administrator Password Management */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-line pb-3 mb-4">
          <KeyRound size={18} className="text-orange-600" />
          <h3 className="font-serif font-semibold text-brown-900 text-base">
            Change Administrator Password
          </h3>
        </div>

        <p className="text-xs text-brown-600 mb-4">
          Currently signed in as <strong className="text-brown-900">{user?.email}</strong>. Update your credentials securely below:
        </p>

        {passwordMsg && (
          <div
            className={`mb-4 p-3.5 rounded-lg text-xs flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {passwordMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brown-800 mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full h-9 px-3 pr-8 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brown-400 hover:text-brown-700"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brown-800 mb-1">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full h-9 px-3 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-5 py-2 bg-brown-900 hover:bg-brown-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <KeyRound size={13} />
            <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
