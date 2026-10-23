import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { StoreSettings } from '../../types';
import { CheckCircle, AlertCircle, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        setStatusMsg({ type: 'success', text: 'Store contact details updated successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update store settings.' });
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
        setStatusMsg({ type: 'success', text: 'Operational settings saved!' });
      } else {
        setStatusMsg({ type: 'error', text: 'Failed to update operational settings.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-line rounded-card p-12 text-center shadow-card">
        <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-brown-500">Loading store settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <h2 className="font-serif font-bold text-brown-900 text-xl">Store Operations & Settings</h2>
        <p className="text-xs text-brown-500 mt-0.5">
          Manage operational hours, phone numbers, WhatsApp dispatch contact and site notices.
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

      {/* Operational Status */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <h3 className="font-serif font-semibold text-brown-900 text-base mb-4 border-b border-line pb-3">
          Live Store Status & Announcement
        </h3>

        <form onSubmit={handleSaveOperational} className="space-y-4 text-xs max-w-xl">
          <div className="flex items-center gap-6">
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
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-semibold text-brown-900">Store is Open for Business</span>
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
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="font-semibold text-brown-900">Accepting Online Orders</span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-brown-900 mb-1">
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
              placeholder="e.g. Fresh Farsan Prepared Daily in Pure Groundnut Oil · Free Mira Road Delivery"
              className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-cta transition-colors flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>Save Operational Settings</span>
          </button>
        </form>
      </div>

      {/* Store Contact & Address */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <h3 className="font-serif font-semibold text-brown-900 text-base mb-4 border-b border-line pb-3">
          Contact Numbers & Location Details
        </h3>

        <form onSubmit={handleSaveContact} className="space-y-3.5 text-xs max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-brown-900 mb-1">
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
                className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-brown-900 mb-1">
                WhatsApp Dispatch Number
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
                className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-brown-900 mb-1">
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
              className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-brown-900 mb-1">Operating Hours</label>
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
              className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-cta transition-colors flex items-center gap-1.5"
            >
              <Save size={13} />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;
