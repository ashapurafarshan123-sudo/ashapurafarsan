import React from 'react';
import { Leaf, ShieldCheck, Truck, Heart } from 'lucide-react';

export const TrustRow: React.FC = () => {
  const desktopItems = [
    {
      icon: Leaf,
      line1: 'Premium',
      line2: 'Ingredients',
    },
    {
      icon: ShieldCheck,
      line1: 'Hygienically',
      line2: 'Prepared',
    },
    {
      icon: Truck,
      line1: 'Pan India',
      line2: 'Delivery',
    },
    {
      icon: Heart,
      line1: 'Trusted',
      line2: 'Since 1923',
    },
  ];

  return (
    <>
      {/* Mobile: Exactly 3 trust highlights in a single horizontal row beneath buttons */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-[340px] xs:max-w-[365px] mx-auto mt-4 pt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
        {/* 1. Hygienically Prepared */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center flex-shrink-0 text-[#DCA052]">
            <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="text-[10.5px] xs:text-[11px] leading-[1.18] font-medium text-white/95 text-left">
            <p>Hygienically</p>
            <p>Prepared</p>
          </div>
        </div>

        {/* 2. Pan India Delivery */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center flex-shrink-0 text-[#DCA052]">
            <Truck size={16} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="text-[10.5px] xs:text-[11px] leading-[1.18] font-medium text-white/95 text-left">
            <p>Pan India</p>
            <p>Delivery</p>
          </div>
        </div>

        {/* 3. Trusted Since 1923 */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-4 h-4 xs:w-5 xs:h-5 flex items-center justify-center flex-shrink-0 text-[#DCA052]">
            <Heart size={16} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="text-[10.5px] xs:text-[11px] leading-[1.18] font-medium text-white/95 text-left">
            <p>Trusted</p>
            <p>Since 1923</p>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet: Original 4 highlights row preserved */}
      <div className="hidden sm:flex sm:items-center gap-4 md:gap-[20px] lg:gap-[24px] mt-4 sm:mt-5 pt-3">
        {desktopItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <IconComponent
                  size={18}
                  strokeWidth={1.75}
                  className="text-[#DCA052]"
                  aria-hidden="true"
                />
              </div>
              <div className="text-[11px] leading-[1.25] font-medium text-white/95">
                <p>{item.line1}</p>
                <p>{item.line2}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
