import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { SectionHeading } from '../components/SectionHeading';
import { CategoryGrid } from '../components/CategoryGrid';
import { HeroProductsSection } from '../components/HeroProductsSection';
import { ProductGrid } from '../components/ProductGrid';
import { PRODUCTS } from '../data/products';
import { ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  // Get 8 bestseller products per design.md 5.6
  const bestsellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 8);

  return (
    <>
      <SEO
        title="Ashapura Farsan - Authentic Gujarati Farsan, Namkeen & Wafers in Mira Road"
        description="Authentic Gujarati farsan, namkeen, wafers, and festive sweets in Mira Road, Mumbai. Fresh every day, made in-house with traditional recipes. Shop No 15, Shantipark."
      />

      {/* Above-the-fold Hero (Combined with Header fits inside exactly 100dvh) */}
      <div className="flex flex-col h-[calc(100dvh-var(--header-height))] min-h-[calc(100dvh-var(--header-height))] max-h-[calc(100dvh-var(--header-height))] overflow-hidden">
        <Hero />
      </div>

      {/* 5. Shop by Categories Section (Redesigned per Pic 2) */}
      <section
        id="categories"
        className="relative py-12 sm:py-16 md:py-20 bg-[linear-gradient(180deg,#FBF6EE_0%,#F5ECDD_100%)] border-b border-[#EEDBCA] overflow-hidden"
      >
        {/* Subtle decorative leaf ambiance matching Pic 2 */}
        <div
          className="hidden md:block absolute -top-8 -right-8 w-60 h-60 pointer-events-none opacity-15 select-none"
          aria-hidden="true"
        >
          <img src="/images/leaf-sprig.svg" alt="" className="w-full h-full object-contain transform rotate-45" />
        </div>
        <div
          className="hidden md:block absolute -bottom-8 -left-8 w-56 h-56 pointer-events-none opacity-15 select-none"
          aria-hidden="true"
        >
          <img src="/images/leaf-sprig.svg" alt="" className="w-full h-full object-contain transform -rotate-45" />
        </div>

        <div className="container-custom relative z-10">
          {/* Eyebrow with decorative lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2.5">
            <span className="w-8 sm:w-12 h-px bg-[#C89B58]/60" />
            <span className="text-[11px] sm:text-[12px] font-semibold text-[#8A6D56] tracking-[0.25em] uppercase font-sans">
              Explore Our Range
            </span>
            <span className="w-8 sm:w-12 h-px bg-[#C89B58]/60" />
          </div>

          {/* Main Title & Desktop Action Link */}
          <div className="relative text-center mb-2">
            <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] text-brown-900 font-semibold tracking-tight leading-tight">
              Shop <span className="font-normal italic text-brown-700">by</span> <span className="text-[#B87B22] font-semibold">Categories</span>
            </h2>

            <Link
              to="/shop"
              className="hidden sm:inline-flex absolute right-0 bottom-2 items-center gap-1.5 text-[13.5px] font-medium text-brown-900 hover:text-orange-600 transition-colors group font-sans"
            >
              <span>View All Categories</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Subtitle */}
          <p className="text-center text-[13.5px] sm:text-[15px] text-[#6E5A4D] max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 font-normal font-sans">
            From crispy snacks to traditional sweets — find your favourites, all in one place.
          </p>

          {/* Mobile Action Link */}
          <div className="sm:hidden flex justify-center mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brown-900 hover:text-orange-600 transition-colors group font-sans"
            >
              <span>View All Categories</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Category Arched Cards Showcase Carousel */}
          <CategoryGrid />
        </div>
      </section>

      {/* 5.5 Hero Products Signature Creations (Scroll Split 3D Cards) */}
      <HeroProductsSection />

      {/* 6. Best Seller Section ("Our Range of Farsan") */}
      <section className="relative py-10 sm:py-14 bg-peach-100 overflow-hidden">
        {/* Faint leaf-sprig line-art on far left and far right edges (per design.md 5.6) */}
        <div
          className="hidden xl:block absolute left-2 top-10 bottom-0 w-16 pointer-events-none opacity-20 select-none"
          aria-hidden="true"
        >
          <img src="/images/leaf-sprig.svg" alt="" className="w-full h-auto object-contain" />
        </div>
        <div
          className="hidden xl:block absolute right-2 top-10 bottom-0 w-16 pointer-events-none opacity-20 select-none transform scale-x-[-1]"
          aria-hidden="true"
        >
          <img src="/images/leaf-sprig.svg" alt="" className="w-full h-auto object-contain" />
        </div>

        <div className="container-custom relative z-10">
          <SectionHeading
            eyebrow="BEST SELLER"
            titleRegular="Our Range of"
            titleItalic="Farsan"
            subtitle="Discover our most loved picks — freshly made favourites chosen by our regular customers."
            rightAction={
              <Link
                to="/shop"
                className="h-[34px] px-4 rounded-full border border-[#B5651D] text-brown-900 text-[12px] font-semibold flex items-center gap-1.5 hover:bg-white/80 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <span>View All Products</span>
                <ArrowRight size={13} strokeWidth={2} />
              </Link>
            }
          />

          {/* Product cards row (horizontal snap on mobile, 4-col on desktop) */}
          <ProductGrid products={bestsellers} horizontalOnMobile={true} />
        </div>
      </section>
    </>
  );
};
export default Home;
