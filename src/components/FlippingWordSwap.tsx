"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Intl.Segmenter fallback for environments targeting ES2020 lib
const IntlAny =
  typeof Intl !== "undefined"
    ? (Intl as unknown as {
        Segmenter?: new (
          locales?: string | string[],
          options?: { granularity: string },
        ) => { segment: (input: string) => Iterable<{ segment: string }> };
      })
    : null;

const graphemeSegmenter =
  IntlAny && typeof IntlAny.Segmenter === "function"
    ? new IntlAny.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentCharacters(text: string): string[] {
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export interface FlippingLine {
  word1: string;
  word2: string;
  fromClassName?: string;
  fromStyle?: CSSProperties;
  toClassName?: string;
  toStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
}

export interface FlippingWordSwapProps {
  /** The word or short phrase shown at rest. */
  word1?: string;
  /** The word or short phrase revealed on interaction. */
  word2?: string;
  /** Paired lines for multi-line swaps */
  lines?: FlippingLine[];
  /** Duration of each character flip in milliseconds. */
  duration?: number;
  /** Delay between neighboring character flips in milliseconds. */
  stagger?: number;
  /** Additional classes applied to the interactive container. */
  className?: string;
  /** Additional classes applied only to the revealed word. */
  toClassName?: string;
  /** Inline styles applied to the interactive container. */
  style?: CSSProperties;
  /** Inline styles applied only to the revealed word. */
  toStyle?: CSSProperties;
  /** Optional interval (in ms) to automatically toggle the flip back and forth. Set to 0 to disable. */
  autoPlayInterval?: number;
}

export function FlippingWordSwap({
  word1,
  word2,
  lines,
  duration = 320,
  stagger = 18,
  className,
  toClassName,
  style,
  toStyle,
  autoPlayInterval = 4500,
}: FlippingWordSwapProps) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const swappedRef = useRef(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const isHoveredRef = useRef(false);

  // Normalize into lines
  const resolvedLines: FlippingLine[] =
    lines && lines.length > 0
      ? lines
      : [{ word1: word1 || "", word2: word2 || "", toClassName, toStyle }];

  const fullLabel1 = resolvedLines.map((l) => l.word1).join(" ");
  const fullLabel2 = resolvedLines.map((l) => l.word2).join(" ");

  const updateSwap = useCallback((next: boolean) => {
    swappedRef.current = next;
    setIsSwapped(next);

    if (next) {
      timelineRef.current?.play();
    } else {
      timelineRef.current?.reverse();
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const resolvedDuration = prefersReducedMotion
      ? 0
      : Math.max(180, duration) / 1000;
    const resolvedStagger = prefersReducedMotion
      ? 0
      : Math.max(0, stagger) / 1000;

    const context = gsap.context(() => {
      const lineElements =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-flip-line]");
      if (!lineElements || lineElements.length === 0) return;

      const timeline = gsap.timeline({ paused: true });

      lineElements.forEach((lineEl, lineIndex) => {
        const firstWord = lineEl.querySelectorAll<HTMLElement>(
          '[data-flip-word="first"]',
        );
        const secondWord = lineEl.querySelectorAll<HTMLElement>(
          '[data-flip-word="second"]',
        );

        gsap.set(firstWord, {
          rotationX: 0,
          opacity: 1,
          transformOrigin: "center top",
        });
        gsap.set(secondWord, {
          rotationX: -82,
          opacity: 0,
          transformOrigin: "center bottom",
        });

        // Lines flip together with an elegant slight offset
        const lineOffset = lineIndex * 0.08;

        timeline
          .to(
            firstWord,
            {
              rotationX: 82,
              opacity: 0,
              duration: resolvedDuration,
              stagger: resolvedStagger,
              ease: "power2.in",
            },
            lineOffset,
          )
          .to(
            secondWord,
            {
              rotationX: 0,
              opacity: 1,
              duration: resolvedDuration,
              stagger: resolvedStagger,
              ease: "power2.out",
            },
            lineOffset + resolvedDuration * 0.55,
          );
      });

      if (swappedRef.current) timeline.progress(1);
      timelineRef.current = timeline;
    }, containerRef);

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, [duration, stagger, resolvedLines]);

  // Autoplay loop (pauses while hovered/focused)
  useEffect(() => {
    if (!autoPlayInterval || autoPlayInterval <= 0) return;

    const timer = setInterval(() => {
      if (isHoveredRef.current) return;
      updateSwap(!swappedRef.current);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, updateSwap]);

  const renderCharacters = (text: string, layer: "first" | "second") =>
    segmentCharacters(text).map((character, index) => (
      <span
        key={`${layer}-${index}-${character}`}
        data-flip-word={layer}
        className="inline-block whitespace-pre [backface-visibility:hidden] [will-change:transform,opacity]"
      >
        {character === " " ? "\u00a0" : character}
      </span>
    ));

  return (
    <button
      ref={containerRef}
      type="button"
      className={cn(
        "relative flex flex-col items-start cursor-pointer select-none border-0 bg-transparent p-0 font-[inherit] leading-[inherit] tracking-[inherit] text-[inherit] text-left",
        "rounded-[0.08em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/30 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={isSwapped ? fullLabel2 : fullLabel1}
      aria-pressed={isSwapped}
      style={style}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        updateSwap(true);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        updateSwap(false);
      }}
      onPointerUp={(event) => {
        if (event.pointerType !== "mouse") updateSwap(!swappedRef.current);
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) {
          isHoveredRef.current = true;
          updateSwap(true);
        }
      }}
      onBlur={() => {
        isHoveredRef.current = false;
        updateSwap(false);
      }}
    >
      {resolvedLines.map((line, lineIdx) => (
        <span
          key={`line-${lineIdx}`}
          data-flip-line={lineIdx}
          className={cn(
            "relative inline-grid overflow-hidden [perspective:800px] w-full text-left",
            line.className,
          )}
          style={line.style}
        >
          <span
            className={cn(
              "col-start-1 row-start-1 inline-flex items-baseline justify-start whitespace-pre",
              line.fromClassName,
            )}
            aria-hidden="true"
            style={line.fromStyle}
          >
            {renderCharacters(line.word1, "first")}
          </span>
          <span
            className={cn(
              "col-start-1 row-start-1 inline-flex items-baseline justify-start whitespace-pre",
              line.toClassName || toClassName,
            )}
            aria-hidden="true"
            style={line.toStyle || toStyle}
          >
            {renderCharacters(line.word2, "second")}
          </span>
        </span>
      ))}
    </button>
  );
}
