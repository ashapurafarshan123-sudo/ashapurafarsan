import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Wheat, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollSplitCard, ScrollSplitCardItem } from './ScrollSplitCard';

export const HeroProductsSection: React.FC = () => {
  const heroCards: ScrollSplitCardItem[] = [
    {
      title: 'Ashapura Spcl Kachori',
      subtitle: 'Crisp & Golden',
      description:
        'Flaky, golden-fried artisanal kachoris filled with spiced crushed moong dal, roasted hing, and black pepper.',
      bgColor: '#4A1521', // Royal Crimson Burgundy
      textColor: '#FFFFFF',
      price: '₹110 / 250g',
      image: '/images/products/hero-kachori.webp',
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
      title: 'Ashapura Spcl Multigrain Chivda',
      subtitle: 'Zero-Oil Roasted',
      description:
        'Signature healthy crunch of roasted oats, crisp ragi flakes, bajra puffs, and golden cashews tossed with rock salt.',
      bgColor: '#1E3F2B', // Forest Emerald Green
      textColor: '#FFFFFF',
      price: '₹120 / 250g',
      image: '/images/products/hero-multigrain-chivda.webp',
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
      title: 'Ashapura Spcl Khatta Meetha Mix',
      subtitle: 'Signature Blend',
      description:
        'A legendary Mumbai medley of crisp golden sev, sweet raisins, crunchy peanuts, and aromatic candied fennel.',
      bgColor: '#96591C', // Warm Spiced Mustard Amber
      textColor: '#FFFFFF',
      price: '₹95 / 250g',
      image: '/images/products/hero-khatta-meetha.webp',
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
