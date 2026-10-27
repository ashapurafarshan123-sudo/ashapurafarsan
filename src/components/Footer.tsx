import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { SHOP_CONFIG } from '../config/shop';
import { WhatsAppIcon } from './Icons';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const Footer: React.FC = () => {
  const { contact } = useStoreSettings();

  return (
    <footer className="bg-brown-900 text-[#F7E8D3] pt-12 pb-24 md:pb-12 border-t border-[#4A2412]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-[#5E4636]/60">
          {/* Col 1: Brand & Legacy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="/images/logo-badge.svg"
                  alt="Ashapura Farsan"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-semibold text-2xl text-white block leading-tight">
                  {SHOP_CONFIG.name}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#D9BFA0] leading-relaxed max-w-sm">
              Bringing authentic taste and timeless recipes of Gujarati farsan,
              namkeen, wafers and festive specials to Mira Road, Mumbai. Made
              fresh in-house with purity and devotion.
            </p>

            <div className="pt-1">
              <a
                href={`https://wa.me/${contact.whatsapp_number}?text=${encodeURIComponent('Hello Ashapura Farsan, I would like to place an order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-bold transition-colors shadow-sm"
              >
                <WhatsAppIcon size={15} />
                <span>Chat with Shop</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs text-[#D9BFA0]">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white hover:underline transition-colors">
                  All Farsan & Namkeen
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">
                  About Our Shop
                </Link>
              </li>
              <li>
                <Link to="/place-order" className="hover:text-white hover:underline transition-colors">
                  Place an Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                  Contact & Location
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white hover:underline transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h3 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Our Specialties
            </h3>
            <ul className="space-y-2.5 text-xs text-[#D9BFA0]">
              <li>
                <Link to="/shop?category=namkeen" className="hover:text-white hover:underline transition-colors">
                  Ratlami & Nylon Sev
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chakli" className="hover:text-white hover:underline transition-colors">
                  Butter Rice Chakli
                </Link>
              </li>
              <li>
                <Link to="/shop?category=diet-chivda" className="hover:text-white hover:underline transition-colors">
                  Diet Roasted Poha Chivda
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chana-singh" className="hover:text-white hover:underline transition-colors">
                  Masala Singh & Roasted Chana
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chikki" className="hover:text-white hover:underline transition-colors">
                  Peanut Jaggery Chikki
                </Link>
              </li>
              <li>
                <Link to="/shop?category=satwik" className="hover:text-white hover:underline transition-colors">
                  Pure Maska Khari
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3.5">
            <h3 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Store Contact
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-[#D9BFA0]">
              <MapPin size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p>{contact.full_address}</p>
                <a
                  href={contact.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-orange-500 hover:text-white hover:underline mt-1 font-semibold"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#D9BFA0]">
              <Phone size={16} className="text-amber-400 flex-shrink-0" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <a href={`tel:${contact.phone_primary_raw}`} className="hover:text-white hover:underline">
                  {contact.phone_primary}
                </a>
                {contact.phone_secondary && contact.phone_secondary_raw && (
                  <>
                    <span>/</span>
                    <a href={`tel:${contact.phone_secondary_raw}`} className="hover:text-white hover:underline">
                      {contact.phone_secondary}
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#D9BFA0]">
              <Clock size={16} className="text-amber-400 flex-shrink-0" />
              <span>{contact.hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A68F7B] gap-3">
          <p>
            © {new Date().getFullYear()} {SHOP_CONFIG.name} Farsan. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Handcrafted with devotion in Mira Road, Mumbai.
          </p>
        </div>
      </div>
    </footer>
  );
};
