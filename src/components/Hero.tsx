import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { TrustRow } from './TrustRow';
import { motion } from 'framer-motion';
import { FlippingWordSwap } from './FlippingWordSwap';

export const Hero: React.FC = () => {
  return (
    <section className="flex-1 min-h-0 relative overflow-hidden bg-[url('/images/hero-banner.jpg')] bg-cover bg-[position:63%_center] md:bg-center flex flex-col justify-center">
      {/* Contrast overlay: strong at top for text readability, gentle feathered vignette on desktop */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/50 via-50% to-black/75 md:bg-gradient-to-r md:from-black/85 md:via-black/40 md:to-transparent pointer-events-none select-none z-0"
        aria-hidden="true"
      />

      {/* Left / Center Content Container */}
      <div className="container-custom w-full relative z-10 py-4 sm:py-5 md:py-6 md:my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-[460px] md:max-w-[540px] mx-auto md:mx-0 flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Eyebrow */}
          <span className="block text-[11px] sm:text-[12px] font-semibold text-[#DCA052] uppercase tracking-[0.24em] mb-2 sm:mb-2.5 font-sans text-center md:text-left">
            TRADITIONAL GUJARATI FARSAN
          </span>

          {/* H1 Title with FlippingWordSwap Animation */}
          <h1
            className="font-serif font-semibold text-white text-[28px] xs:text-[32px] sm:text-4xl md:text-[42px] lg:text-[46px] leading-[1.14] sm:leading-[1.12] md:leading-[1.12] lg:leading-[1.12] tracking-normal mb-4 sm:mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex justify-center md:justify-start w-full"
            style={{ lineHeight: 1.14, letterSpacing: 0 }}
          >
            <FlippingWordSwap
              lines={[
                { word1: "Authentic Taste", word2: "Crafted with Tradition," },
                { 
                  word1: "of Gujarat", 
                  word2: "Served with Love.",
                  fromClassName: "text-[#F1B86A] italic",
                  toClassName: "text-[#F1B86A] italic",
                },
              ]}
              duration={320}
              stagger={18}
              autoPlayInterval={4500}
            />
          </h1>

          {/* Buttons: Shop Now & Explore Our Range */}
          <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3.5 mb-4 sm:mb-5 w-full">
            <Link
              to="/shop"
              className="h-[42px] sm:h-[40px] px-4 xs:px-5 sm:px-6 bg-[#C67D1E] hover:bg-[#B36E17] text-white text-[12px] xs:text-[12.5px] sm:text-[13px] font-semibold rounded-full shadow-[0_4px_14px_rgba(198,125,30,0.35)] flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-[#C67D1E] focus:ring-offset-2 flex-1 max-w-[165px] sm:max-w-none sm:flex-initial whitespace-nowrap"
            >
              <ShoppingCart size={15} strokeWidth={2} />
              <span>Shop Now</span>
            </Link>

            <a
              href="#specialties"
              className="h-[42px] sm:h-[40px] px-3.5 xs:px-4 sm:px-5 bg-black/25 hover:bg-black/40 text-white text-[12px] xs:text-[12.5px] sm:text-[13px] font-medium rounded-full border border-white/40 hover:border-white/70 backdrop-blur-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/80 flex-1 max-w-[165px] sm:max-w-none sm:flex-initial whitespace-nowrap"
            >
              <span>Explore Our Range</span>
              <ArrowRight size={13} strokeWidth={2} />
            </a>
          </div>

          {/* Trust Row */}
          <TrustRow />
        </motion.div>
      </div>
    </section>
  );
};
