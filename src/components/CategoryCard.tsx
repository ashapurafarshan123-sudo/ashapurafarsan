import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const isDark = category.textColor !== '#2D180C';
  const themeColor = category.themeColor || '#4A1521';
  const textColor = category.textColor || '#FFFFFF';
  const subtextColor = category.subtextColor || 'rgba(255, 255, 255, 0.82)';
  const strokeColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(45, 24, 12, 0.28)';
  const innerStroke = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(45, 24, 12, 0.12)';
  const iconStroke = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(45, 24, 12, 0.45)';
  const arrowColor = isDark ? '#FFFFFF' : '#2D180C';
  const btnBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(45, 24, 12, 0.06)';

  // Distinct icon paths matching Indian snacks & farsan
  const renderIcon = (type?: string) => {
    switch (type) {
      case 'diet':
        // Leaf / Grain sprout
        return (
          <path
            d="M 72.5 195 C 66 198, 64 205, 67 211 C 72.5 212, 79 209, 81 201 C 81 197, 76 195, 72.5 195 Z M 72.5 198 L 72.5 213"
            stroke={arrowColor}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'chakli':
      case 'spiral':
        // Spiral snack
        return (
          <path
            d="M 72.5 204 A 2.5 2.5 0 0 1 75 206.5 A 5 5 0 0 1 70 209 A 7.5 7.5 0 0 1 65 201.5 A 10 10 0 0 1 77.5 196"
            stroke={arrowColor}
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'samosa':
        // Crisp triangle
        return (
          <path
            d="M 72.5 196 L 81.5 211 L 63.5 211 Z"
            stroke={arrowColor}
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'nuts':
        // Peanut / almond nuts
        return (
          <g stroke={arrowColor} strokeWidth="1.2" fill="none">
            <ellipse cx="69" cy="204" rx="4.5" ry="6.5" transform="rotate(-20 69 204)" />
            <ellipse cx="76" cy="204" rx="4.5" ry="6.5" transform="rotate(20 76 204)" />
          </g>
        );
      case 'chikki':
        // Gift / festive treat box
        return (
          <g stroke={arrowColor} strokeWidth="1.2" fill="none">
            <rect x="65" y="199" width="15" height="11" rx="1.5" />
            <path d="M 72.5 199 L 72.5 210 M 65 204.5 L 80 204.5" />
          </g>
        );
      case 'tea':
        // Kulhad / Chai cup
        return (
          <g stroke={arrowColor} strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 66 201 L 68 211 C 68 212, 77 212, 77 211 L 79 201 Z" />
            <path d="M 69 196 C 69 198, 71 198, 71 200 M 74 196 C 74 198, 76 198, 76 200" />
          </g>
        );
      case 'cake':
        // Slice of dessert / cake
        return (
          <path
            d="M 65 208 L 72.5 197 L 80 208 Z M 65 208 L 80 208"
            stroke={arrowColor}
            strokeWidth="1.2"
            fill="none"
            strokeLinejoin="round"
          />
        );
      case 'wafer':
        // Wavy potato chip
        return (
          <path
            d="M 65 204 C 68 200, 71 208, 75 202 C 78 198, 80 206, 81 204"
            stroke={arrowColor}
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        );
      case 'bhel':
      case 'poha':
      case 'namkeen':
      default:
        // Indian snack bowl
        return (
          <g stroke={arrowColor} strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M 65 203 C 65 211, 80 211, 80 203 Z" />
            <path d="M 68 198 C 69 200, 71 200, 71 202 M 74 198 C 75 200, 77 200, 77 202" />
          </g>
        );
    }
  };

  if (category.cardImage) {
    const outerClipId = `outer-jharokha-${category.slug}`;
    return (
      <Link
        to={`/shop?category=${category.slug}`}
        className="group relative flex-shrink-0 w-[146px] sm:w-[158px] md:w-[164px] h-[345px] sm:h-[365px] md:h-[375px] block select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-4 rounded-[28px] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
        aria-label={`Browse ${category.title} category`}
      >
        <div className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(70,35,15,0.16)] group-hover:drop-shadow-[0_18px_30px_rgba(70,35,15,0.24)] transition-all duration-300">
          <svg
            viewBox="0 0 145 340"
            className="w-full h-full block overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={outerClipId}>
                <path
                  d="
                    M 72.5 2
                    C 78 7, 85 13, 93 17
                    C 107 23, 118 33, 122 41
                    C 127 45, 137 49, 142 56
                    C 144 60, 145 65, 145 70
                    L 145 282
                    C 145 295, 137 304, 127 308
                    C 122 314, 113 322, 97 329
                    C 86 334, 77 338, 72.5 338
                    C 68 338, 59 334, 48 329
                    C 32 322, 23 314, 18 308
                    C 8 304, 0 295, 0 282
                    L 0 70
                    C 0 65, 1 60, 3 56
                    C 8 49, 18 45, 23 41
                    C 27 33, 38 23, 52 17
                    C 60 13, 67 7, 72.5 2
                    Z
                  "
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${outerClipId})`}>
              <image
                href={category.cardImage}
                x="0"
                y="0"
                width="145"
                height="340"
                preserveAspectRatio="none"
                className="transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </g>
            <path
              d="
                M 72.5 2
                C 78 7, 85 13, 93 17
                C 107 23, 118 33, 122 41
                C 127 45, 137 49, 142 56
                C 144 60, 145 65, 145 70
                L 145 282
                C 145 295, 137 304, 127 308
                C 122 314, 113 322, 97 329
                C 86 334, 77 338, 72.5 338
                C 68 338, 59 334, 48 329
                C 32 322, 23 314, 18 308
                C 8 304, 0 295, 0 282
                L 0 70
                C 0 65, 1 60, 3 56
                C 8 49, 18 45, 23 41
                C 27 33, 38 23, 52 17
                C 60 13, 67 7, 72.5 2
                Z
              "
              stroke={strokeColor}
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </div>
      </Link>
    );
  }

  const clipId = `food-arch-${category.slug}`;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative flex-shrink-0 w-[146px] sm:w-[158px] md:w-[164px] h-[345px] sm:h-[365px] md:h-[375px] block select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-4 rounded-[28px] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
      aria-label={`Browse ${category.title} category`}
    >
      <div className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(70,35,15,0.16)] group-hover:drop-shadow-[0_18px_30px_rgba(70,35,15,0.24)] transition-all duration-300">
        <svg
          viewBox="0 0 145 340"
          className="w-full h-full block overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top Arched ClipPath for Food Photography */}
            <clipPath id={clipId}>
              <path
                d="
                  M 72.5 2
                  C 78 7, 85 13, 93 17
                  C 107 23, 118 33, 122 41
                  C 127 45, 137 49, 142 56
                  C 144 60, 145 65, 145 70
                  L 145 168
                  C 115 178, 85 182, 72.5 182
                  C 60 182, 30 178, 0 168
                  L 0 70
                  C 0 65, 1 60, 3 56
                  C 8 49, 18 45, 23 41
                  C 27 33, 38 23, 52 17
                  C 60 13, 67 7, 72.5 2
                  Z
                "
              />
            </clipPath>

            {/* Subtle Mandala Texture Pattern */}
            <pattern
              id={`mandala-pat-${category.slug}`}
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M14 0 C17 6, 22 11, 28 14 C22 17, 17 22, 14 28 C11 22, 6 17, 0 14 C6 11, 11 6, 14 0 Z"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
                strokeWidth="0.7"
              />
            </pattern>
          </defs>

          {/* Top Food Image in Arched Frame with Zoom on Hover */}
          <g clipPath={`url(#${clipId})`}>
            <image
              href={category.image}
              x="-6"
              y="-6"
              width="157"
              height="188"
              preserveAspectRatio="xMidYMid slice"
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </g>

          {/* Lower Colored Body with Jharokha Base Scallop */}
          <path
            d="
              M 0 168
              C 30 178, 60 182, 72.5 182
              C 85 182, 115 178, 145 168
              L 145 282
              C 145 295, 137 304, 127 308
              C 122 314, 113 322, 97 329
              C 86 334, 77 338, 72.5 338
              C 68 338, 59 334, 48 329
              C 32 322, 23 314, 18 308
              C 8 304, 0 295, 0 282
              Z
            "
            fill={themeColor}
          />

          {/* Subtle Damask/Mandala Texture Overlay */}
          <path
            d="
              M 0 168
              C 30 178, 60 182, 72.5 182
              C 85 182, 115 178, 145 168
              L 145 282
              C 145 295, 137 304, 127 308
              C 122 314, 113 322, 97 329
              C 86 334, 77 338, 72.5 338
              C 68 338, 59 334, 48 329
              C 32 322, 23 314, 18 308
              C 8 304, 0 295, 0 282
              Z
            "
            fill={`url(#mandala-pat-${category.slug})`}
          />

          {/* Outer Jharokha Architectural Frame */}
          <path
            d="
              M 72.5 2
              C 78 7, 85 13, 93 17
              C 107 23, 118 33, 122 41
              C 127 45, 137 49, 142 56
              C 144 60, 145 65, 145 70
              L 145 282
              C 145 295, 137 304, 127 308
              C 122 314, 113 322, 97 329
              C 86 334, 77 338, 72.5 338
              C 68 338, 59 334, 48 329
              C 32 322, 23 314, 18 308
              C 8 304, 0 295, 0 282
              L 0 70
              C 0 65, 1 60, 3 56
              C 8 49, 18 45, 23 41
              C 27 33, 38 23, 52 17
              C 60 13, 67 7, 72.5 2
              Z
            "
            stroke={strokeColor}
            strokeWidth="1.2"
            fill="none"
          />

          {/* Inner Decorative Hairline Border */}
          <path
            d="
              M 72.5 7
              C 77 11, 83 17, 90 20
              C 103 26, 113 35, 116 42
              C 120 45, 130 49, 135 55
              C 137 59, 138 63, 138 68
              L 138 278
              C 138 288, 131 296, 123 300
              C 118 305, 110 312, 95 319
              C 85 323, 77 326, 72.5 326
              C 68 326, 60 323, 50 319
              C 35 312, 27 305, 22 300
              C 14 296, 7 288, 7 278
              L 7 68
              C 7 63, 8 59, 10 55
              C 15 49, 25 45, 29 42
              C 32 35, 42 26, 55 20
              C 62 17, 68 11, 72.5 7
              Z
            "
            stroke={innerStroke}
            strokeWidth="0.8"
            fill="none"
          />

          {/* Corner Flourish / Filigree Accents */}
          <path
            d="M 12 290 C 18 296, 22 302, 28 308"
            stroke={innerStroke}
            strokeWidth="0.8"
            fill="none"
          />
          <path
            d="M 133 290 C 127 296, 123 302, 117 308"
            stroke={innerStroke}
            strokeWidth="0.8"
            fill="none"
          />

          {/* Circular Icon Container */}
          <circle
            cx="72.5"
            cy="204"
            r="14"
            stroke={iconStroke}
            strokeWidth="1"
            fill="none"
          />
          {renderIcon(category.iconType)}

          {/* Category Title in Cormorant Garamond */}
          <text
            x="72.5"
            y="235"
            textAnchor="middle"
            fill={textColor}
            className="cat-title"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            fontSize="16"
            fontWeight="600"
            letterSpacing="0.2"
          >
            {category.title}
          </text>

          {/* Category Subtitle in DM Sans */}
          <text
            x="72.5"
            y="253"
            textAnchor="middle"
            fill={subtextColor}
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            fontSize="8.8"
            fontWeight="400"
          >
            {category.subtitle}
          </text>

          {/* Interactive Arrow Button */}
          <g className="transition-transform duration-200 group-hover:scale-110" style={{ transformOrigin: '72.5px 296px' }}>
            <circle
              cx="72.5"
              cy="296"
              r="12"
              stroke={iconStroke}
              strokeWidth="1.1"
              fill={btnBg}
              className="transition-colors duration-200 group-hover:fill-white/20"
            />
            <path
              d="M 69.5 296 L 75.5 296 M 73 293.5 L 75.5 296 L 73 298.5"
              stroke={arrowColor}
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    </Link>
  );
};
