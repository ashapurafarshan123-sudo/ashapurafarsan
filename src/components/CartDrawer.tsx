import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import { SmartImage } from './SmartImage';
import { WhatsAppIcon } from './Icons';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    finalTotal,
    globalDiscount,
    formatPrice,
  } = useCart();

  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/place-order');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Your Shopping Cart">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-brown-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-cream-50 border-l border-line shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-line bg-cream-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} strokeWidth={1.75} className="text-orange-600" />
                  <h2 className="font-serif font-semibold text-brown-900 text-lg">
                    Your Shopping Cart
                  </h2>
                  <span className="text-xs bg-orange-500/10 text-orange-600 font-bold px-2 py-0.5 rounded-full ml-1">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-1.5 text-brown-700 hover:text-brown-900 rounded-full hover:bg-cream-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-600"
                  aria-label="Close cart drawer"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-line/60">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-peach-halo flex items-center justify-center text-orange-600">
                      <ShoppingBag size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-brown-900 text-base">
                        Your cart is empty
                      </h3>
                      <p className="text-xs text-brown-500 mt-1 max-w-[240px]">
                        Add freshly prepared Gujarati farsan, namkeen or wafers to your cart.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        closeDrawer();
                        navigate('/shop');
                      }}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-3.5 flex gap-3.5 items-center">
                      {/* Product thumbnail */}
                      <div className="w-14 h-14 bg-peach-halo rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <SmartImage
                          src={item.product.image}
                          alt={item.product.name}
                          titleName={item.product.name}
                          className="w-12 h-12 object-cover rounded-full"
                          haloClassName="w-12 h-12"
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-semibold text-brown-900 text-sm truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-semibold text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded">
                            {item.weight}
                          </span>
                          <span className="text-xs font-medium text-brown-700">
                            {formatPrice(item.price)} each
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-line rounded-full bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-brown-700 hover:text-orange-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} strokeWidth={2} />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-brown-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-brown-700 hover:text-orange-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} strokeWidth={2} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-brown-500 hover:text-red-600 transition-colors ml-1"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 size={13} strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-brown-900 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 bg-cream-100 border-t border-line space-y-3">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-brown-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-brown-900 font-sans">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Active Storewide Discount */}
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-xs text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} />
                        <span className="font-bold">
                          {globalDiscount?.banner_text || 'Storewide Discount Applied'}
                        </span>
                      </div>
                      <span className="font-bold font-sans">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  {/* Final Total */}
                  <div className="flex items-center justify-between text-sm sm:text-base border-t border-line/60 pt-2">
                    <span className="font-bold text-brown-900">Total Payable</span>
                    <span className="font-bold text-orange-600 text-lg font-sans">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <p className="text-[11px] text-brown-500 leading-tight">
                    Taxes included. Delivery charges (if applicable) confirmed directly by shop on WhatsApp.
                  </p>

                  <a
                    href={getWhatsAppOrderUrl(items, finalTotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Non-blocking order intent capture in Supabase
                      orderService.createOrder({
                        customer_name: 'WhatsApp Customer (Direct Chat)',
                        customer_phone: '9999999999',
                        order_type: 'delivery',
                        delivery_address: 'To be confirmed in WhatsApp conversation',
                        order_note: 'Initiated via Cart Drawer WhatsApp button',
                        payment_method: 'whatsapp_direct',
                        items: items.map((i) => ({
                          product_id: i.product.id,
                          size_label: i.weight,
                          quantity: i.quantity,
                          product_name: i.product.name,
                          unit_price: i.price,
                        })),
                      }).catch(() => {});
                    }}
                    className="w-full h-11 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-bold text-sm rounded-full shadow-cta flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
                  >
                    <WhatsAppIcon size={18} className="text-white" />
                    <span>Order on WhatsApp (Direct to Shop)</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full h-10 bg-white hover:bg-cream-50 text-brown-900 border border-line font-semibold text-xs rounded-full flex items-center justify-center gap-2 transition-all active:translate-y-[1px]"
                  >
                    <span>Or Fill Delivery Address on Website</span>
                    <ArrowRight size={13} strokeWidth={2} />
                  </button>

                  <div className="text-center pt-1">
                    <Link
                      to="/shop"
                      onClick={closeDrawer}
                      className="text-xs text-orange-600 hover:underline font-semibold"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
