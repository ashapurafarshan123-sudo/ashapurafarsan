import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  compact?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ compact = false, className = '' }) => {
  return (
    <Link
      to="/"
      className={`flex items-center flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 rounded-md transition-opacity hover:opacity-95 ${className}`}
      aria-label="Ashapura Farsan, Namkeen & Wafers - Home"
    >
      <img
        src="/images/ashapura-navbar-logo-transparent.png"
        alt="Ashapura Farsan, Namkeen & Wafers"
        className={`${
          compact
            ? 'w-[118px] xs:w-[128px] sm:w-[145px]'
            : 'w-[126px] xs:w-[138px] sm:w-[155px] md:w-[185px] lg:w-[195px]'
        } h-auto max-h-[66px] object-contain flex-shrink-0`}
        width={800}
        height={307}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
};
