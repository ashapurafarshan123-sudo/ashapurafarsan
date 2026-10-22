export type ProductWeight = '250g' | '500g' | '1kg';

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  image: string;
  bestseller: boolean;
  prices: {
    '250g': number;
    '500g': number;
    '1kg': number;
  };
}

export interface Category {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  themeColor?: string;
  textColor?: string;
  subtextColor?: string;
  iconType?: string;
}

export interface CartItem {
  id: string; // generated as `${product.id}-${weight}`
  product: Product;
  weight: ProductWeight;
  quantity: number;
  price: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  type: 'delivery' | 'pickup';
  address?: string;
  note?: string;
}
