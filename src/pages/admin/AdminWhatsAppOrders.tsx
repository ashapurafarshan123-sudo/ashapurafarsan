import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { OrderRecord, OrderStatus, PaymentStatus } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  MessageSquareText,
  Search,
  Eye,
  X,
  AlertCircle,
  Download,
  CheckCircle,
  RefreshCw,
  Send,
} from 'lucide-react';

export const AdminWhatsAppOrders: React.FC = () => {
  const { formatPrice } = useCart();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOrders({
        channel: 'whatsapp',
        status: statusFilter,
        search,
      });
      setOrders(data);
    } catch (e) {
      console.error('Failed to load WhatsApp orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleOpenDetail = (order: OrderRecord) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPaymentStatus(order.payment_status);
    setInternalNotes(order.internal_notes || '');
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');
    try {
      const res = await adminService.updateOrderStatus(
        selectedOrder.id,
        newStatus,
        newPaymentStatus,
        internalNotes
      );

      if (!res.success) {
        setUpdateError(res.error || 'Failed to update order status');
        setIsUpdating(false);
        return;
      }

      setUpdateSuccess('WhatsApp order status updated successfully!');
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              payment_status: newPaymentStatus,
              internal_notes: internalNotes,
            }
          : null
      );
      await loadOrders();
    } catch {
      setUpdateError('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenWhatsAppChat = (order: OrderRecord) => {
    let cleanPhone = order.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Valid customer phone number is required to open WhatsApp.');
      return;
    }

    const message = `Hello ${order.customer_name || 'Customer'}! Thank you for contacting Ashapura Farsan regarding your order intent (${order.order_number}). Your requested total is ₹${order.total_amount}. How may we assist with your delivery?`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExportCsv = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order Ref',
      'Date',
      'Customer Name',
      'Phone',
      'Estimated Total',
      'Status',
      'Payment Status',
      'Delivery Address',
      'Items Requested',
    ];

    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString(),
      o.customer_name,
      o.customer_phone,
      o.total_amount,
      o.status,
      o.payment_status,
      o.delivery_address,
      (o.order_items || [])
        .map((it) => `${it.product_name_snapshot} (${it.variant_size_snapshot}) x${it.quantity}`)
        .join('; '),
    ]);

    adminService.exportToCsv('ashapura-whatsapp-orders', headers, rows);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'out_for_delivery':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const pendingEnquiriesCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o) =>
    ['confirmed', 'processing', 'out_for_delivery', 'delivered'].includes(o.status)
  );
  const confirmedRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* Informational Guidance Notice */}
      <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-card text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <MessageSquareText size={18} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">WhatsApp Order Flow Rule:</strong>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">
              Customer inquiries created via WhatsApp are tracked as <strong>Order Intents</strong>. They are strictly segregated and <strong>never counted as completed revenue</strong> until you manually confirm the order.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Title & Quick Stats Bar */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
              WhatsApp Orders & Enquiries
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {orders.length} total intents
            </span>
          </div>
          <p className="text-xs text-brown-500 mt-0.5">
            Process inquiries initiated via WhatsApp, verify payment details, and confirm orders for packaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadOrders}
            className="p-2.5 bg-cream-100 hover:bg-peach-100 text-brown-800 rounded-lg border border-line transition-colors"
            title="Refresh WhatsApp orders"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={orders.length === 0}
            className="px-3.5 py-2.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-lg border border-line transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Unprocessed Enquiries
          </span>
          <p className="text-2xl font-serif font-bold text-amber-600 mt-1">
            {pendingEnquiriesCount}
          </p>
          <p className="text-[10px] text-brown-400 mt-0.5">Awaiting shop contact / confirmation</p>
        </div>

        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Confirmed WhatsApp Orders
          </span>
          <p className="text-2xl font-serif font-bold text-brown-900 mt-1">
            {confirmedOrders.length}
          </p>
          <p className="text-[10px] text-brown-400 mt-0.5">Approved & in fulfillment pipeline</p>
        </div>

        <div className="bg-white border border-line rounded-card p-4 shadow-card">
          <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider">
            Confirmed WhatsApp Revenue
          </span>
          <p className="text-2xl font-serif font-bold text-emerald-700 mt-1">
            {formatPrice(confirmedRevenue)}
          </p>
          <p className="text-[10px] text-brown-400 mt-0.5">Derived exclusively from confirmed records</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white border border-line rounded-card p-4 shadow-card grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brown-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ref, customer name or phone..."
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </form>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="pending">Pending Enquiry (New)</option>
          <option value="confirmed">Confirmed Order</option>
          <option value="processing">Preparing / Kitchen</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled / Invalid</option>
        </select>
      </div>

      {/* WhatsApp Orders Table */}
      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brown-500">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
            <span>Loading WhatsApp records from Supabase...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-brown-500 text-xs">
            No WhatsApp order enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-line text-brown-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Intent Ref</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Est. Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-brown-900">
                      {ord.order_number}
                    </td>
                    <td className="py-3 px-3 text-brown-600">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-brown-900">{ord.customer_name}</p>
                      <p className="text-[11px] text-brown-500">{ord.customer_phone}</p>
                    </td>
                    <td className="py-3 px-3 font-bold text-brown-900">
                      {formatPrice(ord.total_amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(ord.status)}`}>
                        {ord.status === 'pending' ? 'Pending Enquiry' : ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsAppChat(ord)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                          title="Open WhatsApp chat with customer"
                        >
                          <Send size={12} />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDetail(ord)}
                          className="px-2.5 py-1.5 bg-cream-100 hover:bg-peach-100 text-brown-900 font-semibold rounded border border-line transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WhatsApp Order Detail & Status Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-line rounded-card max-w-xl w-full p-6 shadow-card my-8 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-brown-900 text-lg">
                    WhatsApp Intent {selectedOrder.order_number}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-brown-500 mt-0.5">
                  Initiated via WhatsApp on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-brown-400 hover:text-brown-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{updateError}</span>
              </div>
            )}

            {updateSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle size={15} />
                <span>{updateSuccess}</span>
              </div>
            )}

            {/* Customer Contact Card */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Customer Contact</p>
                <p className="font-bold text-brown-900 text-sm mt-0.5">{selectedOrder.customer_name}</p>
                <p className="text-brown-700 font-medium">{selectedOrder.customer_phone}</p>
                {selectedOrder.delivery_address && (
                  <p className="text-brown-600 mt-1 text-[11px]">{selectedOrder.delivery_address}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleOpenWhatsAppChat(selectedOrder)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send size={14} />
                <span>Open Chat</span>
              </button>
            </div>

            {/* Requested Products */}
            <div>
              <p className="text-[11px] font-bold text-brown-700 uppercase tracking-wider mb-2">
                Requested Farsan Items
              </p>
              <div className="border border-line rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/60 border-b border-line text-brown-600 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3">Packaging</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(selectedOrder.order_items || []).map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="py-2 px-3 font-semibold text-brown-900">{it.product_name_snapshot}</td>
                        <td className="py-2 px-3">{it.variant_size_snapshot}</td>
                        <td className="py-2 px-3 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 px-3 text-right font-bold">₹{it.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Estimated */}
            <div className="flex justify-between items-center p-3 bg-cream-50 border border-line rounded-lg text-xs">
              <span className="font-semibold text-brown-700">Estimated Total Amount:</span>
              <span className="font-bold text-brown-900 text-base">{formatPrice(selectedOrder.total_amount)}</span>
            </div>

            {/* Status Transition Form */}
            <form onSubmit={handleUpdateStatus} className="border-t border-line pt-4 space-y-3 text-xs">
              <p className="font-bold text-brown-800 uppercase tracking-wider text-[11px]">
                Confirm or Update Enquiry Status
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown-700 mb-1 font-semibold">Fulfilment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="pending">Pending Enquiry (Not Confirmed)</option>
                    <option value="confirmed">Confirmed Order (Count in Sales)</option>
                    <option value="processing">Preparing in Kitchen</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled / Customer Did Not Pay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-brown-700 mb-1 font-semibold">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="paid">Paid (UPI / Bank Transfer)</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brown-700 mb-1 font-semibold">Internal Notes</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes from WhatsApp conversation (e.g. UPI transaction ID, delivery time preference)..."
                  className="w-full px-3 py-1.5 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-brown-800 font-semibold rounded-lg border border-line transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-cta transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWhatsAppOrders;
