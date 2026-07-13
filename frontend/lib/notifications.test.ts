import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildOrderEmailPayloads } from '@/lib/notifications';

describe('notifications', () => {
  it('builds buyer and owner email payloads for a paid order', () => {
    const payloads = buildOrderEmailPayloads(
      {
        id: 'order-123',
        customer_name: 'Ada Lovelace',
        customer_email: 'buyer@example.com',
        customer_phone: '+2348011111111',
        amount: 2500,
        payment_reference: 'pay-123',
        status: 'paid',
        created_at: new Date('2026-01-01T00:00:00.000Z'),
      },
      [
        {
          id: 'item-1',
          order_id: 'order-123',
          product_id: 'prod-1',
          quantity: 2,
          price_at_purchase: 1250,
        },
      ]
    );

    assert.equal(payloads.length, 2);
    assert.equal(payloads[0].to, 'buyer@example.com');
    assert.match(payloads[0].subject, /Order confirmed/i);
    assert.match(payloads[1].subject, /New order received/i);
    assert.match(payloads[0].html, /pay-123/);
  });
});
