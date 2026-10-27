export type ProductWeight = '250g' | '500g' | '750g' | '1kg';

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  image: string;
  bestseller: boolean;
  isActive?: boolean;
  prices: {
    '250g': number;
    '500g': number;
    '750g'?: number;
    '1kg': number;
  };
}

export interface Category {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  cardImage?: string;
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

export interface GlobalDiscountConfig {
  is_active: boolean;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  start_date: string | null;
  end_date: string | null;
  banner_text?: string;
}

export interface StoreSettings {
  shipping?: {
    standard_fee: number;
    free_shipping_min: number;
    local_delivery_area: string;
  };
  contact?: {
    phone_primary: string;
    phone_secondary?: string;
    whatsapp_number: string;
    address: string;
    hours: string;
    google_maps_url?: string;
  };
  operational?: {
    is_store_open: boolean;
    accepting_orders: boolean;
    announcement: string;
  };
  global_discount?: GlobalDiscountConfig;
  currency?: string;
}

export interface BestSellingProduct {
  product_name: string;
  product_id: string;
  units_sold: number;
  total_revenue: number;
}

export interface DailyTrend {
  date: string;
  order_count: number;
  daily_revenue: number;
}

export interface AdminAdvancedAnalytics {
  gross_sales: number;
  net_sales: number;
  discounts_granted: number;
  refunds: number;
  total_orders: number;
  website_orders_count: number;
  website_sales: number;
  whatsapp_orders_count: number;
  whatsapp_confirmed_count: number;
  whatsapp_sales: number;
  pending_orders_count: number;
  today_sales: number;
  this_month_sales: number;
  in_stock_products_count: number;
  out_of_stock_products_count: number;
  average_order_value: number;
  best_selling_products: BestSellingProduct[];
  daily_trends: DailyTrend[];
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
