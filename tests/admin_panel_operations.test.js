import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Admin Panel Operations & Discount Verification', () => {
  it('computes percentage discounts correctly and enforces 0 minimum price floor', () => {
    const subtotal = 1000;
    const discountPercent = 10;
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    assert.equal(discountAmount, 100);
    assert.equal(finalTotal, 900);
  });

  it('enforces minimum order amount threshold for global discounts', () => {
    const discountConfig = {
      is_active: true,
      type: 'percentage',
      value: 15,
      min_order_amount: 500,
    };

    const cartSmall = 300;
    const cartLarge = 600;

    const applyDiscount = (subtotal, config) => {
      if (!config.is_active || subtotal < config.min_order_amount) return 0;
      return Math.round((subtotal * config.value) / 100);
    };

    assert.equal(applyDiscount(cartSmall, discountConfig), 0, 'Small cart under threshold should receive 0 discount');
    assert.equal(applyDiscount(cartLarge, discountConfig), 90, 'Cart above threshold should receive 15% discount');
  });

  it('strictly segregates completed revenue from unconfirmed WhatsApp enquiries and cancelled orders', () => {
    const orders = [
      { id: '1', payment_method: 'cod', status: 'delivered', total_amount: 500 },
      { id: '2', payment_method: 'cod', status: 'pending', total_amount: 350 },
      { id: '3', payment_method: 'cod', status: 'cancelled', total_amount: 400 },
      { id: '4', payment_method: 'whatsapp_direct', status: 'pending', total_amount: 600 }, // unconfirmed enquiry
      { id: '5', payment_method: 'whatsapp_direct', status: 'confirmed', total_amount: 450 }, // confirmed whatsapp order
    ];

    // Financial rule:
    // Confirmed sales = Website orders not cancelled + Confirmed/Delivered WhatsApp orders
    const confirmedSales = orders.filter((o) => {
      if (o.status === 'cancelled') return false;
      if (o.payment_method === 'whatsapp_direct') {
        return ['confirmed', 'processing', 'out_for_delivery', 'delivered'].includes(o.status);
      }
      return true;
    });

    const totalConfirmedRevenue = confirmedSales.reduce((sum, o) => sum + o.total_amount, 0);

    // Order 1 (500) + Order 2 (350) + Order 5 (450) = 1300
    assert.equal(totalConfirmedRevenue, 1300);
    assert.equal(confirmedSales.some((o) => o.id === '3'), false, 'Cancelled orders must not count towards sales');
    assert.equal(confirmedSales.some((o) => o.id === '4'), false, 'Unconfirmed WhatsApp enquiries must not count towards sales');
  });

  it('prevents purchasing items marked Out of Stock', () => {
    const product = {
      id: 'prod-ratlami-sev',
      name: 'Special Ratlami Sev',
      isActive: false, // Out of Stock
      prices: { '250g': 90, '500g': 175, '1kg': 340 },
    };

    const canAddToCart = (p) => Boolean(p.isActive !== false);

    assert.equal(canAddToCart(product), false, 'Product marked out of stock cannot be added to cart');
  });
});
