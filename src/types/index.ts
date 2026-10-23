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

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line: string;
  landmark?: string;
  city: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'cod'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'cod'
  | 'whatsapp_direct'
  | 'store_pickup';

export type OrderType = 'delivery' | 'pickup';

export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name_snapshot: string;
  variant_size_snapshot: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  order_type: OrderType;
  delivery_address: string;
  order_note?: string | null;
  internal_notes?: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items?: OrderItemRecord[];
}

export interface StoreSettings {
  shipping?: {
    standard_fee: number;
    free_shipping_min: number;
    local_delivery_area: string;
  };
  contact?: {
    phone_primary: string;
    whatsapp_number: string;
    address: string;
    hours: string;
  };
  operational?: {
    is_store_open: boolean;
    accepting_orders: boolean;
    announcement: string;
  };
}

export interface AdminDashboardStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  delivered_orders: number;
  total_customers: number;
  total_products: number;
}
