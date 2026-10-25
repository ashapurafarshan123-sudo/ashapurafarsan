import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  AdminDashboardStats,
  AdminAdvancedAnalytics,
  GlobalDiscountConfig,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
  StoreSettings,
  UserProfile,
} from '../types';

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
   * Admin: Get Advanced Analytics with Date Filtering
   */
  async getAdvancedAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<AdminAdvancedAnalytics> {
    const defaultAnalytics: AdminAdvancedAnalytics = {
      gross_sales: 0,
      net_sales: 0,
      discounts_granted: 0,
      refunds: 0,
      total_orders: 0,
      website_orders_count: 0,
      website_sales: 0,
      whatsapp_orders_count: 0,
      whatsapp_confirmed_count: 0,
      whatsapp_sales: 0,
      pending_orders_count: 0,
      today_sales: 0,
      this_month_sales: 0,
      in_stock_products_count: 35,
      out_of_stock_products_count: 0,
      average_order_value: 0,
      best_selling_products: [],
      daily_trends: [],
    };

    if (!isSupabaseConfigured()) {
      return defaultAnalytics;
    }

    try {
      const { data, error } = await supabase.rpc('admin_get_advanced_analytics', {
        p_start_date: startDate || null,
        p_end_date: endDate || null,
      });

      if (!error && data) {
        return data as AdminAdvancedAnalytics;
      }

      // Fallback: Aggregate manually from database if RPC function is not yet migrated
      let query = supabase.from('orders').select('*, order_items(*)');
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);

      const { data: orders } = await query;
      const orderList = (orders as OrderRecord[]) || [];

      const nonCancelled = orderList.filter((o) => o.status !== 'cancelled');
      const confirmedSales = nonCancelled.filter(
        (o) => o.payment_method !== 'whatsapp_direct' || ['confirmed', 'processing', 'out_for_delivery', 'delivered'].includes(o.status)
      );

      const gross = confirmedSales.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const net = confirmedSales.reduce((sum, o) => sum + Number(o.subtotal), 0);
      const discounts = confirmedSales.reduce((sum, o) => sum + Number(o.discount_amount || 0), 0);

      const websiteOrders = nonCancelled.filter((o) => o.payment_method !== 'whatsapp_direct');
      const waOrders = orderList.filter((o) => o.payment_method === 'whatsapp_direct');
      const waConfirmed = waOrders.filter((o) => ['confirmed', 'processing', 'out_for_delivery', 'delivered'].includes(o.status));

      const { count: inStock } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: outStock } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', false);

      return {
        gross_sales: gross,
        net_sales: net,
        discounts_granted: discounts,
        refunds: 0,
        total_orders: confirmedSales.length,
        website_orders_count: websiteOrders.length,
        website_sales: websiteOrders.reduce((sum, o) => sum + Number(o.total_amount), 0),
        whatsapp_orders_count: waOrders.length,
        whatsapp_confirmed_count: waConfirmed.length,
        whatsapp_sales: waConfirmed.reduce((sum, o) => sum + Number(o.total_amount), 0),
        pending_orders_count: orderList.filter((o) => o.status === 'pending').length,
        today_sales: 0,
        this_month_sales: 0,
        in_stock_products_count: inStock || 0,
        out_of_stock_products_count: outStock || 0,
        average_order_value: confirmedSales.length > 0 ? Math.round(gross / confirmedSales.length) : 0,
        best_selling_products: [],
        daily_trends: [],
      };
    } catch (err) {
      console.error('Error fetching advanced analytics:', err);
      return defaultAnalytics;
    }
  },

  /**
   * Admin: Fetch Orders with Search, Channel & Date Filters
   */
  async getAllOrders(filters?: {
    status?: OrderStatus | 'all';
    payment_status?: PaymentStatus | 'all';
    channel?: 'website' | 'whatsapp' | 'all';
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<OrderRecord[]> {
    if (!isSupabaseConfigured()) {
      try {
        let orders: OrderRecord[] = JSON.parse(localStorage.getItem('ashapura_demo_orders') || '[]');
        if (filters?.channel === 'website') {
          orders = orders.filter((o) => o.payment_method !== 'whatsapp_direct');
        } else if (filters?.channel === 'whatsapp') {
          orders = orders.filter((o) => o.payment_method === 'whatsapp_direct');
        }
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

      if (filters?.channel === 'website') {
        query = query.neq('payment_method', 'whatsapp_direct');
      } else if (filters?.channel === 'whatsapp') {
        query = query.eq('payment_method', 'whatsapp_direct');
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.payment_status && filters.payment_status !== 'all') {
        query = query.eq('payment_status', filters.payment_status);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
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
        if (row.key === 'global_discount') settings.global_discount = row.value as GlobalDiscountConfig;
      });
      return settings;
    } catch {
      return {};
    }
  },

  async updateStoreSetting(key: 'shipping' | 'contact' | 'operational' | 'global_discount', value: unknown): Promise<boolean> {
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

  /**
   * Admin: Get Active Storewide Discount
   */
  async getStoreDiscount(): Promise<GlobalDiscountConfig> {
    const defaultDiscount: GlobalDiscountConfig = {
      is_active: false,
      type: 'percentage',
      value: 10,
      min_order_amount: 0,
      start_date: null,
      end_date: null,
      banner_text: 'Special 10% Off Storewide on Fresh Farsan!',
    };

    if (!isSupabaseConfigured()) {
      try {
        const stored = localStorage.getItem('ashapura_global_discount');
        return stored ? JSON.parse(stored) : defaultDiscount;
      } catch {
        return defaultDiscount;
      }
    }

    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'global_discount')
        .maybeSingle();

      if (error || !data || !data.value) {
        return defaultDiscount;
      }

      return data.value as GlobalDiscountConfig;
    } catch {
      return defaultDiscount;
    }
  },

  /**
   * Admin: Save Storewide Discount Configuration
   */
  async saveStoreDiscount(config: GlobalDiscountConfig): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      try {
        localStorage.setItem('ashapura_global_discount', JSON.stringify(config));
        return { success: true };
      } catch {
        return { success: false, error: 'Could not write to local storage' };
      }
    }

    try {
      const { error } = await supabase.from('store_settings').upsert({
        key: 'global_discount',
        value: config,
        updated_at: new Date().toISOString(),
      });

      if (error) return { success: false, error: error.message };

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error)?.message || 'Failed to save store discount' };
    }
  },

  /**
   * Admin: Utility to Export Data to CSV
   */
  exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
    const escape = (val: string | number) => {
      const str = String(val ?? '').replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map((row) => row.map(escape).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
