import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminAdvancedAnalytics, OrderRecord } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  PackageCheck,
  PackageX,
  MessageSquareText,
  Calendar,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

type DatePreset = 'today' | '7days' | '30days' | 'this_month' | 'custom';

export const AdminOverview: React.FC = () => {
  const { formatPrice } = useCart();
  const [analytics, setAnalytics] = useState<AdminAdvancedAnalytics | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>('30days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const calculateDateRange = (preset: DatePreset): { start?: string; end?: string } => {
    const now = new Date();
    if (preset === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { start: todayStart.toISOString() };
    }
    if (preset === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: sevenDaysAgo.toISOString() };
    }
    if (preset === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start: thirtyDaysAgo.toISOString() };
    }
    if (preset === 'this_month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: monthStart.toISOString() };
    }
    if (preset === 'custom' && customStart && customEnd) {
      return {
        start: new Date(customStart).toISOString(),
        end: new Date(customEnd + 'T23:59:59').toISOString(),
      };
    }
    return {};
  };

  const loadDashboardData = async () => {
    try {
      const { start, end } = calculateDateRange(datePreset);
      const [analyticsData, ordersData] = await Promise.all([
        adminService.getAdvancedAnalytics(start, end),
        adminService.getAllOrders({ startDate: start, endDate: end }),
      ]);
      setAnalytics(analyticsData);
      setRecentOrders(ordersData.slice(0, 6));
    } catch (err) {
      console.error('Error loading dashboard analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [datePreset]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      loadDashboardData();
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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
        <p className="text-xs font-semibold text-brown-500">Loading operational store metrics from Supabase...</p>
      </div>
    );
  }

  const trends = analytics?.daily_trends || [];
  const maxTrendRevenue = Math.max(...trends.map((t) => t.daily_revenue), 1000);

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-line rounded-card p-5 shadow-card">
        <div>
          <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Real-time financial performance, product stock levels, and multi-channel order activity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto px-3.5 py-1.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Date Filter Strip */}
      <div className="bg-white border border-line rounded-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brown-700 font-bold uppercase tracking-wider text-[11px]">
          <Filter size={14} className="text-orange-600" />
          <span>Period Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'custom', label: 'Custom Range' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDatePreset(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                datePreset === item.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-cream-50 hover:bg-cream-100 text-brown-800 border border-line'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {datePreset === 'custom' && (
          <form onSubmit={handleApplyCustom} className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-line">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 bg-cream-50 border border-line rounded text-xs text-brown-900"
              required
            />
            <span className="text-brown-400">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 bg-cream-50 border border-line rounded text-xs text-brown-900"
              required
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-brown-900 text-white font-bold rounded text-xs hover:bg-brown-800"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      {/* 8 Required Dashboard Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Confirmed Sales */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              Total Confirmed Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {formatPrice(analytics?.gross_sales || 0)}
            </p>
            <p className="text-[10px] text-brown-500 mt-1">
              Excludes cancelled orders & unconfirmed enquiries
            </p>
          </div>
        </div>

        {/* Card 2: Today's Sales */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              Today's Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {formatPrice(analytics?.today_sales || 0)}
            </p>
            <p className="text-[10px] text-green-700 font-semibold mt-1">
              Confirmed today
            </p>
          </div>
        </div>

        {/* Card 3: This Month's Sales */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              This Month's Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {formatPrice(analytics?.this_month_sales || 0)}
            </p>
            <p className="text-[10px] text-brown-500 mt-1">
              Calendar month to date
            </p>
          </div>
        </div>

        {/* Card 4: Total Website Orders */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              Total Website Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {analytics?.website_orders_count || 0}
            </p>
            <Link
              to="/admin/website-orders"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>View</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <p className="text-[10px] text-brown-500 mt-1">
            Placed via website checkout
          </p>
        </div>

        {/* Card 5: Total WhatsApp Orders */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              WhatsApp Enquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquareText size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {analytics?.whatsapp_orders_count || 0}
            </p>
            <Link
              to="/admin/whatsapp-orders"
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>View</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <p className="text-[10px] text-brown-500 mt-1">
            {analytics?.whatsapp_confirmed_count || 0} manually confirmed
          </p>
        </div>

        {/* Card 6: Pending Orders */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-serif font-bold text-rose-600">
              {analytics?.pending_orders_count || 0}
            </p>
            <Link
              to="/admin/website-orders"
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
            >
              <span>Fulfill</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <p className="text-[10px] text-brown-500 mt-1">
            Awaiting store action
          </p>
        </div>

        {/* Card 7: Products Currently In Stock */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              In Stock Products
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <PackageCheck size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-serif font-bold text-brown-900">
              {analytics?.in_stock_products_count || 0}
            </p>
            <Link
              to="/admin/products"
              className="text-[11px] font-bold text-teal-600 hover:text-teal-800 flex items-center gap-0.5"
            >
              <span>Catalog</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <p className="text-[10px] text-brown-500 mt-1">
            Active on storefront
          </p>
        </div>

        {/* Card 8: Products Out of Stock */}
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
              <PackageX size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-serif font-bold text-stone-700">
              {analytics?.out_of_stock_products_count || 0}
            </p>
            <Link
              to="/admin/products"
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
          <p className="text-[10px] text-brown-500 mt-1">
            Purchases currently blocked
          </p>
        </div>
      </div>

      {/* Sales Trend Chart (Pure SVG lightweight visualization) */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
          <div>
            <h3 className="font-serif font-bold text-brown-900 text-base">
              Sales Trend (Daily Confirmed Revenue)
            </h3>
            <p className="text-xs text-brown-500">
              Visualizes daily sales generated from database order records.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-cream-100 text-brown-800 rounded-full border border-line">
            Avg Order Value: {formatPrice(analytics?.average_order_value || 0)}
          </span>
        </div>

        {trends.length === 0 ? (
          <div className="py-12 text-center text-brown-400 text-xs">
            No completed sales records recorded for this selected period yet.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-44 w-full flex items-end gap-2 pt-6 px-2 overflow-x-auto">
              {trends.map((item, idx) => {
                const heightPercent = Math.max(8, Math.round((item.daily_revenue / maxTrendRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 min-w-[36px] flex flex-col items-center gap-1.5 group">
                    <div className="opacity-0 group-hover:opacity-100 text-[10px] bg-brown-900 text-white px-1.5 py-0.5 rounded transition-opacity pointer-events-none whitespace-nowrap">
                      ₹{item.daily_revenue} ({item.order_count} orders)
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-md transition-all group-hover:from-orange-700 group-hover:to-amber-600"
                    />
                    <span className="text-[10px] font-semibold text-brown-500 rotate-[-45deg] origin-top-left mt-2 whitespace-nowrap">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-6" />
          </div>
        )}
      </div>

      {/* Two Column Grid: Recent Orders & Best Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex justify-between items-center mb-4 border-b border-line pb-3">
            <div>
              <h3 className="font-serif font-bold text-brown-900 text-base">Recent Orders</h3>
              <p className="text-xs text-brown-500">Latest orders placed across website & WhatsApp.</p>
            </div>
            <Link
              to="/admin/website-orders"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-brown-400 py-6 text-center">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line text-brown-500 uppercase font-bold text-[10px]">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Channel</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-cream-50 transition-colors">
                      <td className="py-2.5 font-mono font-medium text-brown-900">
                        {ord.order_number}
                      </td>
                      <td className="py-2.5 font-medium text-brown-800">
                        {ord.customer_name}
                      </td>
                      <td className="py-2.5">
                        {ord.payment_method === 'whatsapp_direct' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            WhatsApp
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Website
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 font-bold text-brown-900">
                        {formatPrice(ord.total_amount)}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Best Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex justify-between items-center mb-4 border-b border-line pb-3">
            <div>
              <h3 className="font-serif font-bold text-brown-900 text-base">Best Sellers</h3>
              <p className="text-xs text-brown-500">Based on actual order-item quantities.</p>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Full Report</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {(analytics?.best_selling_products || []).length === 0 ? (
            <div className="py-8 text-center text-brown-400 text-xs">
              Best seller rankings will automatically populate as customer orders are fulfilled.
            </div>
          ) : (
            <div className="space-y-3">
              {(analytics?.best_selling_products || []).map((prod, index) => (
                <div
                  key={prod.product_id || index}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-cream-50/60 border border-line text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-brown-900 truncate max-w-[150px]">
                        {prod.product_name}
                      </p>
                      <p className="text-[10px] text-brown-500">
                        {prod.units_sold} units sold
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-brown-900">
                    {formatPrice(prod.total_revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
