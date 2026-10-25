import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { OrderRecord, OrderStatus, PaymentStatus } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { SHOP_CONFIG } from '../../config/shop';
import {
  Search,
  Eye,
  X,
  AlertCircle,
  Printer,
  Download,
  CheckCircle,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminWebsiteOrders: React.FC = () => {
  const { formatPrice } = useCart();
  const { contact } = useStoreSettings();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  // Detail Modal & Print State
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
        channel: 'website',
        status: statusFilter,
        payment_status: paymentFilter,
        search,
      });
      setOrders(data);
    } catch (e) {
      console.error('Failed to load website orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, paymentFilter]);

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

      setUpdateSuccess('Order status updated successfully!');
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
      setUpdateError('An unexpected error occurred while updating status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCsv = () => {
    if (orders.length === 0) return;

    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Phone',
      'Order Type',
      'Delivery Address',
      'Subtotal',
      'Discount',
      'Total Amount',
      'Fulfilment Status',
      'Payment Status',
      'Payment Method',
      'Items Ordered',
    ];

    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleString(),
      o.customer_name,
      o.customer_phone,
      o.order_type,
      o.delivery_address,
      o.subtotal,
      o.discount_amount || 0,
      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_method,
      (o.order_items || [])
        .map((it) => `${it.product_name_snapshot} (${it.variant_size_snapshot}) x${it.quantity}`)
        .join('; '),
    ]);

    adminService.exportToCsv('ashapura-website-orders', headers, rows);
  };

  const handlePrintSlip = () => {
    window.print();
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
        return 'bg-cream-200 text-brown-800 border-line';
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="space-y-6">
      {/* Printable Invoice Container (visible during window.print) */}
      {selectedOrder && (
        <div className="hidden print:block print:p-8 bg-white text-black font-sans">
          <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase">{SHOP_CONFIG.name}</h1>
              <p className="text-xs">{contact.address}</p>
              <p className="text-xs">Tel: {contact.phone_primary} | WhatsApp: +{contact.whatsapp_number}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">ORDER INVOICE</h2>
              <p className="text-sm font-mono font-bold">{selectedOrder.order_number}</p>
              <p className="text-xs">Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-4 mb-4 text-xs">
            <div>
              <p className="font-bold uppercase text-gray-600">Customer Details:</p>
              <p className="font-bold text-sm">{selectedOrder.customer_name}</p>
              <p>Phone: {selectedOrder.customer_phone}</p>
              {selectedOrder.customer_email && <p>Email: {selectedOrder.customer_email}</p>}
            </div>
            <div>
              <p className="font-bold uppercase text-gray-600">Delivery Information:</p>
              <p className="font-semibold uppercase">{selectedOrder.order_type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}</p>
              <p>{selectedOrder.delivery_address}</p>
              {selectedOrder.order_note && <p className="italic mt-1">Note: {selectedOrder.order_note}</p>}
            </div>
          </div>

          <table className="w-full text-left text-xs mb-4 border border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product Description</th>
                <th className="p-2 border">Packaging</th>
                <th className="p-2 border text-right">Unit Price</th>
                <th className="p-2 border text-center">Qty</th>
                <th className="p-2 border text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {(selectedOrder.order_items || []).map((it, idx) => (
                <tr key={it.id || idx} className="border-b">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border font-medium">{it.product_name_snapshot}</td>
                  <td className="p-2 border">{it.variant_size_snapshot}</td>
                  <td className="p-2 border text-right">₹{it.unit_price}</td>
                  <td className="p-2 border text-center font-bold">{it.quantity}</td>
                  <td className="p-2 border text-right font-bold">₹{it.line_total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              {Number(selectedOrder.discount_amount) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>₹{selectedOrder.shipping_amount}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-1 border-black">
                <span>Final Total:</span>
                <span>₹{selectedOrder.total_amount}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
            Thank you for choosing Ashapura Farsan! Fresh, authentic Gujarati namkeen & snacks.
          </div>
        </div>
      )}

      {/* Screen Title & Quick Stats Bar */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-brown-900 text-xl tracking-tight">
              Website Checkout Orders
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {orders.length} orders • {formatPrice(totalRevenue)}
            </span>
          </div>
          <p className="text-xs text-brown-500 mt-0.5">
            Verified orders submitted through web checkout. Filter by status, update fulfilment, and print packing invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadOrders}
            className="p-2.5 bg-cream-100 hover:bg-peach-100 text-brown-800 rounded-lg border border-line transition-colors"
            title="Refresh orders"
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

      {/* Search & Filters */}
      <div className="bg-white border border-line rounded-card p-4 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brown-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer or phone..."
            className="w-full pl-9 pr-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </form>

        {/* Fulfilment Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="all">Fulfilment: All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Preparing / Processing</option>
          <option value="out_for_delivery">Dispatched / Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Status Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as any)}
          className="px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
        >
          <option value="all">Payment: All Payment States</option>
          <option value="pending">Pending Payment</option>
          <option value="cod">Cash on Delivery (COD)</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-line rounded-card shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-brown-500">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin mx-auto mb-3" />
            <span>Loading website orders from Supabase...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-brown-500 text-xs">
            No website orders found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100/70 border-b border-line text-brown-600 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Fulfilment</th>
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
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-cream-100 text-brown-800 border border-line">
                        {ord.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(ord)}
                        className="px-2.5 py-1.5 bg-cream-100 hover:bg-orange-50 text-brown-900 hover:text-orange-700 font-semibold rounded border border-line transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail & Status Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-line rounded-card max-w-2xl w-full p-6 shadow-card my-8 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-line pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-brown-900 text-lg">
                    Order {selectedOrder.order_number}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-brown-500 mt-0.5 flex items-center gap-1">
                  <Calendar size={13} />
                  <span>Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-brown-900 rounded-lg border border-line text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Print Packing Slip / Invoice"
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-brown-400 hover:text-brown-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
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

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-cream-50/70 border border-line rounded-lg text-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-brown-500 uppercase tracking-wider">Customer Details</p>
                <p className="font-bold text-brown-900 text-sm">{selectedOrder.customer_name}</p>
                <p className="text-brown-700 flex items-center gap-1.5">
                  <Phone size={12} className="text-orange-600" />
                  <a href={`tel:${selectedOrder.customer_phone}`} className="hover:underline">
                    {selectedOrder.customer_phone}
                  </a>
                </p>
                {selectedOrder.customer_email && (
                  <p className="text-brown-500">{selectedOrder.customer_email}</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-brown-500 uppercase tracking-wider">Delivery Instructions</p>
                <p className="font-semibold text-brown-800 uppercase flex items-center gap-1">
                  <MapPin size={12} className="text-orange-600" />
                  <span>{selectedOrder.order_type === 'delivery' ? 'Home Delivery' : 'Store Pickup'}</span>
                </p>
                <p className="text-brown-700 leading-relaxed">{selectedOrder.delivery_address}</p>
                {selectedOrder.order_note && (
                  <p className="text-brown-500 italic mt-1 bg-white p-1.5 rounded border border-line">
                    Note: {selectedOrder.order_note}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-[11px] font-bold text-brown-700 uppercase tracking-wider mb-2">
                Ordered Items
              </p>
              <div className="border border-line rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-100/60 border-b border-line text-brown-600 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3">Packaging</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(selectedOrder.order_items || []).map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="py-2 px-3 font-semibold text-brown-900">{it.product_name_snapshot}</td>
                        <td className="py-2 px-3">{it.variant_size_snapshot}</td>
                        <td className="py-2 px-3 text-right">₹{it.unit_price}</td>
                        <td className="py-2 px-3 text-center font-bold">{it.quantity}</td>
                        <td className="py-2 px-3 text-right font-bold">₹{it.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-end text-xs">
              <div className="w-56 space-y-1 p-3 bg-cream-50/70 border border-line rounded-lg">
                <div className="flex justify-between text-brown-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatPrice(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-brown-600">
                  <span>Delivery Charge:</span>
                  <span>{formatPrice(selectedOrder.shipping_amount)}</span>
                </div>
                <div className="flex justify-between font-bold text-brown-900 text-sm border-t border-line pt-1">
                  <span>Final Total:</span>
                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Admin Order Status Update Controls */}
            <form onSubmit={handleUpdateStatus} className="border-t border-line pt-4 space-y-3 text-xs">
              <p className="font-bold text-brown-800 uppercase tracking-wider text-[11px]">
                Update Fulfilment & Payment
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown-700 mb-1 font-semibold">Fulfilment Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-cream-50/50 border border-line rounded-lg text-brown-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Preparing / Processing</option>
                    <option value="out_for_delivery">Dispatched / Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
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
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-brown-700 mb-1 font-semibold">Internal Operational Notes</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes for kitchen staff, delivery driver, or special packing requirements..."
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
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-cta transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Saving Changes...' : 'Update Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteOrders;
