import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { WhatsAppIcon, RupeeIcon } from './Icons';
import { SHOP_CONFIG } from '../config/shop';

export const FeatureStrip: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: "Open Daily",
      subtitle: "10:00 AM – 10:00 PM",
      link: null,
    },
    {
      icon: Sparkles,
      title: "Fresh Every Day",
      subtitle: "Made in-house, no preservatives",
      link: null,
    },
    {
      icon: RupeeIcon,
      title: "Affordable Prices",
      subtitle: "Great quality, great value",
      link: null,
    },
    {
      icon: WhatsAppIcon,
      title: "WhatsApp Orders",
      subtitle: "Fast, easy, direct to shop",
      link: `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hello Ashapura Farsan, I would like to place an order.')}`,
    },
  ];

  return (
    <section className="bg-peach-100 h-[var(--benefits-height)] flex items-center border-b border-line-strong flex-shrink-0 z-20">
      <div className="container-custom w-full h-full">
        <div className="flex items-center overflow-x-auto no-scrollbar md:grid md:grid-cols-4 h-full">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            const content = (
              <div
                className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 md:px-2 lg:px-4 justify-start md:justify-center h-full py-1 flex-shrink-0 md:flex-shrink ${
                  index < features.length - 1 ? 'border-r border-line-strong' : ''
                }`}
              >
                {/* 26px filled orange circle */}
                <div
                  className="w-[26px] h-[26px] rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm"
                  aria-hidden="true"
                >
                  <IconComponent size={14} className="text-white" />
                </div>
                {/* Text: Title & Subtitle */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-brown-900 leading-tight whitespace-nowrap font-sans">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-normal text-brown-500 leading-tight mt-0.5 whitespace-nowrap font-sans">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );

            return item.link ? (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full flex items-center hover:opacity-85 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-orange-600 rounded flex-shrink-0 md:flex-shrink"
              >
                {content}
              </a>
            ) : (
              <div key={index} className="h-full flex items-center flex-shrink-0 md:flex-shrink">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

