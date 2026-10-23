import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { OrderRecord } from '../../types';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { SHOP_CONFIG } from '../../config/shop';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useCart();
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await orderService.getOrderById(id);
        if (!data) {
          setError('Order not found or you do not have permission to view it.');
        } else {
          setOrder(data);
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || 'Failed to retrieve order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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
        <p className="text-xs font-semibold text-brown-500">Loading order records...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white border border-line rounded-card p-8 text-center shadow-card space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle size={28} />
        </div>
        <h3 className="font-serif font-semibold text-brown-900 text-lg">Order Unavailable</h3>
        <p className="text-xs text-brown-600 max-w-sm mx-auto leading-relaxed">
          {error || 'We could not locate this order. It may belong to another user or the link has expired.'}
        </p>
        <div className="pt-2">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-bold rounded-full border border-line transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Order History</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card space-y-6">
      {/* Top back navigation */}
      <div className="flex justify-between items-center border-b border-line pb-4">
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-brown-600 hover:text-orange-600 font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Orders</span>
        </Link>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadge(
            order.status
          )}`}
        >
          Status: {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Order Header Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-cream-50 rounded-lg border border-line">
        <div>
          <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Order Number</p>
          <p className="font-serif font-bold text-brown-900 text-base">{order.order_number}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Order Date</p>
          <p className="text-xs text-brown-900 font-medium">
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Payment Method</p>
          <p className="text-xs text-brown-900 font-medium uppercase">
            {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
          </p>
        </div>
      </div>

      {/* Itemized Table */}
      <div>
        <h3 className="font-serif font-semibold text-brown-900 text-base mb-3">Itemized Items</h3>
        <div className="border border-line rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-brown-800 font-semibold border-b border-line">
              <tr>
                <th className="py-2.5 px-4">Snack / Product</th>
                <th className="py-2.5 px-4 text-center">Package Size</th>
                <th className="py-2.5 px-4 text-right">Price Snapshot</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <tr key={item.id} className="hover:bg-cream-50/50">
                    <td className="py-3 px-4 font-semibold text-brown-900">
                      {item.product_name_snapshot}
                    </td>
                    <td className="py-3 px-4 text-center text-brown-700">
                      {item.variant_size_snapshot}
                    </td>
                    <td className="py-3 px-4 text-right text-brown-700">
                      {formatPrice(item.unit_price)}
                    </td>
                    <td className="py-3 px-4 text-center text-brown-900 font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-brown-900">
                      {formatPrice(item.line_total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-brown-500">
                    No individual item details stored.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Shipping & Pricing Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Delivery Details */}
        <div className="border border-line rounded-lg p-4 bg-cream-50/50 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-brown-900">
            <MapPin size={15} className="text-orange-600" />
            <span>Fulfillment Details</span>
          </div>
          <p className="text-brown-700">
            <strong>Customer:</strong> {order.customer_name} ({order.customer_phone})
          </p>
          <p className="text-brown-700">
            <strong>Type:</strong> {order.order_type === 'delivery' ? 'Home Delivery' : 'Shop Counter Pickup'}
          </p>
          <p className="text-brown-700">
            <strong>Address:</strong> {order.delivery_address}
          </p>
          {order.order_note && (
            <p className="text-brown-700">
              <strong>Instructions:</strong> {order.order_note}
            </p>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="border border-line rounded-lg p-4 bg-cream-100 space-y-2 text-xs">
          <div className="flex justify-between text-brown-700">
            <span>Subtotal</span>
            <span className="font-semibold text-brown-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-brown-700">
            <span>Delivery Fee</span>
            <span className="text-green-700 font-semibold">
              {order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : 'Free / Direct'}
            </span>
          </div>
          <div className="flex justify-between text-brown-700">
            <span>Payment Status</span>
            <span className="capitalize font-semibold text-brown-900">{order.payment_status}</span>
          </div>
          <div className="border-t border-line pt-2 flex justify-between text-sm font-bold text-brown-900">
            <span>Total Paid / Due</span>
            <span className="text-orange-600 font-sans text-base">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Need Help CTA */}
      <div className="p-4 bg-peach-halo/40 border border-orange-200/60 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-orange-600 shrink-0" />
          <p className="text-xs text-brown-800">
            Need an update or have special packing requests? Reach out directly to our shop counter.
          </p>
        </div>
        <a
          href={`tel:${SHOP_CONFIG.phonePrimaryRaw}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors shrink-0"
        >
          <Phone size={12} />
          <span>Call Shop ({SHOP_CONFIG.phonePrimary})</span>
        </a>
      </div>
    </div>
  );
};
export default OrderDetail;
