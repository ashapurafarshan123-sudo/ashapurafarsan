import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminDashboardStats, OrderRecord, OrderStatus, PaymentStatus, StoreSettings, UserProfile } from '../types';

export const adminService = {
  /**
   * Admin: Get Live Dashboard Metrics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const defaultStats: AdminDashboardStats = {
      total_revenue: 0,
      total_orders: 0,
      pending_orders: 0,
      processing_orders: 0,
      delivered_orders: 0,
      total_customers: 0,
      total_products: 35,
    };

    if (!isSupabaseConfigured()) {
      try {
        const demoOrders: OrderRecord[] = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
        const rev = demoOrders.filter((o) => o.status !== 'cancelled').reduce((acc, o) => acc + o.total_amount, 0);
        return {
          total_revenue: rev,
          total_orders: demoOrders.length,
          pending_orders: demoOrders.filter((o) => o.status === 'pending').length,
          processing_orders: demoOrders.filter((o) => ['confirmed', 'processing', 'out_for_delivery'].includes(o.status)).length,
          delivered_orders: demoOrders.filter((o) => o.status === 'delivered').length,
          total_customers: 1,
          total_products: 35,
        };
      } catch {
        return defaultStats;
      }
    }

    try {
      const { data, error } = await supabase.rpc('admin_get_dashboard_stats');
      if (error || !data) {
        // Fallback direct count queries
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: pendingCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: customerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true);

        return {
          total_revenue: 0,
          total_orders: orderCount || 0,
          pending_orders: pendingCount || 0,
          processing_orders: 0,
          delivered_orders: 0,
          total_customers: customerCount || 0,
          total_products: prodCount || 35,
        };
      }

      return data as AdminDashboardStats;
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
      return defaultStats;
    }
  },

  /**
   * Admin: Fetch Orders with Search and Filters
   */
  async getAllOrders(filters?: {
    status?: OrderStatus | 'all';
    payment_status?: PaymentStatus | 'all';
    search?: string;
  }): Promise<OrderRecord[]> {
    if (!isSupabaseConfigured()) {
      try {
        let orders: OrderRecord[] = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
        if (filters?.status && filters.status !== 'all') {
          orders = orders.filter((o) => o.status === filters.status);
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          orders = orders.filter((o) => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q));
        }
        return orders;
      } catch {
        return [];
      }
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.payment_status && filters.payment_status !== 'all') {
        query = query.eq('payment_status', filters.payment_status);
      }

      if (filters?.search) {
        const clean = filters.search.trim();
        query = query.or(`order_number.ilike.%${clean}%,customer_name.ilike.%${clean}%,customer_phone.ilike.%${clean}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching admin orders:', error);
        return [];
      }

      return (data as OrderRecord[]) || [];
    } catch (err) {
      console.error('getAllOrders error:', err);
      return [];
    }
  },

  /**
   * Admin: Update Order Status & Payment Status
   */
  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    internalNotes?: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      try {
        const demoOrders: OrderRecord[] = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
        const updated = demoOrders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
                payment_status: paymentStatus || o.payment_status,
                internal_notes: internalNotes ?? o.internal_notes,
                updated_at: new Date().toISOString(),
              }
            : o
        );
        localStorage.setItem('ashapura_demo_orders', JSON.stringify(updated));
        return { success: true };
      } catch {
        return { success: true };
      }
    }

    try {
      const { error } = await supabase.rpc('admin_update_order_status', {
        p_order_id: orderId,
        p_status: status,
        p_payment_status: paymentStatus || null,
        p_internal_notes: internalNotes || null,
      });

      if (error) {
        // Fallback direct update
        const { error: directErr } = await supabase
          .from('orders')
          .update({
            status,
            ...(paymentStatus ? { payment_status: paymentStatus } : {}),
            ...(internalNotes !== undefined ? { internal_notes: internalNotes } : {}),
          })
          .eq('id', orderId);

        if (directErr) return { success: false, error: directErr.message };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to update order status' };
    }
  },

  /**
   * Admin: Get Customers List with order summaries
   */
  async getAllCustomers(): Promise<Array<UserProfile & { total_orders?: number; total_spent?: number; email?: string }>> {
    if (!isSupabaseConfigured()) {
      return [
        {
          id: 'demo-customer-1',
          full_name: 'Ramesh Patel',
          phone: '9876543210',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_orders: 1,
          total_spent: 420,
        },
      ];
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !profiles) return [];

      // Query order aggregates per customer
      const { data: orders } = await supabase
        .from('orders')
        .select('user_id, total_amount, status');

      return profiles.map((p) => {
        const userOrders = orders?.filter((o) => o.user_id === p.id) || [];
        const totalSpent = userOrders
          .filter((o) => o.status !== 'cancelled')
          .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

        return {
          ...p,
          total_orders: userOrders.length,
          total_spent: totalSpent,
        };
      });
    } catch (err) {
      console.error('getAllCustomers error:', err);
      return [];
    }
  },

  /**
   * Store Settings
   */
  async getStoreSettings(): Promise<StoreSettings> {
    if (!isSupabaseConfigured()) {
      return {
        contact: {
          phone_primary: '+91 79 7733 8814',
          whatsapp_number: '917977338814',
          address: 'Shop No 15, Shantipark, Mira Road, Mumbai - 401107',
          hours: 'Open Daily: 8:00 AM - 10:30 PM',
        },
        operational: {
          is_store_open: true,
          accepting_orders: true,
          announcement: 'Fresh farsan prepared daily in pure groundnut oil!',
        },
      };
    }

    try {
      const { data } = await supabase.from('store_settings').select('*');
      const settings: StoreSettings = {};
      data?.forEach((row: { key: string; value: unknown }) => {
        if (row.key === 'shipping') settings.shipping = row.value as StoreSettings['shipping'];
        if (row.key === 'contact') settings.contact = row.value as StoreSettings['contact'];
        if (row.key === 'operational') settings.operational = row.value as StoreSettings['operational'];
      });
      return settings;
    } catch {
      return {};
    }
  },

  async updateStoreSetting(key: 'shipping' | 'contact' | 'operational', value: unknown): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from('store_settings').upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch {
      return false;
    }
  },
};
