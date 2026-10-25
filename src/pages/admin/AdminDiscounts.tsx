import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { GlobalDiscountConfig, Product } from '../../types';
import { productService } from '../../services/productService';
import {
  CheckCircle,
  AlertCircle,
  Save,
  Trash2,
  Percent,
  IndianRupee,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const [discountConfig, setDiscountConfig] = useState<GlobalDiscountConfig>({
    is_active: false,
    type: 'percentage',
    value: 10,
    min_order_amount: 0,
    start_date: null,
    end_date: null,
    banner_text: 'Special 10% Off Storewide on Fresh Farsan!',
  });

  const [sampleProducts, setSampleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [config, prods] = await Promise.all([
        adminService.getStoreDiscount(),
        productService.getActiveProducts(),
      ]);
      setDiscountConfig(config);
      setSampleProducts(prods.slice(0, 5));
    } catch (e) {
      console.error('Failed to load discount config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.saveStoreDiscount(discountConfig);
      if (res.success) {
        showToast('success', 'Storewide discount settings saved successfully to Supabase!');
      } else {
        showToast('error', res.error || 'Failed to update store discount.');
      }
    } catch {
      showToast('error', 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickPercent = (pct: number) => {
    setDiscountConfig((prev) => ({
      ...prev,
      type: 'percentage',
      value: pct,
      banner_text: `Special ${pct}% Off Storewide on Fresh Farsan!`,
    }));
  };

  const handleDeactivate = async () => {
    const updated = { ...discountConfig, is_active: false };
    setDiscountConfig(updated);
    setSaving(true);
    try {
      const res = await adminService.saveStoreDiscount(updated);
      if (res.success) {
        showToast('success', 'Storewide discount has been deactivated.');
      } else {
        showToast('error', res.error || 'Failed to deactivate discount.');
      }
    } catch {
      showToast('error', 'Failed to deactivate.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to calculate preview price for a variant
  const getPreviewDiscountedPrice = (originalPrice: number) => {
    if (!originalPrice || originalPrice <= 0) return 0;
    if (discountConfig.type === 'percentage') {
      const val = Math.min(100, Math.max(0, discountConfig.value || 0));
      const off = Math.round((originalPrice * val) / 100);
      return Math.max(0, originalPrice - off);
    } else {
      const off = Math.max(0, discountConfig.value || 0);
      return Math.max(0, originalPrice - off);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-line rounded-card p-12 text-center shadow-card">
        <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-brown-500">Loading discount configuration from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs flex items-center gap-2.5 max-w-md animate-in slide-in-from-bottom-3 duration-200 ${
            toastMsg.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle size={18} className="text-green-600" />
          ) : (
            <AlertCircle size={18} className="text-red-600" />
          )}
          <span className="font-medium">{toastMsg.text}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
              Global Discount Management
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                discountConfig.is_active
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {discountConfig.is_active ? 'Live Discount Active' : 'Discount Inactive / Paused'}
            </span>
          </div>
          <p className="text-xs text-brown-500 mt-0.5">
            Configure storewide percentage or fixed discounts. Changes persist in Supabase and reflect across product cards, cart, and checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="self-start sm:self-auto p-2.5 bg-cream-100 hover:bg-peach-100 text-brown-800 rounded-lg border border-line transition-colors"
          title="Reload discount configuration"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-6">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Active Toggle Switch */}
          <div className="flex items-center justify-between p-4 bg-cream-50/70 border border-line rounded-lg">
            <div className="space-y-0.5">
              <label className="text-sm font-bold text-brown-900 cursor-pointer">
                Enable Storewide Discount
              </label>
              <p className="text-xs text-brown-500">
                When activated, all customer carts and storefront items will reflect this discount rule.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={discountConfig.is_active}
                onChange={(e) => setDiscountConfig({ ...discountConfig, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Discount Mode & Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Discount Type
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDiscountConfig({ ...discountConfig, type: 'percentage' })}
                  className={`flex-1 py-2.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    discountConfig.type === 'percentage'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-cream-50 hover:bg-cream-100 text-brown-800 border-line'
                  }`}
                >
                  <Percent size={14} />
                  <span>Percentage (%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountConfig({ ...discountConfig, type: 'fixed' })}
                  className={`flex-1 py-2.5 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    discountConfig.type === 'fixed'
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-cream-50 hover:bg-cream-100 text-brown-800 border-line'
                  }`}
                >
                  <IndianRupee size={14} />
                  <span>Fixed Amount (₹)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Discount Value {discountConfig.type === 'percentage' ? '(%)' : '(₹)'} *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discountConfig.value}
                  onChange={(e) =>
                    setDiscountConfig({
                      ...discountConfig,
                      value: Math.max(0, Number(e.target.value)),
                    })
                  }
                  min="0"
                  max={discountConfig.type === 'percentage' ? 100 : 10000}
                  required
                  className="flex-1 px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                {discountConfig.type === 'percentage' && (
                  <div className="flex items-center gap-1">
                    {[5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleQuickPercent(pct)}
                        className={`px-2.5 py-2 rounded-lg font-bold text-xs border transition-colors ${
                          discountConfig.value === pct
                            ? 'bg-brown-900 text-white border-brown-900'
                            : 'bg-cream-100 hover:bg-cream-200 text-brown-800 border-line'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Minimum Order Amount Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Minimum Order Amount Threshold (₹)
              </label>
              <input
                type="number"
                value={discountConfig.min_order_amount}
                onChange={(e) =>
                  setDiscountConfig({
                    ...discountConfig,
                    min_order_amount: Math.max(0, Number(e.target.value)),
                  })
                }
                min="0"
                placeholder="0 for all orders"
                className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <p className="text-[10px] text-brown-400 mt-1">
                Discount only applies if cart subtotal is equal to or greater than this value.
              </p>
            </div>

            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Promotional Banner Announcement Text
              </label>
              <input
                type="text"
                value={discountConfig.banner_text || ''}
                onChange={(e) => setDiscountConfig({ ...discountConfig, banner_text: e.target.value })}
                placeholder="e.g. Special Festive 10% Off Storewide!"
                className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <p className="text-[10px] text-brown-400 mt-1">
                Displayed in cart drawer and checkout review.
              </p>
            </div>
          </div>

          {/* Effective Date Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-line pt-4">
            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Start Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={discountConfig.start_date ? discountConfig.start_date.slice(0, 16) : ''}
                onChange={(e) =>
                  setDiscountConfig({
                    ...discountConfig,
                    start_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-brown-800 mb-1.5 uppercase tracking-wider text-[11px]">
                End Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={discountConfig.end_date ? discountConfig.end_date.slice(0, 16) : ''}
                onChange={(e) =>
                  setDiscountConfig({
                    ...discountConfig,
                    end_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
                className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-line">
            {discountConfig.is_active && (
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={saving}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Deactivate Discount</span>
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Publishing Changes...' : 'Save & Publish Discount'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Interactive Price Preview Table */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-orange-600" />
            <h3 className="font-serif font-bold text-brown-900 text-base">
              Live Pricing Preview Before Publishing
            </h3>
          </div>
          <span className="text-[11px] text-brown-500 font-medium">
            Calculated dynamically using current discount rules
          </span>
        </div>

        <p className="text-xs text-brown-600">
          The table below demonstrates how products and their packaging variants will be billed to customers:
        </p>

        <div className="overflow-x-auto border border-line rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100/70 border-b border-line text-brown-600 uppercase font-bold text-[10.5px]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Variant Size</th>
                <th className="py-3 px-3 text-right">Original Price</th>
                <th className="py-3 px-3 text-right">Discount Applied</th>
                <th className="py-3 px-4 text-right">Customer Pays</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sampleProducts.map((p) => {
                const orig250 = p.prices['250g'];
                const orig500 = p.prices['500g'];
                const orig1kg = p.prices['1kg'];

                const new250 = getPreviewDiscountedPrice(orig250);
                const new500 = getPreviewDiscountedPrice(orig500);
                const new1kg = getPreviewDiscountedPrice(orig1kg);

                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-cream-50/50">
                      <td className="py-2.5 px-4 font-semibold text-brown-900" rowSpan={3}>
                        {p.name}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-brown-700">250 g</td>
                      <td className="py-2.5 px-3 text-right text-brown-500">₹{orig250}</td>
                      <td className="py-2.5 px-3 text-right text-red-600 font-semibold">
                        -₹{orig250 - new250}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-orange-600 text-sm">
                        ₹{new250}
                      </td>
                    </tr>
                    <tr className="hover:bg-cream-50/50">
                      <td className="py-2 px-3 font-medium text-brown-700">500 g</td>
                      <td className="py-2 px-3 text-right text-brown-500">₹{orig500}</td>
                      <td className="py-2 px-3 text-right text-red-600 font-semibold">
                        -₹{orig500 - new500}
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-orange-600 text-sm">
                        ₹{new500}
                      </td>
                    </tr>
                    <tr className="hover:bg-cream-50/50">
                      <td className="py-2 px-3 font-medium text-brown-700">1 kg</td>
                      <td className="py-2 px-3 text-right text-brown-500">₹{orig1kg}</td>
                      <td className="py-2 px-3 text-right text-red-600 font-semibold">
                        -₹{orig1kg - new1kg}
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-orange-600 text-sm">
                        ₹{new1kg}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;
