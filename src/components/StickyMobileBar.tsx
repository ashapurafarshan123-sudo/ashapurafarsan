import React from 'react';
import { WhatsAppIcon } from './Icons';
import { SHOP_CONFIG } from '../config/shop';

export const StickyMobileBar: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Ashapura Farsan, I would like to place an order.'
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 p-2.5 bg-cream-100/95 backdrop-blur-sm border-t border-line shadow-[0_-4px_16px_rgba(58,27,16,0.08)]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-11 bg-orange-600 hover:bg-orange-700 active:bg-orange-700 text-white font-bold text-[13px] rounded-full shadow-cta flex items-center justify-center gap-2 transition-all"
        aria-label="Order on WhatsApp"
      >
        <WhatsAppIcon size={18} className="text-white" />
        <span>Order on WhatsApp (Direct to Shop)</span>
      </a>
    </div>
  );
};
