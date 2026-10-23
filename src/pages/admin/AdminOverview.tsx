import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminDashboardStats, OrderRecord } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  Package,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { formatPrice } = useCart();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllOrders(),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (err) {
      console.error('Error loading admin overview data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-cream-200 text-brown-800 border-line';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-line rounded-card p-12 text-center shadow-card">
        <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-brown-500">Loading live operational metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex justify-between items-center bg-white border border-line rounded-card p-5 shadow-card">
        <div>
          <h2 className="font-serif font-bold text-brown-900 text-xl">Overview Dashboard</h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Real-time sales, order fulfillment and customer metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3.5 py-1.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors flex items-center gap-1.5"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="font-serif font-bold text-2xl text-brown-900 mt-1">
                {formatPrice(stats?.total_revenue || 0)}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            Calculated from active & fulfilled orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="font-serif font-bold text-2xl text-brown-900 mt-1">
                {stats?.total_orders || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            All customer & guest orders
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Pending Confirmation
              </p>
              <p className="font-serif font-bold text-2xl text-amber-800 mt-1">
                {stats?.pending_orders || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            Orders needing immediate shop review
          </p>
        </div>

        {/* In Fulfilment */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Awaiting Fulfilment
              </p>
              <p className="font-serif font-bold text-2xl text-blue-800 mt-1">
                {stats?.processing_orders || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            Packed or out for delivery in Mira Road
          </p>
        </div>

        {/* Registered Customers */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                Registered Customers
              </p>
              <p className="font-serif font-bold text-2xl text-brown-900 mt-1">
                {stats?.total_customers || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            Profiles stored in Supabase Auth
          </p>
        </div>

        {/* Catalog Products */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
                Active Catalog Items
              </p>
              <p className="font-serif font-bold text-2xl text-brown-900 mt-1">
                {stats?.total_products || 0}
              </p>
            </div>
            <div className="w-11 h-11 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
          </div>
          <p className="text-[11px] text-brown-500 mt-3 pt-3 border-t border-line/60">
            Farsan, chivda, sweets & namkeen items
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex justify-between items-center mb-5 border-b border-line pb-3">
          <h3 className="font-serif font-semibold text-brown-900 text-lg">Recent Orders</h3>
          <Link
            to="/admin/orders"
            className="text-xs text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs text-brown-500">
            No orders have been received yet. New incoming orders will appear here in real-time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-brown-800 font-semibold border-b border-line">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/60">
                    <td className="py-3 px-3 font-bold text-brown-900">{order.order_number}</td>
                    <td className="py-3 px-3 text-brown-800">
                      <div>{order.customer_name}</div>
                      <div className="text-[10px] text-brown-500">{order.customer_phone}</div>
                    </td>
                    <td className="py-3 px-3 capitalize text-brown-700">{order.order_type}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-orange-600">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="py-3 px-3 text-brown-500 text-[11px]">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="px-2.5 py-1 bg-cream-100 hover:bg-peach-100 text-brown-900 text-[11px] font-semibold rounded border border-line"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminOverview;
