import { Category } from '../types';

export const ALL_CATEGORIES: Category[] = [
  {
    slug: 'namkeen',
    title: 'Namkeen',
    subtitle: 'Classic salted bites',
    image: '/images/categories/food-namkeen.png',
    themeColor: '#355963', // Slate Peacock Teal
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'namkeen',
  },
  {
    slug: 'diet-chivda',
    title: 'Diet Chivda',
    subtitle: 'Light & healthy',
    image: '/images/categories/food-traditional-farsan.png',
    themeColor: '#1E3F2B', // Forest Emerald Green
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'diet',
  },
  {
    slug: 'nali',
    title: 'Nali',
    subtitle: 'Crispy spirals',
    image: '/images/categories/food-snacks.png',
    cardImage: '/images/categories/card-nali.webp',
    themeColor: '#A87928', // Warm Mustard Ochre
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'spiral',
  },
  {
    slug: 'chakli',
    title: 'Chakli',
    subtitle: 'Rice flour crunch',
    image: '/images/categories/chakli.webp',
    themeColor: '#D8B272', // Sandstone Gold
    textColor: '#2D180C',
    subtextColor: '#5E4636',
    iconType: 'chakli',
  },
  {
    slug: 'maida',
    title: 'Maida',
    subtitle: 'Flour-based snacks',
    image: '/images/categories/food-snacks.png',
    themeColor: '#B67E70', // Dusty Terracotta Rose
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'samosa',
  },
  {
    slug: 'chana-singh',
    title: 'Chana & Singh',
    subtitle: 'Roasted & spiced',
    image: '/images/categories/food-dry-fruits.png',
    themeColor: '#4A1521', // Royal Crimson Burgundy
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'nuts',
  },
  {
    slug: 'chikki',
    title: 'Chikki',
    subtitle: 'Sweet brittle bars',
    image: '/images/categories/food-special-combos.png',
    themeColor: '#432035', // Deep Aubergine Wine
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'chikki',
  },
  {
    slug: 'poha-chivda',
    title: 'Poha Chivda',
    subtitle: 'Flattened rice mix',
    image: '/images/categories/food-traditional-farsan.png',
    themeColor: '#BA832B', // Golden Turmeric Amber
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'poha',
  },
  {
    slug: 'bhel',
    title: 'Bhel',
    subtitle: 'Mumbai street style',
    image: '/images/categories/food-namkeen.png',
    themeColor: '#581C26', // Spiced Tamarind Crimson
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'bhel',
  },
  {
    slug: 'wafers',
    title: 'Wafers',
    subtitle: 'Crispy potato slices',
    image: '/images/categories/food-traditional-farsan.png',
    themeColor: '#96632B', // Golden Crisp Bronze
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'wafer',
  },
  {
    slug: 'satwik',
    title: 'Satwik',
    subtitle: 'Khari & toast items',
    image: '/images/categories/food-beverages-others.png',
    themeColor: '#254A36', // Vedic Forest Green
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'tea',
  },
  {
    slug: 'cakes',
    title: 'Cakes',
    subtitle: 'Slice cakes & plum cakes',
    image: '/images/categories/food-desi-sweets.png',
    themeColor: '#52233E', // Festive Plum Wine
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255, 255, 255, 0.85)',
    iconType: 'cake',
  },
];

// Active categories displayed in store categories sections (excluding 'maida' and 'cakes')
export const CATEGORIES: Category[] = ALL_CATEGORIES.filter(
  (c) => c.slug !== 'maida' && c.slug !== 'cakes'
);
