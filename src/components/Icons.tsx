import React from 'react';

// Custom WhatsApp SVG glyph matching brand specifications
export const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-5 h-5",
  size = 20,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.44 19.65L5.27 16.62L5.07 16.31C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.5 3.68 12.04 3.68C14.24 3.68 16.31 4.54 17.86 6.09C19.42 7.65 20.27 9.72 20.27 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.41C16.31 14.29 15.1 13.69 14.88 13.61C14.65 13.53 14.48 13.49 14.32 13.73C14.15 13.98 13.68 14.53 13.54 14.69C13.39 14.86 13.25 14.88 13 14.76C12.75 14.63 11.96 14.38 11.02 13.54C10.29 12.89 9.8 12.09 9.66 11.84C9.51 11.59 9.64 11.46 9.77 11.34C9.88 11.23 10.02 11.05 10.14 10.91C10.26 10.77 10.3 10.66 10.39 10.5C10.47 10.33 10.43 10.19 10.37 10.07C10.31 9.95 9.81 8.74 9.61 8.23C9.41 7.74 9.2 7.81 9.05 7.8C8.91 7.79 8.74 7.79 8.58 7.79C8.41 7.79 8.14 7.85 7.91 8.1C7.69 8.35 7.05 8.95 7.05 10.16C7.05 11.38 7.94 12.55 8.06 12.71C8.18 12.88 9.8 15.38 12.28 16.45C12.87 16.71 13.33 16.86 13.69 16.97C14.28 17.16 14.82 17.13 15.24 17.07C15.72 17 16.71 16.47 16.91 15.89C17.12 15.32 17.12 14.83 17.06 14.72C17 14.62 16.81 14.54 16.56 14.41Z" />
    </svg>
  );
};

// Rupee currency glyph with exact line-art styling
export const RupeeIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-4 h-4",
  size = 16,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="M6 13l8.5 8" />
      <path d="M6 13h3a4 4 0 0 0 0-8" />
    </svg>
  );
};
