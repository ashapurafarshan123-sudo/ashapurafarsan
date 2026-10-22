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
    <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 md:gap-[20px] lg:gap-[24px] mt-4 sm:mt-5 pt-3">
      {trustItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="flex items-center gap-2">
            <IconComponent
              size={18}
              strokeWidth={1.75}
              className="text-[#DCA052] flex-shrink-0"
              aria-hidden="true"
            />
            <div className="text-[11px] leading-[1.2] font-medium text-white/90">
              <p>{item.line1}</p>
              <p>{item.line2}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
