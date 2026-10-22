"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface ScrollSplitCardItem {
  title: string;
  subtitle?: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  price?: string;
  image?: string;
}

export interface ScrollSplitCardProps {
  className?: string;
  imageSrc: string;
  cards: ScrollSplitCardItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
  startingText?: string;
  endingText?: string;
}

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
  containerRef: externalContainerRef,
  startingText = "SCROLL TO DISCOVER OUR SIGNATURE FAVOURITES",
  endingText = "Handcrafted with Pure Devotion & Time-Honored Recipes",
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1 to 2: Separation (0 to 0.4), then Stage 2 to 3: Overlap closer (0.4 to 0.8)
  // Use percentage offsets so it scales smoothly on both small phones and wide desktops
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], ["0%", "-14%", "-7%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], ["0%", "14%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.92]);

  // Stage 2 to 3: Flip (0.4 to 0.8)
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  // Due to 180deg Y flip, positive Z becomes visual counter-clockwise, negative Z becomes visual clockwise
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 4]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -4]);

  // Dynamic borders/radii so it looks like ONE flat image initially
  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["20px 0px 0px 20px", "20px 20px 20px 20px"]);
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "20px 20px 20px 20px"]);
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 20px 20px 0px", "20px 20px 20px 20px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.25]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.35]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(58, 27, 16, ${shadowOpacity})`;

  // Cards move up in the last viewport
  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -180]);

  // Text appearance at the end in the sticky viewport
  const textOpacity = useTransform(scrollYProgress, [0.82, 0.96], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.82, 0.96], [30, 0]);

  // Scroll instruction visible throughout the entire split & flip interaction, then gracefully yields to the conclusion quote
  const scrollInstructionOpacity = useTransform(scrollYProgress, [0.74, 0.82], [1, 0]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[400vh] w-full bg-[linear-gradient(180deg,#F5ECDD_0%,#FBF6EE_40%,#F5ECDD_100%)]", className)}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1400px]">
        {/* Subtle decorative background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] select-none"
          style={{
            backgroundImage: `radial-gradient(#3A1B10 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* 3D Split Cards Deck */}
        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="flex h-[360px] sm:h-[420px] md:h-[460px] w-full max-w-5xl px-3 sm:px-6 relative items-center justify-center"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1 min-w-0"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i, // Ensures Left is under Middle, and Right is above Middle
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side: Original Image Split */}
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                style={{
                  zIndex: 2, // Ensure front stays above initially
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={{
                    left: `${-100 * i}%`,
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                {/* Subtle vignette border on front */}
                <div className="absolute inset-0 border border-white/20 pointer-events-none rounded-[inherit]" />
              </motion.div>

              {/* Back Side: New Content Card */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden flex flex-col justify-between p-3 sm:p-6 md:p-8 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] will-change-transform",
                  "border border-white/15 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-24px_48px_rgba(0,0,0,0.3)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1, // Ensure back is behind before flip
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                {/* Grainy Noise Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay"
                  style={{
                    backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0)`,
                    backgroundSize: "4px 4px",
                  }}
                />

                {/* Top: Icon & Category Tag */}
                <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/25 shadow-sm flex-shrink-0 [&_svg]:w-4 [&_svg]:h-4 sm:[&_svg]:w-5 sm:[&_svg]:h-5">
                    {card.icon}
                  </div>
                  {card.subtitle && (
                    <span className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-xs text-white/90 truncate max-w-[62%] sm:max-w-none">
                      {card.subtitle}
                    </span>
                  )}
                </div>

                {/* Middle: Product Image (if provided) & Title/Description */}
                {card.image ? (
                  <div className="relative z-10 my-auto py-1 flex flex-col items-center text-center">
                    <div className="relative mb-1 sm:mb-2">
                      {/* Ambient warm radial halo glow */}
                      <div className="absolute inset-0 bg-[#F5A623]/20 rounded-full blur-xl transform scale-125 pointer-events-none" />
                      <img
                        src={card.image}
                        alt={card.title}
                        className="relative z-10 h-20 sm:h-28 md:h-32 w-auto max-w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-sm sm:text-xl md:text-2xl font-semibold leading-snug sm:leading-tight tracking-tight mb-1 sm:mb-2 text-center">
                      {card.title}
                    </h3>
                    <p className="font-sans text-[10px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed opacity-90 line-clamp-2 sm:line-clamp-3 text-center">
                      {card.description}
                    </p>
                  </div>
                ) : (
                  <div className="relative z-10 my-auto py-1 sm:py-2">
                    <h3 className="font-serif text-[13px] sm:text-2xl md:text-3xl font-semibold leading-snug sm:leading-tight tracking-tight mb-1 sm:mb-3">
                      {card.title}
                    </h3>
                    <p className="font-sans text-[10.5px] sm:text-xs md:text-sm leading-snug sm:leading-relaxed opacity-90 line-clamp-3 sm:line-clamp-4">
                      {card.description}
                    </p>
                  </div>
                )}

                {/* Bottom: Price & Action */}
                <div className="relative z-10 pt-1.5 sm:pt-2 border-t border-white/20 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 sm:gap-2">
                  {card.price && (
                    <div className="flex xs:flex-col items-baseline xs:items-start gap-1 xs:gap-0">
                      <span className="hidden xs:inline-block text-[8.5px] sm:text-[9.5px] uppercase tracking-wider text-white/70 font-sans">Price</span>
                      <span className="text-xs sm:text-base font-semibold font-sans">{card.price}</span>
                    </div>
                  )}
                  {card.action && <div className="w-full xs:w-auto xs:ml-auto">{card.action}</div>}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text fixed in the sticky viewport */}
        <motion.div
          className="absolute bottom-20 sm:bottom-[15%] left-0 right-0 text-center px-4 z-20 pointer-events-none"
          style={{
            opacity: textOpacity,
            y: textY,
          }}
        >
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-brown-900 italic">
            "{endingText}"
          </p>
          <span className="block mt-2 font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#CC5A0E] uppercase">
            Ashapura Farsan • Mira Road
          </span>
        </motion.div>

        {/* Scroll Instruction — visible throughout the animation */}
        <motion.div
          style={{ opacity: scrollInstructionOpacity }}
          className="absolute bottom-16 sm:bottom-7 left-0 right-0 z-30 flex items-center justify-center px-4 pointer-events-none"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3.5 max-w-full">
            <span className="w-6 sm:w-14 h-px bg-[#C89B58]/60 shrink-0" />
            <div className="flex items-center gap-1.5 sm:gap-2 text-center">
              <span className="text-[10px] sm:text-[11.5px] md:text-[12px] font-semibold text-[#6E4F39] tracking-[0.18em] sm:tracking-[0.24em] uppercase font-sans whitespace-normal">
                {startingText}
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex text-[#CC5A0E] shrink-0"
              >
                <ChevronDown size={14} className="sm:w-4 sm:h-4 stroke-[2.5]" />
              </motion.span>
            </div>
            <span className="w-6 sm:w-14 h-px bg-[#C89B58]/60 shrink-0" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollSplitCard;
