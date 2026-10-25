import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Wheat, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollSplitCard, ScrollSplitCardItem } from './ScrollSplitCard';
import { Product } from '../types';

interface HeroProductsSectionProps {
  products?: Product[];
}

export const HeroProductsSection: React.FC<HeroProductsSectionProps> = ({ products = [] }) => {
  // Find live product overrides if available from database
  const kachoriProd = products.find(
    (p) => p.slug.includes('kachori') || p.name.toLowerCase().includes('kachori')
  );
  const multigrainProd = products.find(
    (p) => p.slug.includes('multigrain') || p.name.toLowerCase().includes('multigrain')
  );
  const khattaProd = products.find(
    (p) => p.slug.includes('khatta') || p.name.toLowerCase().includes('khatta')
  );

  const kachoriPrice = kachoriProd?.prices['250g'] ? `₹${kachoriProd.prices['250g']} / 250g` : '₹110 / 250g';
  const multigrainPrice = multigrainProd?.prices['250g'] ? `₹${multigrainProd.prices['250g']} / 250g` : '₹120 / 250g';
  const khattaPrice = khattaProd?.prices['250g'] ? `₹${khattaProd.prices['250g']} / 250g` : '₹95 / 250g';

  const heroCards: ScrollSplitCardItem[] = [
    {
      title: kachoriProd?.name || 'Ashapura Spcl Kachori',
      subtitle: 'Crisp & Golden',
      description:
        kachoriProd?.description ||
        'Flaky, golden-fried artisanal kachoris filled with spiced crushed moong dal, roasted hing, and black pepper.',
      bgColor: '#4A1521', // Royal Crimson Burgundy
      textColor: '#FFFFFF',
      price: kachoriPrice,
      image: kachoriProd?.image || '/images/products/hero-kachori.webp',
      icon: <Flame size={20} className="text-[#F5C27A]" strokeWidth={2} />,
      action: (
        <Link
          to="/shop?q=kachori"
          className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium font-sans bg-white text-[#4A1521] hover:bg-[#FDEBD6] transition-all transform active:scale-95 shadow-sm"
        >
          <span>Order</span>
          <ArrowRight size={11} strokeWidth={2.2} />
        </Link>
      ),
    },
    {
      title: multigrainProd?.name || 'Ashapura Spcl Multigrain Chivda',
      subtitle: 'Zero-Oil Roasted',
      description:
        multigrainProd?.description ||
        'Signature healthy crunch of roasted oats, crisp ragi flakes, bajra puffs, and golden cashews tossed with rock salt.',
      bgColor: '#1E3F2B', // Forest Emerald Green
      textColor: '#FFFFFF',
      price: multigrainPrice,
      image: multigrainProd?.image || '/images/products/hero-multigrain-chivda.webp',
      icon: <Wheat size={20} className="text-[#96E0A8]" strokeWidth={2} />,
      action: (
        <Link
          to="/shop?q=multigrain"
          className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium font-sans bg-white text-[#1E3F2B] hover:bg-[#E3F5E7] transition-all transform active:scale-95 shadow-sm"
        >
          <span>Order</span>
          <ArrowRight size={11} strokeWidth={2.2} />
        </Link>
      ),
    },
    {
      title: khattaProd?.name || 'Ashapura Spcl Khatta Meetha Mix',
      subtitle: 'Signature Blend',
      description:
        khattaProd?.description ||
        'A legendary Mumbai medley of crisp golden sev, sweet raisins, crunchy peanuts, and aromatic candied fennel.',
      bgColor: '#96591C', // Warm Spiced Mustard Amber
      textColor: '#FFFFFF',
      price: khattaPrice,
      image: khattaProd?.image || '/images/products/hero-khatta-meetha.webp',
      icon: <Sparkles size={20} className="text-[#FDE3A7]" strokeWidth={2} />,
      action: (
        <Link
          to="/shop?q=khatta"
          className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium font-sans bg-white text-[#96591C] hover:bg-[#FFF3DA] transition-all transform active:scale-95 shadow-sm"
        >
          <span>Order</span>
          <ArrowRight size={11} strokeWidth={2.2} />
        </Link>
      ),
    },
  ];

  return (
    <section id="hero-products" className="relative w-full border-b border-[#EEDBCA]">
      <ScrollSplitCard
        imageSrc="/images/ashapura-specials-front.webp"
        cards={heroCards}
        endingText="Har Bite Mein Tradition — Fresh Daily in Mira Road"
      />
    </section>
  );
};

export default HeroProductsSection;
