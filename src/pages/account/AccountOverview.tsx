import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { OrderRecord } from '../../types';
import { useCart } from '../../context/CartContext';
import { Package, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

export const AccountOverview: React.FC = () => {
  const { user, profile } = useAuth();
  const { formatPrice } = useCart();
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await orderService.getUserOrders();
        setRecentOrders(orders);
      } catch (e) {
        console.error('Failed to load recent orders:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSpent = recentOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + Number(o.total_amount), 0);

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
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Total Orders</p>
              <p className="font-serif font-bold text-2xl text-brown-900">{recentOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Active Deliveries</p>
              <p className="font-serif font-bold text-2xl text-brown-900">
                {recentOrders.filter((o) => ['pending', 'confirmed', 'processing', 'out_for_delivery'].includes(o.status)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-line rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-brown-500 uppercase tracking-wider">Total Spend</p>
              <p className="font-serif font-bold text-2xl text-brown-900">{formatPrice(totalSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile & Address Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-line rounded-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-semibold text-brown-900 text-base mb-2">Customer Profile</h3>
            <p className="text-xs text-brown-700">
              <strong>Name:</strong> {profile?.full_name || 'Not set'}
            </p>
            <p className="text-xs text-brown-700 mt-1">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-xs text-brown-700 mt-1">
              <strong>Phone:</strong> {profile?.phone || 'Not set'}
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-line">
            <Link
              to="/account/profile"
              className="text-xs text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Edit profile details</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-line rounded-card p-5 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-semibold text-brown-900 text-base mb-2">Delivery Addresses</h3>
            <p className="text-xs text-brown-600 leading-relaxed">
              Save your Mira Road addresses for 1-click checkout when placing farsan orders.
            </p>
          </div>
          <div className="pt-4 mt-2 border-t border-line">
            <Link
              to="/account/addresses"
              className="text-xs text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <MapPin size={13} />
              <span>Manage saved addresses</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-line rounded-card p-6 shadow-card">
        <div className="flex justify-between items-center mb-5 border-b border-line pb-3">
          <h2 className="font-serif font-semibold text-brown-900 text-lg">Recent Orders</h2>
          <Link
            to="/account/orders"
            className="text-xs text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-600 rounded-full animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <p className="font-serif font-semibold text-brown-900 text-base">No orders placed yet</p>
            <p className="text-xs text-brown-500 max-w-sm mx-auto">
              Craving fresh Ratlami Sev, crispy Bhavnagri Gathiya or Diet Chivda? Explore our artisanal snacks!
            </p>
            <Link
              to="/shop"
              className="inline-block mt-2 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-brown-900 text-xs">{order.order_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-brown-500 mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {order.order_type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-sans font-bold text-orange-600 text-sm">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                  <Link
                    to={`/account/orders/${order.id}`}
                    className="px-3.5 py-1.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AccountOverview;
