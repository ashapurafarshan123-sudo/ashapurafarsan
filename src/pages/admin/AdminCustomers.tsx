import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserProfile } from '../../types';
import { useCart } from '../../context/CartContext';
import { Search, Phone, Calendar } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { formatPrice } = useCart();
  const [customers, setCustomers] = useState<Array<UserProfile & { total_orders?: number; total_spent?: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await adminService.getAllCustomers();
        setCustomers(data);
      } catch (e) {
        console.error('Failed to load customers:', e);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif font-bold text-brown-900 text-xl">Registered Customers</h2>
        <p className="text-xs text-brown-500 mt-0.5">
          View registered customer accounts, order counts, and total spend.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="w-full h-9 pl-8 pr-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
        />
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-xs text-brown-500">
          No customer accounts found matching your query.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-brown-800 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Contact Phone</th>
                <th className="py-2.5 px-3">Joined Date</th>
                <th className="py-2.5 px-3 text-center">Total Orders</th>
                <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-cream-50/60">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-peach-100 text-orange-600 font-bold flex items-center justify-center shrink-0">
                        {(customer.full_name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-brown-900">
                          {customer.full_name || 'Anonymous User'}
                        </div>
                        <div className="text-[10px] text-brown-400 font-mono">
                          ID: {customer.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-brown-700">
                    {customer.phone ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={12} className="text-brown-400" />
                        <span>{customer.phone}</span>
                      </span>
                    ) : (
                      <span className="italic text-brown-400">Not provided</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-brown-500 text-[11px]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={12} className="text-brown-400" />
                      <span>{new Date(customer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-brown-900">
                    {customer.total_orders || 0}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-orange-600">
                    {formatPrice(customer.total_spent || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminCustomers;
