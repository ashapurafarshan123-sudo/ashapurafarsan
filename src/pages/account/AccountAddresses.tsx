import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { UserAddress } from '../../types';
import { Plus, Trash2, AlertCircle, Home } from 'lucide-react';

export const AccountAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Partial<UserAddress> | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line: '',
    landmark: '',
    city: 'Mira Road',
    pincode: '401107',
    is_default: false,
  });

  const fetchAddresses = async () => {
    try {
      const data = await orderService.getUserAddresses();
      setAddresses(data);
    } catch (e) {
      console.error('Error fetching addresses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenAdd = () => {
    setEditingAddr(null);
    setFormData({
      full_name: '',
      phone: '',
      address_line: '',
      landmark: '',
      city: 'Mira Road',
      pincode: '401107',
      is_default: addresses.length === 0,
    });
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.address_line.trim()) {
      setErrorMsg('Please fill in recipient name, phone and full address line.');
      return;
    }

    try {
      const payload: Partial<UserAddress> = {
        ...formData,
        ...(editingAddr?.id ? { id: editingAddr.id } : {}),
      };

      const res = await orderService.saveAddress(payload);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to save address.');
        return;
      }

      setShowAddModal(false);
      await fetchAddresses();
    } catch {
      setErrorMsg('An unexpected error occurred.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery address?')) {
      await orderService.deleteAddress(id);
      await fetchAddresses();
    }
  };

  return (
    <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-serif font-semibold text-brown-900 text-xl">Saved Delivery Addresses</h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Manage your delivery locations in Mira Road for expedited farsan checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus size={15} />
          <span>Add New Address</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-12 h-12 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center mx-auto">
            <Home size={24} />
          </div>
          <h3 className="font-serif font-semibold text-brown-900 text-base">No Saved Addresses</h3>
          <p className="text-xs text-brown-500 max-w-sm mx-auto">
            Save your home or shop address in Mira Road for fast 1-click ordering whenever hunger strikes!
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
          >
            <Plus size={14} />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                addr.is_default ? 'bg-cream-100/70 border-orange-400' : 'bg-white border-line'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-brown-900">{addr.full_name}</span>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-bold border border-orange-300">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="text-brown-400 hover:text-red-600 p-1"
                    title="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-xs text-brown-700 leading-relaxed">{addr.address_line}</p>
                {addr.landmark && (
                  <p className="text-[11px] text-brown-500 mt-0.5">Landmark: {addr.landmark}</p>
                )}
                <p className="text-xs text-brown-600 mt-1">
                  {addr.city} - {addr.pincode}
                </p>
                <p className="text-xs text-brown-700 font-semibold mt-1">Mobile: {addr.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brown-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-card border border-line p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-brown-900 text-lg">
              {editingAddr ? 'Edit Address' : 'Add New Delivery Address'}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-brown-900 mb-1">
                  Recipient Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-brown-900 mb-1">
                  10-Digit Mobile Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                  }
                  placeholder="9876543210"
                  className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-brown-900 mb-1">
                  Complete Address Line <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address_line}
                  onChange={(e) => setFormData({ ...formData, address_line: e.target.value })}
                  placeholder="Flat / Floor, Building Name, Street / Sector"
                  className="w-full p-2.5 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-brown-900 mb-1">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    placeholder="Near Hetal Park / Mira Road"
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brown-900 mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="401107"
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-brown-700">Set as default delivery address</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 font-semibold rounded-full border border-line"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-cta"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AccountAddresses;
