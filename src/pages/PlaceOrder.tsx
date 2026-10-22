import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SHOP_CONFIG } from '../config/shop';
import { WhatsAppIcon } from '../components/Icons';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import { Phone, CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export const PlaceOrder: React.FC = () => {
  const { items, subtotal, formatPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'delivery' as 'delivery' | 'pickup',
    address: '',
    note: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    }

    // 10-digit Indian mobile number validation
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (formData.type === 'delivery' && !formData.address.trim()) {
      errs.address = 'Please provide your delivery address in Mira Road.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before ordering.');
      return;
    }

    // Generate exact WhatsApp message format specified in instructions:
    /*
      *New Order - Ashapura Farsan*
      Name: <name>
      Phone: <phone>
      Type: Delivery | Pickup
      Address: <address>
      Items:
      1. <product> (<weight>) x <qty> = Rs.<line total>
      Total: Rs.<total>
      Note: <note>
    */
    const itemsList = items
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name} (${item.weight}) x ${item.quantity} = Rs.${item.price * item.quantity}`
      )
      .join('\n');

    const messageLines = [
      `*New Order - Ashapura Farsan*`,
      `Name: ${formData.name.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Type: ${formData.type === 'delivery' ? 'Delivery' : 'Pickup'}`,
      formData.type === 'delivery' ? `Address: ${formData.address.trim()}` : null,
      `Items:`,
      itemsList,
      `Total: Rs.${subtotal}`,
      formData.note.trim() ? `Note: ${formData.note.trim()}` : null,
    ].filter(Boolean);

    const fullMessage = messageLines.join('\n');
    const waUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-cream-50 min-h-screen py-16">
        <div className="container-custom max-w-lg mx-auto text-center">
          <div className="bg-white border border-line rounded-card p-8 shadow-card space-y-5">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} strokeWidth={2} />
            </div>

            <h2 className="font-serif font-semibold text-brown-900 text-2xl">
              Order Sent to WhatsApp!
            </h2>

            <p className="text-sm text-brown-700 leading-relaxed">
              Your order message has been prepared for Ashapura Farsan. If your
              WhatsApp window did not open automatically, you can message or call
              us directly at <strong>{SHOP_CONFIG.phonePrimary}</strong>.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setIsSubmitted(false);
                }}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
              >
                Clear Cart & Start New Order
              </button>

              <Link
                to="/"
                className="px-6 py-2.5 bg-cream-100 hover:bg-peach-100 text-brown-900 text-xs font-semibold rounded-full border border-line transition-colors"
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
        title="Place Order on WhatsApp - Ashapura Farsan"
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
            subtitle="Fill your details below to send your order directly to our shop on WhatsApp. Fast, simple, and personal."
          />

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Left Column: Customer Form */}
              <div className="lg:col-span-7 bg-white border border-line rounded-card p-6 sm:p-7 shadow-card">
                <h3 className="font-serif font-semibold text-brown-900 text-lg mb-5 border-b border-line pb-3">
                  Customer Information
                </h3>

                <form onSubmit={handleWhatsAppSend} className="space-y-4">
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
                        Home Delivery
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
                        Shop Pickup (Mira Road)
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address (required only for delivery) */}
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

                  {/* Primary WhatsApp Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-full shadow-cta flex items-center justify-center gap-2.5 transition-all active:translate-y-[1px]"
                    >
                      <WhatsAppIcon size={18} className="text-white" />
                      <span>Send Order on WhatsApp</span>
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
                      {formData.type === 'delivery' ? 'Calculated on WhatsApp' : 'Free Pickup'}
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
                    Your order goes directly to our shop staff. We pack fresh items and confirm delivery timings immediately.
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
