import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { CategoryCard } from './CategoryCard';

export const CategoryGrid: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Exclude Maida and Cakes from the homepage "Shop by Categories" carousel
  const categories = CATEGORIES.filter(
    (category) => category.slug !== 'maida' && category.slug !== 'cakes'
  );

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 180;
      const scrollAmount = direction === 'left' ? -cardWidth * 2.5 : cardWidth * 2.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full group/carousel" role="region" aria-label="Product Categories Carousel">
      {/* Left Navigation Chevron Button (Desktop) */}
      <button
        onClick={() => handleScroll('left')}
        disabled={!canScrollLeft}
        aria-label="Scroll categories left"
        className={`hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-white/95 text-brown-900 border border-[#E4D1BC] shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
          canScrollLeft ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronLeft size={22} strokeWidth={2.2} />
      </button>

      {/* Right Navigation Chevron Button (Desktop) */}
      <button
        onClick={() => handleScroll('right')}
        disabled={!canScrollRight}
        aria-label="Scroll categories right"
        className={`hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center bg-white/95 text-brown-900 border border-[#E4D1BC] shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-orange-600 hover:text-white hover:border-orange-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-600 ${
          canScrollRight ? 'opacity-90 hover:opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'
        }`}
      >
        <ChevronRight size={22} strokeWidth={2.2} />
      </button>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth py-5 px-1 sm:px-2 scrollbar-none snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((category) => (
          <div key={category.slug} className="snap-start flex-shrink-0">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
};
