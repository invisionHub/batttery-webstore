import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderEmailPayloads } from '@/lib/notifications';

describe('notifications', () => {
  it('builds buyer and owner email payloads for a paid order', () => {
    const payloads = buildOrderEmailPayloads(
      {
        id: 'order-123',
        idempotency_key: 'checkout-123',
        first_name: 'Ada',
        last_name: 'Lovelace',
        customer_name: 'Ada Lovelace',
        customer_email: 'buyer@example.com',
        customer_phone: '+2348011111111',
        address: '12 Battery Street',
        city: 'Lagos',
        state: 'Lagos',
        delivery_method: 'standard',
        payment_method: 'card',
        payment_reference: 'pay-123',
        payment_provider: 'paystack',
        currency: 'NGN',
        subtotal: 2500,
        discount: 0,
        shipping_fee: 3500,
        vat_amount: 188,
        amount: 6188,
        item_count: 2,
        notes: 'Call on arrival',
        status: 'paid',
        created_at: new Date('2026-01-01T00:00:00.000Z'),
        updated_at: new Date('2026-01-01T00:00:00.000Z'),
        paid_at: new Date('2026-01-01T00:05:00.000Z'),
      },
      [
        {
          id: 'item-1',
          order_id: 'order-123',
          product_id: 'prod-1',
          product_slug: 'battery-pack',
          product_name: 'Battery Pack',
          quantity: 2,
          unit_price: 1250,
          price_at_purchase: 1250,
          line_total: 2500,
        },
      ]
    );

    assert.equal(payloads.length, 2);
    assert.equal(payloads[0].to, 'buyer@example.com');
    assert.match(payloads[0].subject, /Order confirmed/i);
    assert.match(payloads[1].subject, /Payment confirmed/i);
    assert.match(payloads[0].html, /pay-123/);
    assert.match(payloads[0].html, /Battery Pack/);
    assert.match(payloads[0].html, /Card/);
  });
});
