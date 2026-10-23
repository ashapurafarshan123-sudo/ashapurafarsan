import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { OrderRecord, UserAddress } from '../types';

export interface CreateOrderParams {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  order_type: 'delivery' | 'pickup';
  delivery_address: string;
  order_note?: string;
  items: Array<{
    product_id: string;
    size_label: string;
    quantity: number;
    // Client-side snapshots for offline fallback
    product_name?: string;
    unit_price?: number;
  }>;
  payment_method?: 'cod' | 'whatsapp_direct' | 'store_pickup';
}

export interface CreateOrderResult {
  success: boolean;
  order_id: string;
  order_number: string;
  total_amount: number;
  subtotal: number;
  shipping_amount: number;
  error?: string;
}

export const orderService = {
  /**
   * Secure Order Creation
   * Executes atomic create_order_secure PostgreSQL function in Supabase
   */
  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    if (!isSupabaseConfigured()) {
      // Offline / Local Demo fallback
      const generatedOrderNum = `AF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const subtotal = params.items.reduce((acc, item) => acc + (item.unit_price || 0) * item.quantity, 0);
      const total = subtotal;

      const demoOrder: OrderRecord = {
        id: crypto.randomUUID ? crypto.randomUUID() : `demo-${Date.now()}`,
        order_number: generatedOrderNum,
        customer_name: params.customer_name,
        customer_phone: params.customer_phone,
        customer_email: params.customer_email,
        order_type: params.order_type,
        delivery_address: params.delivery_address,
        order_note: params.order_note,
        status: 'pending',
        payment_status: 'pending',
        payment_method: params.payment_method || 'cod',
        subtotal,
        shipping_amount: 0,
        discount_amount: 0,
        total_amount: total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_items: params.items.map((it, idx) => ({
          id: `item-${idx}`,
          order_id: 'demo',
          product_name_snapshot: it.product_name || it.product_id,
          variant_size_snapshot: it.size_label,
          unit_price: it.unit_price || 0,
          quantity: it.quantity,
          line_total: (it.unit_price || 0) * it.quantity,
          created_at: new Date().toISOString(),
        })),
      };

      // Store in localStorage for guest/demo persistence
      try {
        const existing = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
        localStorage.setItem('ashapura_demo_orders', JSON.stringify([demoOrder, ...existing]));
      } catch (e) {
        console.warn('localStorage order cache error:', e);
      }

      return {
        success: true,
        order_id: demoOrder.id,
        order_number: demoOrder.order_number,
        total_amount: total,
        subtotal,
        shipping_amount: 0,
      };
    }

    try {
      const { data, error } = await supabase.rpc('create_order_secure', {
        p_customer_name: params.customer_name,
        p_customer_phone: params.customer_phone,
        p_customer_email: params.customer_email || null,
        p_order_type: params.order_type,
        p_delivery_address: params.delivery_address,
        p_order_note: params.order_note || null,
        p_items: params.items.map((i) => ({
          product_id: i.product_id,
          size_label: i.size_label,
          quantity: i.quantity,
        })),
        p_payment_method: params.payment_method || 'cod',
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        order_id: data.order_id,
        order_number: data.order_number,
        total_amount: data.total_amount,
        subtotal: data.subtotal,
        shipping_amount: data.shipping_amount,
      };
    } catch (err: unknown) {
      console.error('Error creating order in Supabase:', err);
      return {
        success: false,
        order_id: '',
        order_number: '',
        total_amount: 0,
        subtotal: 0,
        shipping_amount: 0,
        error: (err as Error)?.message || 'Failed to place order in database.',
      };
    }
  },

  /**
   * Get orders for the currently authenticated customer
   */
  async getUserOrders(): Promise<OrderRecord[]> {
    if (!isSupabaseConfigured()) {
      try {
        return JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        return [];
      }

      return (data as OrderRecord[]) || [];
    } catch (err) {
      console.error('getUserOrders unexpected error:', err);
      return [];
    }
  },

  /**
   * Get order details by ID (enforced by RLS)
   */
  async getOrderById(orderId: string): Promise<OrderRecord | null> {
    if (!isSupabaseConfigured()) {
      const demoOrders: OrderRecord[] = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
      return demoOrders.find((o) => o.id === orderId || o.order_number === orderId) || null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .maybeSingle();

      if (error || !data) {
        // Try query by order_number as fallback
        const { data: byNum, error: errNum } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('order_number', orderId)
          .maybeSingle();

        if (errNum || !byNum) return null;
        return byNum as OrderRecord;
      }

      return data as OrderRecord;
    } catch (err) {
      console.error('getOrderById unexpected error:', err);
      return null;
    }
  },

  /**
   * Customer Saved Addresses
   */
  async getUserAddresses(): Promise<UserAddress[]> {
    if (!isSupabaseConfigured()) {
      try {
        return JSON.parse(localStorage.getItem('ashapura_demo_addresses') || '[]');
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses:', error);
        return [];
      }

      return (data as UserAddress[]) || [];
    } catch (err) {
      console.error('getUserAddresses error:', err);
      return [];
    }
  },

  async saveAddress(address: Partial<UserAddress>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      const existing: UserAddress[] = JSON.parse(localStorage.getItem('ashapura_demo_addresses') || '[]');
      const newAddress: UserAddress = {
        id: address.id || `addr-${Date.now()}`,
        user_id: 'demo-user',
        full_name: address.full_name || '',
        phone: address.phone || '',
        address_line: address.address_line || '',
        landmark: address.landmark || '',
        city: address.city || 'Mira Road',
        pincode: address.pincode || '401107',
        is_default: Boolean(address.is_default),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('ashapura_demo_addresses', JSON.stringify([newAddress, ...existing]));
      return { success: true };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'User must be signed in to save an address' };

      if (address.id) {
        const { error } = await supabase
          .from('user_addresses')
          .update({
            full_name: address.full_name,
            phone: address.phone,
            address_line: address.address_line,
            landmark: address.landmark,
            city: address.city || 'Mira Road',
            pincode: address.pincode || '401107',
            is_default: address.is_default,
          })
          .eq('id', address.id)
          .eq('user_id', user.id);

        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            full_name: address.full_name,
            phone: address.phone,
            address_line: address.address_line,
            landmark: address.landmark,
            city: address.city || 'Mira Road',
            pincode: address.pincode || '401107',
            is_default: address.is_default || false,
          });

        if (error) return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to save address' };
    }
  },

  async deleteAddress(addressId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const existing: UserAddress[] = JSON.parse(localStorage.getItem('ashapura_demo_addresses') || '[]');
      localStorage.setItem('ashapura_demo_addresses', JSON.stringify(existing.filter((a) => a.id !== addressId)));
      return true;
    }

    try {
      const { error } = await supabase.from('user_addresses').delete().eq('id', addressId);
      return !error;
    } catch {
      return false;
    }
  },
};
