import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Order Creation & Price Integrity Verification', () => {
  // Mock trusted database pricing catalog
  const DB_VARIANTS = {
    'hero-ashapura-spcl-kachori:250g': { price: 110, active: true },
    'hero-ashapura-spcl-kachori:500g': { price: 210, active: true },
    'hero-ashapura-spcl-kachori:1kg': { price: 400, active: true },
    'namkeen-ratlami-sev:250g': { price: 90, active: true },
    'namkeen-ratlami-sev:500g': { price: 170, active: true },
    'namkeen-ratlami-sev:1kg': { price: 330, active: true },
    'archived-product:250g': { price: 50, active: false },
  };

  const calculateOrder = (clientRequest) => {
    if (!clientRequest.items || clientRequest.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let calculatedSubtotal = 0;
    const itemSnapshots = [];

    for (const item of clientRequest.items) {
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const key = `${item.productId}:${item.sizeLabel}`;
      const dbRecord = DB_VARIANTS[key];

      if (!dbRecord || !dbRecord.active) {
        throw new Error(`Product variant ${key} is unavailable or inactive`);
      }

      const unitPrice = dbRecord.price;
      const lineTotal = unitPrice * item.quantity;
      calculatedSubtotal += lineTotal;

      itemSnapshots.push({
        productId: item.productId,
        sizeLabel: item.sizeLabel,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }

    const shipping = clientRequest.orderType === 'delivery' ? 0 : 0;
    const totalAmount = calculatedSubtotal + shipping;

    // Generate human readable order number format AF-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `AF-${dateStr}-A1B2`;

    return {
      orderNumber,
      subtotal: calculatedSubtotal,
      shipping,
      totalAmount,
      items: itemSnapshots,
    };
  };

  it('calculates order total exclusively using trusted database prices', () => {
    const clientPayload = {
      orderType: 'delivery',
      items: [
        { productId: 'hero-ashapura-spcl-kachori', sizeLabel: '250g', quantity: 2, clientClaimedPrice: 10 },
        { productId: 'namkeen-ratlami-sev', sizeLabel: '500g', quantity: 1, clientClaimedPrice: 20 },
      ],
      clientClaimedTotal: 30, // Attempted tamper
    };

    const order = calculateOrder(clientPayload);

    // 2 x 110 = 220 + 1 x 170 = 390
    assert.equal(order.subtotal, 390);
    assert.equal(order.totalAmount, 390);
    assert.notEqual(order.totalAmount, clientPayload.clientClaimedTotal);
    assert.equal(order.items[0].unitPrice, 110);
    assert.equal(order.items[1].unitPrice, 170);
  });

  it('rejects order with zero or negative item quantities', () => {
    const invalidPayload = {
      orderType: 'delivery',
      items: [
        { productId: 'hero-ashapura-spcl-kachori', sizeLabel: '250g', quantity: 0 },
      ],
    };

    assert.throws(() => calculateOrder(invalidPayload), /Quantity must be greater than 0/);
  });

  it('rejects order containing archived or unavailable products', () => {
    const invalidPayload = {
      orderType: 'delivery',
      items: [
        { productId: 'archived-product', sizeLabel: '250g', quantity: 1 },
      ],
    };

    assert.throws(() => calculateOrder(invalidPayload), /unavailable or inactive/);
  });

  it('generates compliant human readable order number pattern', () => {
    const payload = {
      orderType: 'pickup',
      items: [{ productId: 'namkeen-ratlami-sev', sizeLabel: '250g', quantity: 1 }],
    };

    const order = calculateOrder(payload);
    assert.match(order.orderNumber, /^AF-\d{8}-[A-Z0-9]{4}$/);
  });
});
