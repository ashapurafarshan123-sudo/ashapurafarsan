import React, { useState } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  titleName?: string;
  className?: string;
  haloClassName?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  titleName,
  className = '',
  haloClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Log missing image for developer review
      if (typeof window !== 'undefined') {
        const missingList = (window as unknown as { __missingAssets?: Set<string> }).__missingAssets || new Set<string>();
        missingList.add(src);
        (window as unknown as { __missingAssets?: Set<string> }).__missingAssets = missingList;
        console.warn(`[Ashapura Assets] Image missing: ${src}`);
      }
    }
  };

  if (hasError || !src) {
    const displayName = titleName || alt || 'Farsan';
    return (
      <div
        className={`flex flex-col items-center justify-center p-3 text-center bg-peach-halo rounded-full shadow-inner select-none transition-transform duration-200 ${haloClassName || className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-serif font-semibold text-brown-900 text-xs sm:text-sm tracking-wide leading-tight px-2 line-clamp-2">
          {displayName}
        </span>
        <span className="text-[10px] text-orange-600 font-sans tracking-widest uppercase mt-0.5">
          Ashapura
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
