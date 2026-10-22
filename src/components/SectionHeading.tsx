import React from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  titleRegular: string;
  titleItalic: string;
  subtitle: string;
  rightAction?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  titleRegular,
  titleItalic,
  subtitle,
  rightAction,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 md:mb-6">
      <div className="text-left">
        {/* Eyebrow */}
        <span className="block text-[11px] font-semibold text-orange-600 uppercase tracking-[0.22em] mb-1.5 font-sans">
          {eyebrow}
        </span>

        {/* H2 with italic orange accent word */}
        <h2 className="font-serif font-semibold text-brown-900 text-2xl sm:text-3xl md:text-[34px] leading-[1.15] tracking-normal">
          {titleRegular} <span className="italic text-orange-600">{titleItalic}</span>
        </h2>

        {/* Sub-text */}
        <p className="text-brown-700 text-[13px] leading-[1.5] mt-1.5 max-w-xl">
          {subtitle}
        </p>
      </div>

      {rightAction && (
        <div className="flex-shrink-0 self-start sm:self-end">
          {rightAction}
        </div>
      )}
    </div>
  );
};
