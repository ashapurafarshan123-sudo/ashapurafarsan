import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { OrderRecord, OrderStatus, PaymentStatus } from '../../types';
import { useCart } from '../../context/CartContext';
import {
  Search,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { formatPrice } = useCart();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('pending');
  const [internalNotes, setInternalNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const loadOrders = async () => {
    try {
      const data = await adminService.getAllOrders({
        status: statusFilter,
        payment_status: paymentFilter,
        search,
      });
      setOrders(data);
    } catch (e) {
      console.error('Failed to load admin orders:', e);
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
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    setUpdateError('');
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

      // Update local state
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
      setIsUpdating(false);
    } catch {
      setUpdateError('An unexpected error occurred while updating status.');
      setIsUpdating(false);
    }
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

  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-card space-y-6">
      <div className="border-b border-line pb-4">
        <h2 className="font-serif font-bold text-brown-900 text-xl">Order Management</h2>
        <p className="text-xs text-brown-500 mt-0.5">
          Process customer orders, verify dispatch and manage payment statuses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer name, or phone..."
            className="w-full h-9 pl-8 pr-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="h-9 px-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
          className="h-9 px-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
        >
          <option value="all">All Payment Statuses</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="cod">Cash on Delivery</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-xs text-brown-500">
          No orders match the selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-brown-800 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Order Status</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50/60">
                  <td className="py-3 px-3 font-bold text-brown-900">{order.order_number}</td>
                  <td className="py-3 px-3 text-brown-500 text-[11px]">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3 text-brown-800">
                    <div className="font-semibold">{order.customer_name}</div>
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
                  <td className="py-3 px-3">
                    <span className="text-[10px] uppercase font-semibold text-brown-700 bg-white border border-line px-2 py-0.5 rounded">
                      {order.payment_status} ({order.payment_method})
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-orange-600">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(order)}
                      className="px-2.5 py-1 bg-cream-100 hover:bg-peach-100 text-brown-900 text-[11px] font-semibold rounded border border-line inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail & Status Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-brown-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-card border border-line p-6 max-w-2xl w-full shadow-2xl my-8 space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif font-bold text-brown-900 text-lg">
                  Order: {selectedOrder.order_number}
                </h3>
                <p className="text-[11px] text-brown-500">
                  Placed on{' '}
                  {new Date(selectedOrder.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-brown-400 hover:text-brown-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {updateError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{updateError}</span>
              </div>
            )}

            {/* Customer & Delivery Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-cream-50 rounded-lg border border-line text-xs">
              <div>
                <p className="font-bold text-brown-900 mb-1">Customer Information</p>
                <p className="text-brown-700">Name: {selectedOrder.customer_name}</p>
                <p className="text-brown-700">Phone: {selectedOrder.customer_phone}</p>
                {selectedOrder.customer_email && (
                  <p className="text-brown-700">Email: {selectedOrder.customer_email}</p>
                )}
              </div>
              <div>
                <p className="font-bold text-brown-900 mb-1">Fulfilment & Delivery</p>
                <p className="text-brown-700 capitalize">Type: {selectedOrder.order_type}</p>
                <p className="text-brown-700">Address: {selectedOrder.delivery_address}</p>
                {selectedOrder.order_note && (
                  <p className="text-brown-700 italic mt-1">Note: {selectedOrder.order_note}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="font-bold text-xs text-brown-900 mb-2">Itemized Breakdown</p>
              <div className="border border-line rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-cream-100 border-b border-line font-semibold">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Size</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {selectedOrder.order_items?.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-semibold text-brown-900">
                          {item.product_name_snapshot}
                        </td>
                        <td className="p-2.5 text-center text-brown-700">
                          {item.variant_size_snapshot}
                        </td>
                        <td className="p-2.5 text-right text-brown-700">
                          {formatPrice(item.unit_price)}
                        </td>
                        <td className="p-2.5 text-center font-bold text-brown-900">
                          {item.quantity}
                        </td>
                        <td className="p-2.5 text-right font-bold text-brown-900">
                          {formatPrice(item.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center text-xs p-3 bg-cream-100 rounded-lg border border-line">
              <span className="font-bold text-brown-900">Grand Total:</span>
              <span className="font-bold text-orange-600 text-base">
                {formatPrice(selectedOrder.total_amount)}
              </span>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-3 pt-2 border-t border-line text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brown-900 mb-1">
                    Order Lifecycle Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brown-900 mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brown-900 mb-1">
                  Internal Staff Notes (Not visible to customer)
                </label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="e.g. Dispatched via delivery boy Raju, customer confirmed phone call..."
                  className="w-full h-9 px-3 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 font-semibold rounded-full border border-line"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold rounded-full shadow-cta flex items-center gap-2"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Update Order</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminOrders;
