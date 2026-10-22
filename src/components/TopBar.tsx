import React from 'react';
import { Truck, MapPin, Phone } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shop';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-brown-900 text-[#F7E8D3] text-[12px] font-medium h-[31px] flex items-center border-b border-[#4A2412]/50">
      <div className="container-custom w-full flex items-center justify-between">
        {/* Left: Timing */}
        <div className="flex items-center gap-2">
          <Truck size={14} strokeWidth={1.5} className="text-[#F7E8D3] flex-shrink-0" aria-hidden="true" />
          <span>{SHOP_CONFIG.hours}</span>
        </div>

        {/* Center: Address (hidden on mobile per design.md 8) */}
        <div className="hidden md:flex items-center gap-2">
          <MapPin size={14} strokeWidth={1.5} className="text-[#F7E8D3] flex-shrink-0" aria-hidden="true" />
          <a
            href={SHOP_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-white transition-colors"
          >
            {SHOP_CONFIG.address}
          </a>
        </div>

        {/* Right: Telephones (tap to call) */}
        <div className="flex items-center gap-2">
          <Phone size={14} strokeWidth={1.5} className="text-[#F7E8D3] flex-shrink-0" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">Call:</span>
            <a
              href={`tel:${SHOP_CONFIG.phonePrimaryRaw}`}
              className="hover:underline hover:text-white transition-colors"
            >
              {SHOP_CONFIG.phonePrimary}
            </a>
            <span className="hidden sm:inline">/</span>
            <a
              href={`tel:${SHOP_CONFIG.phoneSecondaryRaw}`}
              className="hidden sm:inline hover:underline hover:text-white transition-colors"
            >
              {SHOP_CONFIG.phoneSecondary}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
