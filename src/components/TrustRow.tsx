import React from 'react';
import { Leaf, ShieldCheck, Truck, Heart } from 'lucide-react';

export const TrustRow: React.FC = () => {
  const trustItems = [
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
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-3 gap-y-2.5 sm:gap-4 md:gap-[20px] lg:gap-[24px] mt-3 sm:mt-5 pt-2 sm:pt-3">
      {trustItems.map((item, index) => {
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
  );
};
