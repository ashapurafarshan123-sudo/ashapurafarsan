import { CartItem } from '../types';
import { SHOP_CONFIG } from '../config/shop';

export interface WhatsAppOrderDetails {
  orderNumber?: string;
  name?: string;
  phone?: string;
  orderType?: 'delivery' | 'pickup';
  address?: string;
  note?: string;
}

/**
 * Builds a clean, human-readable WhatsApp message listing all products,
 * packaging sizes, quantities, line prices, and grand total.
 */
export function buildWhatsAppOrderMessage(
  items: CartItem[],
  subtotal: number,
  details?: WhatsAppOrderDetails
): string {
  if (!items || items.length === 0) {
    return 'Hello Ashapura Farsan! I would like to place an order for fresh Gujarati snacks and farsan from your Mira Road shop.';
  }

  const lines: string[] = [];

  lines.push('🛒 *NEW ORDER — ASHAPURA FARSAN*');
  if (details?.orderNumber) {
    lines.push(`*Order #:* ${details.orderNumber}`);
  }
  lines.push('──────────────────────────────');

  if (details?.name) {
    lines.push(`👤 *Customer:* ${details.name.trim()}`);
  }
  if (details?.phone) {
    lines.push(`📞 *Phone:* ${details.phone.trim()}`);
  }
  if (details?.orderType) {
    lines.push(
      `📍 *Order Type:* ${details.orderType === 'delivery' ? 'Home Delivery' : 'Shop Pickup (Mira Road)'}`
    );
  }
  if (details?.address && details.orderType === 'delivery') {
    lines.push(`🏠 *Address:* ${details.address.trim()}`);
  }

  if (details?.name || details?.phone) {
    lines.push('──────────────────────────────');
  }

  lines.push('*📦 Selected Items in Cart:*');
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    lines.push(
      `${index + 1}. *${item.product.name}* (${item.weight})\n   ↳ Qty: ${item.quantity} × ₹${item.price} = *₹${itemTotal}*`
    );
  });

  lines.push('──────────────────────────────');
  lines.push(`💰 *Total Cart Amount:* *₹${subtotal}*`);
  lines.push('──────────────────────────────');

  if (details?.note && details.note.trim()) {
    lines.push(`📝 *Note:* ${details.note.trim()}`);
    lines.push('──────────────────────────────');
  }

  lines.push('Please confirm my order and share delivery / payment details. Thank you!');

  return lines.join('\n');
}

/**
 * Generates direct wa.me link with encoded order message
 */
export function getWhatsAppOrderUrl(
  items: CartItem[],
  subtotal: number,
  details?: WhatsAppOrderDetails
): string {
  const message = buildWhatsAppOrderMessage(items, subtotal, details);
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
