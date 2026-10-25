import React from 'react';
import { Truck, MapPin, Phone, Sparkles } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const TopBar: React.FC = () => {
  const { contact, operational, discount } = useStoreSettings();

  const announcementMessage =
    (discount.is_active && discount.banner_text) ||
    operational.announcement ||
    '';

  return (
    <div className="bg-brown-900 text-[#F7E8D3] text-[11.5px] sm:text-[12px] font-medium min-h-[32px] py-1 flex items-center border-b border-[#4A2412]/60 select-none">
      <div className="container-custom w-full flex flex-wrap items-center justify-between gap-y-1">
        {/* Left: Timing */}
        <div className="flex items-center gap-2">
          <Truck size={13} strokeWidth={1.6} className="text-[#F5C27A] flex-shrink-0" aria-hidden="true" />
          <span className="font-sans text-[11px] sm:text-[12px]">{contact.hours}</span>
        </div>

        {/* Center: Live Announcement or Active Discount Banner (Desktop) */}
        {announcementMessage ? (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-white font-medium text-[11px] tracking-wide">
            <Sparkles size={12} className="text-[#F5C27A] flex-shrink-0" />
            <span className="line-clamp-1">{announcementMessage}</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-1.5 text-[#D9BFA0]">
            <MapPin size={13} strokeWidth={1.6} className="text-[#F5C27A] flex-shrink-0" aria-hidden="true" />
            <a
              href={contact.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-white transition-colors font-sans"
            >
              {contact.address}
            </a>
          </div>
        )}

        {/* Right: Telephones (tap to call) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Phone size={13} strokeWidth={1.6} className="text-[#F5C27A] flex-shrink-0" aria-hidden="true" />
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-[#D9BFA0]">Call:</span>
            <a
              href={`tel:${contact.phone_primary_raw}`}
              className="hover:underline hover:text-white text-white font-semibold transition-colors font-sans"
            >
              {contact.phone_primary}
            </a>
            {contact.phone_secondary && contact.phone_secondary_raw && (
              <>
                <span className="hidden sm:inline text-[#A68F7B]">/</span>
                <a
                  href={`tel:${contact.phone_secondary_raw}`}
                  className="hidden sm:inline hover:underline hover:text-white text-[#F7E8D3] transition-colors font-sans"
                >
                  {contact.phone_secondary}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
