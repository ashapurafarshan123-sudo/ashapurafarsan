import React from 'react';
import { WhatsAppIcon } from './Icons';
import { SHOP_CONFIG } from '../config/shop';

export const StickyMobileBar: React.FC = () => {
  const whatsappUrl = `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    'Hello Ashapura Farsan, I would like to place an order.'
  )}`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-[#FFFBF5]/95 backdrop-blur-md border-t border-[#EEDBCA] shadow-[0_-4px_20px_rgba(58,27,16,0.12)]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-11 bg-orange-600 hover:bg-orange-700 active:bg-orange-700 text-white font-bold text-[13px] rounded-full shadow-cta flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="Order on WhatsApp"
      >
        <WhatsAppIcon size={18} className="text-white" />
        <span>Order on WhatsApp (Direct to Shop)</span>
      </a>
    </div>
  );
};
