/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          900: 'var(--brown-900)',
          700: 'var(--brown-700)',
          500: 'var(--brown-500)',
        },
        cream: {
          50: 'var(--cream-50)',
          100: 'var(--cream-100)',
        },
        peach: {
          100: 'var(--peach-100)',
          200: 'var(--peach-200)',
          halo: 'var(--peach-halo)',
        },
        orange: {
          500: 'var(--orange-500)',
          600: 'var(--orange-600)',
          700: 'var(--orange-700)',
        },
        amber: {
          400: 'var(--amber-400)',
          600: 'var(--amber-600)',
        },
        line: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
        },
        badge: {
          red: 'var(--badge-red)',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: 'var(--r-card)',
        pill: 'var(--r-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        cta: 'var(--shadow-cta)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
      padding: {
        gutter: 'var(--gutter)',
      },
    },
  },
  plugins: [],
};
