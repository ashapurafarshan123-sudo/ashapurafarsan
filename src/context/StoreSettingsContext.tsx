import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SHOP_CONFIG } from '../config/shop';
import { GlobalDiscountConfig, StoreSettings } from '../types';

export interface LiveStoreSettings {
  contact: {
    phone_primary: string;
    phone_secondary?: string;
    phone_primary_raw: string;
    phone_secondary_raw?: string;
    whatsapp_number: string;
    address: string;
    full_address: string;
    hours: string;
    google_maps_url: string;
  };
  operational: {
    announcement: string;
    is_store_open: boolean;
    accepting_orders: boolean;
  };
  shipping: {
    standard_fee: number;
    free_shipping_min: number;
    local_delivery_area: string;
  };
  discount: GlobalDiscountConfig;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  getWhatsAppUrl: (message?: string) => string;
}

const defaultDiscount: GlobalDiscountConfig = {
  is_active: false,
  type: 'percentage',
  value: 10,
  min_order_amount: 0,
  start_date: null,
  end_date: null,
  banner_text: '',
};

const defaultLiveSettings: LiveStoreSettings = {
  contact: {
    phone_primary: SHOP_CONFIG.phonePrimary,
    phone_secondary: SHOP_CONFIG.phoneSecondary,
    phone_primary_raw: SHOP_CONFIG.phonePrimaryRaw,
    phone_secondary_raw: SHOP_CONFIG.phoneSecondaryRaw,
    whatsapp_number: SHOP_CONFIG.whatsappNumber,
    address: SHOP_CONFIG.address,
    full_address: SHOP_CONFIG.fullAddress,
    hours: SHOP_CONFIG.hours,
    google_maps_url: SHOP_CONFIG.googleMapsUrl,
  },
  operational: {
    announcement: 'Fresh farsan prepared daily in pure groundnut oil!',
    is_store_open: true,
    accepting_orders: true,
  },
  shipping: {
    standard_fee: 0,
    free_shipping_min: 0,
    local_delivery_area: 'Mira Road, Mumbai',
  },
  discount: defaultDiscount,
  isLoading: true,
  refreshSettings: async () => {},
  getWhatsAppUrl: (msg = 'Hello Ashapura Farsan, I would like to place an order.') =>
    `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`,
};

const StoreSettingsContext = createContext<LiveStoreSettings>(defaultLiveSettings);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<LiveStoreSettings>(defaultLiveSettings);

  const cleanPhoneRaw = (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  };

  const cleanWhatsAppNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits || SHOP_CONFIG.whatsappNumber;
  };

  const fetchLiveSettings = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setSettings((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const { data, error } = await supabase.from('store_settings').select('*');
      if (error || !data) {
        setSettings((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const raw: StoreSettings = {};
      data.forEach((row: { key: string; value: unknown }) => {
        if (row.key === 'shipping') raw.shipping = row.value as StoreSettings['shipping'];
        if (row.key === 'contact') raw.contact = row.value as StoreSettings['contact'];
        if (row.key === 'operational') raw.operational = row.value as StoreSettings['operational'];
        if (row.key === 'global_discount') raw.global_discount = row.value as GlobalDiscountConfig;
      });

      const primaryPhone = raw.contact?.phone_primary || SHOP_CONFIG.phonePrimary;
      const secondaryPhone = raw.contact?.phone_secondary || SHOP_CONFIG.phoneSecondary;
      const whatsapp = cleanWhatsAppNumber(raw.contact?.whatsapp_number || primaryPhone);
      const address = raw.contact?.address || SHOP_CONFIG.address;
      const hours = raw.contact?.hours || SHOP_CONFIG.hours;

      setSettings({
        contact: {
          phone_primary: primaryPhone,
          phone_secondary: secondaryPhone,
          phone_primary_raw: cleanPhoneRaw(primaryPhone),
          phone_secondary_raw: secondaryPhone ? cleanPhoneRaw(secondaryPhone) : undefined,
          whatsapp_number: whatsapp,
          address,
          full_address: address.includes('Mumbai') ? address : `${address}, Mumbai, Maharashtra 401107`,
          hours,
          google_maps_url: SHOP_CONFIG.googleMapsUrl,
        },
        operational: {
          announcement: raw.operational?.announcement ?? 'Fresh farsan prepared daily in pure groundnut oil!',
          is_store_open: raw.operational?.is_store_open ?? true,
          accepting_orders: raw.operational?.accepting_orders ?? true,
        },
        shipping: {
          standard_fee: raw.shipping?.standard_fee ?? 0,
          free_shipping_min: raw.shipping?.free_shipping_min ?? 0,
          local_delivery_area: raw.shipping?.local_delivery_area ?? 'Mira Road, Mumbai',
        },
        discount: raw.global_discount || defaultDiscount,
        isLoading: false,
        refreshSettings: fetchLiveSettings,
        getWhatsAppUrl: (msg = 'Hello Ashapura Farsan, I would like to place an order.') =>
          `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,
      });
    } catch (err) {
      console.warn('Error fetching store_settings, falling back to defaults:', err);
      setSettings((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchLiveSettings();

    // Setup realtime subscription to store_settings table if Supabase is active
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('public:store_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'store_settings' },
        () => {
          fetchLiveSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLiveSettings]);

  return (
    <StoreSettingsContext.Provider value={settings}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = (): LiveStoreSettings => {
  return useContext(StoreSettingsContext);
};
