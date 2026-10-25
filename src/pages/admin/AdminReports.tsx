import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { AdminAdvancedAnalytics } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  Download,
  Filter,
  ShoppingBag,
  MessageSquareText,
  RefreshCw,
} from 'lucide-react';

type ReportDatePreset = 'today' | '7days' | '30days' | 'this_month' | 'this_year' | 'custom';

export const AdminReports: React.FC = () => {
  const { formatPrice } = useCart();
  const [analytics, setAnalytics] = useState<AdminAdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [preset, setPreset] = useState<ReportDatePreset>('30days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const calculateDateRange = (p: ReportDatePreset): { start?: string; end?: string } => {
    const now = new Date();
    if (p === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return { start: todayStart.toISOString() };
    }
    if (p === '7days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: sevenDaysAgo.toISOString() };
    }
    if (p === '30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { start: thirtyDaysAgo.toISOString() };
    }
    if (p === 'this_month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: monthStart.toISOString() };
    }
    if (p === 'this_year') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { start: yearStart.toISOString() };
    }
    if (p === 'custom' && customStart && customEnd) {
      return {
        start: new Date(customStart).toISOString(),
        end: new Date(customEnd + 'T23:59:59').toISOString(),
      };
    }
    return {};
  };

  const loadReport = async () => {
    try {
      setRefreshing(true);
      const { start, end } = calculateDateRange(preset);
      const data = await adminService.getAdvancedAnalytics(start, end);
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load sales report:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [preset]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      loadReport();
    }
  };

  const handleExportReportCsv = () => {
    if (!analytics) return;

    const headers = ['Metric', 'Value'];
    const rows = [
      ['Report Period Preset', preset],
      ['Gross Merchandise Value (GMV)', analytics.gross_sales],
      ['Net Sales', analytics.net_sales],
      ['Discounts Granted', analytics.discounts_granted],
      ['Refunds Processed', analytics.refunds],
      ['Total Confirmed Orders', analytics.total_orders],
      ['Average Order Value (AOV)', analytics.average_order_value],
      ['Website Orders Count', analytics.website_orders_count],
      ['Website Orders Revenue', analytics.website_sales],
      ['WhatsApp Confirmed Orders Count', analytics.whatsapp_confirmed_count],
      ['WhatsApp Confirmed Revenue', analytics.whatsapp_sales],
      ['Total WhatsApp Enquiries Created', analytics.whatsapp_orders_count],
    ];

    adminService.exportToCsv(`ashapura-sales-report-${preset}`, headers, rows);
  };

  if (loading) {
    return (
      <div className="bg-white border border-line rounded-card p-12 text-center shadow-card">
        <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-brown-500">Aggregating real database financial reports...</p>
      </div>
    );
  }

  const trends = analytics?.daily_trends || [];
  const maxTrendRevenue = Math.max(...trends.map((t) => t.daily_revenue), 1000);

  return (
    <div className="space-y-6">
      {/* Header and Export */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
            Sales & Financial Reports
          </h2>
          <p className="text-xs text-brown-500 mt-0.5">
            Empirical financial aggregates calculated from Supabase orders and historical item snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadReport}
            className="p-2.5 bg-cream-100 hover:bg-peach-100 text-brown-800 rounded-lg border border-line transition-colors"
            title="Refresh Report Data"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={handleExportReportCsv}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-cta transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Export Report CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filters Bar */}
      <div className="bg-white border border-line rounded-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brown-700 font-bold uppercase tracking-wider text-[11px]">
          <Filter size={14} className="text-orange-600" />
          <span>Report Period:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'today', label: 'Today' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'this_month', label: 'This Month' },
              { id: 'this_year', label: 'This Year' },
              { id: 'custom', label: 'Custom Range' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPreset(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                preset === item.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-cream-50 hover:bg-cream-100 text-brown-800 border border-line'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {preset === 'custom' && (
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

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gross Merchandise Value (GMV) */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Gross Merchandise Value (GMV)
          </span>
          <p className="text-2xl font-serif font-bold text-brown-900 mt-1">
            {formatPrice(analytics?.gross_sales || 0)}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Total billing from completed & confirmed orders
          </p>
        </div>

        {/* Net Sales */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Net Product Sales
          </span>
          <p className="text-2xl font-serif font-bold text-green-700 mt-1">
            {formatPrice(analytics?.net_sales || 0)}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Item subtotal revenue before shipping and after discounts
          </p>
        </div>

        {/* Discounts Granted */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Total Discounts Granted
          </span>
          <p className="text-2xl font-serif font-bold text-orange-600 mt-1">
            {formatPrice(analytics?.discounts_granted || 0)}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Promotional savings extended to customers
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Total Fulfilled Orders
          </span>
          <p className="text-2xl font-serif font-bold text-brown-900 mt-1">
            {analytics?.total_orders || 0}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Across website and confirmed WhatsApp channels
          </p>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Average Order Value (AOV)
          </span>
          <p className="text-2xl font-serif font-bold text-blue-700 mt-1">
            {formatPrice(analytics?.average_order_value || 0)}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Average basket size per customer transaction
          </p>
        </div>

        {/* Refunds */}
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Refunds Processed
          </span>
          <p className="text-2xl font-serif font-bold text-stone-700 mt-1">
            {formatPrice(analytics?.refunds || 0)}
          </p>
          <p className="text-[10px] text-brown-500 mt-1">
            Zero disputed or refunded charges
          </p>
        </div>
      </div>

      {/* Channel Sales Comparison Breakdown */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-4">
        <h3 className="font-serif font-bold text-brown-900 text-base border-b border-line pb-3">
          Sales Channel Breakdown: Website Checkout vs. Confirmed WhatsApp
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Website Sales Card */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag size={14} />
                <span>Website Checkout Orders</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                {analytics?.website_orders_count || 0} Orders
              </span>
            </div>
            <p className="text-2xl font-serif font-bold text-blue-950">
              {formatPrice(analytics?.website_sales || 0)}
            </p>
            <p className="text-[11px] text-blue-800">
              Automated orders with confirmed delivery addresses in Mira Road.
            </p>
          </div>

          {/* WhatsApp Sales Card */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquareText size={14} />
                <span>Confirmed WhatsApp Orders</span>
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                {analytics?.whatsapp_confirmed_count || 0} Orders
              </span>
            </div>
            <p className="text-2xl font-serif font-bold text-emerald-950">
              {formatPrice(analytics?.whatsapp_sales || 0)}
            </p>
            <p className="text-[11px] text-emerald-800">
              Manually confirmed WhatsApp orders ({analytics?.whatsapp_orders_count || 0} total enquiries received).
            </p>
          </div>
        </div>
      </div>

      {/* Daily Sales Trend Chart */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <h3 className="font-serif font-bold text-brown-900 text-base border-b border-line pb-3 mb-4">
          Daily Revenue Timeline
        </h3>

        {trends.length === 0 ? (
          <div className="py-12 text-center text-brown-400 text-xs">
            No completed sales records recorded for this selected report period.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-48 w-full flex items-end gap-2 pt-6 px-2 overflow-x-auto">
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

      {/* Top-Selling Products Detailed Table */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-4">
        <h3 className="font-serif font-bold text-brown-900 text-base border-b border-line pb-3">
          Top-Selling Farsan Products (By Units & Revenue)
        </h3>

        {(analytics?.best_selling_products || []).length === 0 ? (
          <div className="py-8 text-center text-brown-400 text-xs">
            No order item data recorded yet for this date window.
          </div>
        ) : (
          <div className="overflow-x-auto border border-line rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-line text-brown-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-3 text-center">Units Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(analytics?.best_selling_products || []).map((prod, idx) => (
                  <tr key={prod.product_id || idx} className="hover:bg-cream-50/50">
                    <td className="py-3 px-4 font-bold text-orange-600">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-brown-900">{prod.product_name}</td>
                    <td className="py-3 px-3 text-center font-bold text-brown-700">{prod.units_sold}</td>
                    <td className="py-3 px-4 text-right font-bold text-brown-900">{formatPrice(prod.total_revenue)}</td>
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

export default AdminReports;
