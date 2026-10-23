import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { SHOP_CONFIG } from '../config/shop';
import { WhatsAppIcon } from '../components/Icons';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import {
  Phone,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

export const PlaceOrder: React.FC = () => {
  const { items, subtotal, formatPrice, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'delivery' as 'delivery' | 'pickup',
    address: '',
    note: '',
    saveAddress: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    order_id: string;
    order_number: string;
    total_amount: number;
    waUrl: string;
  } | null>(null);

  // Autofill if logged in
  useEffect(() => {
    if (user || profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile?.full_name || user?.user_metadata?.full_name || '',
        phone: prev.phone || profile?.phone || user?.user_metadata?.phone || '',
        email: prev.email || user?.email || '',
      }));

      // Load default address if available
      orderService.getUserAddresses().then((addrs) => {
        const defaultAddr = addrs.find((a) => a.is_default) || addrs[0];
        if (defaultAddr) {
          setFormData((prev) => ({
            ...prev,
            address: prev.address || `${defaultAddr.address_line}${defaultAddr.landmark ? ', ' + defaultAddr.landmark : ''}`,
          }));
        }
      });
    }
  }, [user, profile]);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    }

    let cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.type === 'delivery' && !formData.address.trim()) {
      errs.address = 'Please provide your delivery address in Mira Road.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before ordering.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create order persistently in Supabase
      const result = await orderService.createOrder({
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim() || undefined,
        order_type: formData.type,
        delivery_address: formData.type === 'delivery' ? formData.address.trim() : 'Shop Pickup (Mira Road)',
        order_note: formData.note.trim() || undefined,
        items: items.map((i) => ({
          product_id: i.product.id,
          size_label: i.weight,
          quantity: i.quantity,
          product_name: i.product.name,
          unit_price: i.price,
        })),
        payment_method: 'cod',
      });

      if (!result.success) {
        alert(result.error || 'Failed to place order in database.');
        setIsSubmitting(false);
        return;
      }

      // Optionally save address to profile if checked and logged in
      if (formData.saveAddress && user && formData.type === 'delivery') {
        await orderService.saveAddress({
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          address_line: formData.address.trim(),
          is_default: true,
        });
      }

      // 2. Generate WhatsApp message containing verified database order number
      const itemsList = items
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.product.name} (${item.weight}) x ${item.quantity} = Rs.${item.price * item.quantity}`
        )
        .join('\n');

      const messageLines = [
        `*New Order - Ashapura Farsan*`,
        `Order #: ${result.order_number}`,
        `Name: ${formData.name.trim()}`,
        `Phone: ${formData.phone.trim()}`,
        `Type: ${formData.type === 'delivery' ? 'Home Delivery' : 'Shop Pickup'}`,
        formData.type === 'delivery' ? `Address: ${formData.address.trim()}` : null,
        `Items:`,
        itemsList,
        `Total: Rs.${result.total_amount}`,
        formData.note.trim() ? `Note: ${formData.note.trim()}` : null,
      ].filter(Boolean);

      const fullMessage = messageLines.join('\n');
      const waUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      setSubmittedOrder({
        order_id: result.order_id,
        order_number: result.order_number,
        total_amount: result.total_amount,
        waUrl,
      });
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="bg-cream-50 min-h-screen py-16">
        <div className="container-custom max-w-lg mx-auto text-center px-4">
          <div className="bg-white border border-line rounded-card p-8 shadow-card space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} strokeWidth={2} />
            </div>

            <h2 className="font-serif font-semibold text-brown-900 text-2xl">
              Order Confirmed & Sent!
            </h2>

            <div className="p-3 bg-cream-50 rounded-lg border border-line text-xs space-y-1">
              <p className="text-brown-500 font-semibold uppercase tracking-wider text-[11px]">
                Order Reference Number
              </p>
              <p className="font-serif font-bold text-brown-900 text-lg">
                {submittedOrder.order_number}
              </p>
              <p className="text-brown-600">
                Total Amount: <strong>{formatPrice(submittedOrder.total_amount)}</strong> (Cash on Delivery / Pickup)
              </p>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed">
              Your order has been recorded in our shop system and sent to WhatsApp. If your WhatsApp window did not open automatically, click the button below:
            </p>

            <div className="pt-1 flex flex-col gap-2.5">
              <a
                href={submittedOrder.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-full shadow-cta flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon size={16} className="text-white" />
                <span>Open in WhatsApp</span>
                <ExternalLink size={13} />
              </a>

              {user ? (
                <Link
                  to={`/account/orders/${submittedOrder.order_id}`}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
                >
                  View Order in My Account
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full py-2.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors"
                >
                  Create Account to Track This Order
                </Link>
              )}

              <Link
                to="/"
                className="pt-2 text-xs text-brown-600 hover:text-orange-600 font-medium transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout & Place Order - Ashapura Farsan"
        description="Complete your order for fresh Gujarati farsan and namkeen. Direct WhatsApp ordering with shop delivery or counter pickup in Mira Road."
      />

      <div className="bg-cream-50 min-h-screen py-8 sm:py-12">
        <div className="container-custom max-w-4xl">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs text-brown-700 hover:text-orange-600 mb-6 font-semibold"
          >
            <ArrowLeft size={14} />
            <span>Continue Shopping</span>
          </Link>

          <SectionHeading
            eyebrow="FAST DIRECT CHECKOUT"
            titleRegular="Place Your"
            titleItalic="Order"
            subtitle="Fill your details below. Your order is safely saved in our database and dispatched directly to our shop staff."
          />

          {/* User Status Strip */}
          <div className="mt-4 mb-6">
            {user ? (
              <div className="p-3 bg-peach-100/60 border border-orange-200 rounded-lg text-xs flex items-center justify-between text-brown-800">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-orange-600" />
                  <span>
                    Signed in as <strong>{profile?.full_name || user.email}</strong>. This order will be linked to your account.
                  </span>
                </div>
                <Link to="/account/orders" className="text-orange-600 font-bold hover:underline shrink-0">
                  My Orders
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-cream-100 border border-line rounded-lg text-xs flex items-center justify-between text-brown-800">
                <span>
                  Already an Ashapura customer?{' '}
                  <Link to="/login?redirect=/place-order" className="text-orange-600 font-bold hover:underline">
                    Sign In
                  </Link>{' '}
                  to access your saved addresses.
                </span>
                <span className="text-[11px] text-brown-500 font-medium hidden sm:inline">
                  Guest checkout enabled
                </span>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-line rounded-card p-10 text-center shadow-card my-6">
              <div className="w-16 h-16 rounded-full bg-peach-halo flex items-center justify-center text-orange-600 mx-auto mb-4">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-brown-900 text-lg mb-1">
                Your cart is currently empty
              </h3>
              <p className="text-xs text-brown-500 mb-6 max-w-xs mx-auto">
                Please add some tasty snacks or namkeen before proceeding to checkout.
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
              {/* Left Column: Customer Form */}
              <div className="lg:col-span-7 bg-white border border-line rounded-card p-6 sm:p-7 shadow-card">
                <h3 className="font-serif font-semibold text-brown-900 text-lg mb-5 border-b border-line pb-3">
                  Customer & Delivery Information
                </h3>

                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-brown-900 mb-1">
                      Your Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full h-10 px-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-brown-900 mb-1">
                      10-Digit Mobile Number (WhatsApp) <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-brown-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="9876543210"
                        className="w-full h-10 pl-11 pr-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Order Type Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                      Order Type <span className="text-red-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'delivery' })}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          formData.type === 'delivery'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                            : 'bg-cream-50 text-brown-700 border-line hover:border-orange-500/50'
                        }`}
                      >
                        Home Delivery (Mira Road)
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'pickup' })}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                          formData.type === 'pickup'
                            ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                            : 'bg-cream-50 text-brown-700 border-line hover:border-orange-500/50'
                        }`}
                      >
                        Shop Pickup (Shantipark)
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {formData.type === 'delivery' && (
                    <div>
                      <label className="block text-xs font-semibold text-brown-900 mb-1">
                        Delivery Address in Mira Road <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Flat no, Building, Street, Landmark, Shantipark / Mira Road"
                        className="w-full p-3 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                      />
                      {errors.address && (
                        <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                      )}

                      {user && (
                        <div className="mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.saveAddress}
                              onChange={(e) =>
                                setFormData({ ...formData, saveAddress: e.target.checked })
                              }
                              className="rounded text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-[11px] text-brown-700">
                              Save this address to my account for future orders
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional Note */}
                  <div>
                    <label className="block text-xs font-semibold text-brown-900 mb-1">
                      Special Instructions / Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="e.g. Extra spicy, pack separately for gifting, etc."
                      className="w-full h-10 px-3.5 text-xs text-brown-900 bg-cream-50 border border-line rounded-lg focus:outline-none focus:border-orange-600 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Primary Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-sm rounded-full shadow-cta flex items-center justify-center gap-2.5 transition-all active:translate-y-[1px]"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <WhatsAppIcon size={18} className="text-white" />
                          <span>Place Order & Send on WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Fallback Call to Order */}
                  <div className="pt-2 text-center text-xs text-brown-500">
                    Prefer ordering on phone call?{' '}
                    <a
                      href={`tel:${SHOP_CONFIG.phonePrimaryRaw}`}
                      className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Phone size={11} />
                      <span>Call {SHOP_CONFIG.phonePrimary}</span>
                    </a>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 bg-cream-100 border border-line rounded-card p-6 shadow-card h-fit">
                <h3 className="font-serif font-semibold text-brown-900 text-base mb-4 border-b border-line pb-2">
                  Order Summary ({items.length} items)
                </h3>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-xs pb-2 border-b border-line/40">
                      <div>
                        <p className="font-bold text-brown-900">{item.product.name}</p>
                        <p className="text-brown-500 mt-0.5">
                          {item.weight} x {item.quantity} qty
                        </p>
                      </div>
                      <span className="font-bold text-brown-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-line mt-4 space-y-2">
                  <div className="flex justify-between text-xs text-brown-700">
                    <span>Subtotal</span>
                    <span className="font-bold text-brown-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-brown-700">
                    <span>Delivery</span>
                    <span className="text-green-700 font-semibold">
                      {formData.type === 'delivery' ? 'Free Local Delivery' : 'Free Pickup'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-brown-900 pt-2 border-t border-line">
                    <span>Total Amount</span>
                    <span className="text-orange-600 font-sans text-lg">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="mt-5 p-3 bg-white rounded-lg border border-line/80 text-[11px] text-brown-700 space-y-1">
                  <p className="font-bold text-brown-900">Direct Shop Guarantee</p>
                  <p>
                    Your order is stored in our database and dispatched directly to our shop counter in Mira Road. Payment is Cash on Delivery or UPI upon arrival.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default PlaceOrder;
