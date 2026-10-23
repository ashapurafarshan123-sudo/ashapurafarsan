import React from 'react';
import { WhatsAppIcon } from './Icons';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getWhatsAppOrderUrl } from '../utils/whatsapp';

export const StickyMobileBar: React.FC = () => {
  const { items, subtotal, totalItems, openDrawer } = useCart();
  const hasItems = items.length > 0;
  const whatsappUrl = getWhatsAppOrderUrl(items, subtotal);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-[#FFFBF5]/95 backdrop-blur-md border-t border-[#EEDBCA] shadow-[0_-4px_20px_rgba(58,27,16,0.12)] flex items-center gap-2">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 h-11 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white font-bold text-[13px] rounded-full shadow-cta flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Order on WhatsApp"
      >
        <WhatsAppIcon size={18} className="text-white flex-shrink-0" />
        <span className="truncate">
          {hasItems
            ? `Order on WhatsApp (${totalItems} items • ₹${subtotal})`
            : 'Order on WhatsApp (+91 79 7733 8814)'}
        </span>
      </a>

      {hasItems && (
        <button
          type="button"
          onClick={openDrawer}
          className="h-11 px-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-700 text-white font-bold text-xs rounded-full shadow-cta flex items-center justify-center gap-1.5 whitespace-nowrap transition-all"
          aria-label="View Cart"
        >
          <ShoppingBag size={14} strokeWidth={2} />
          <span>Cart ({totalItems})</span>
        </button>
      )}
    </div>
  );
};
