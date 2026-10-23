import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { OrderRecord } from '../../types';
import { useCart } from '../../context/CartContext';
import { Package, Search, ChevronRight, ShoppingBag, AlertCircle } from 'lucide-react';

export const AccountOrders: React.FC = () => {
  const { formatPrice } = useCart();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.order_number.toLowerCase().includes(search.toLowerCase()) ||
      order.order_items?.some((item) =>
        item.product_name_snapshot.toLowerCase().includes(search.toLowerCase())
      );
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
    <div className="bg-white border border-line rounded-card p-6 shadow-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-line pb-4">
        <div>
          <h2 className="font-serif font-semibold text-brown-900 text-xl">Order History</h2>
          <p className="text-xs text-brown-500 mt-0.5">
            View details, item snapshots and live statuses of your past orders.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order or snack..."
              className="h-9 pl-8 pr-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 w-full sm:w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-14 h-14 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center mx-auto">
            {search ? <AlertCircle size={26} /> : <Package size={26} />}
          </div>
          <h3 className="font-serif font-semibold text-brown-900 text-lg">
            {search ? 'No matching orders found' : 'No orders in your history'}
          </h3>
          <p className="text-xs text-brown-500 max-w-sm mx-auto">
            {search
              ? 'Try adjusting your search keywords or filter to find what you are looking for.'
              : 'Browse our signature Gujarati snacks, chivda and namkeen to place your first order.'}
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
            >
              <ShoppingBag size={14} />
              <span>Explore Farsan Menu</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-line rounded-lg p-5 hover:border-orange-400/60 transition-all bg-cream-50/50"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-line/60">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-brown-900 text-sm">{order.order_number}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-brown-500 uppercase bg-white border border-line px-2 py-0.5 rounded">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                  </span>
                </div>

                <div className="text-xs text-brown-500">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="py-3 text-xs text-brown-700 space-y-1">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span>
                        {item.product_name_snapshot} ({item.variant_size_snapshot}) × {item.quantity}
                      </span>
                      <span className="font-medium text-brown-900">
                        {formatPrice(item.line_total)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="italic text-brown-500">Details available in order view</p>
                )}
              </div>

              {/* Total & Detail Link */}
              <div className="pt-3 border-t border-line/60 flex justify-between items-center">
                <div>
                  <span className="text-xs text-brown-500 mr-2">Total Amount:</span>
                  <span className="font-sans font-bold text-orange-600 text-base">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>

                <Link
                  to={`/account/orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-xs text-orange-600 font-bold hover:underline"
                >
                  <span>View Full Order Details</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AccountOrders;
