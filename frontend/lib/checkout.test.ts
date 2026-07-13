import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getOrderIdempotencyKey } from '@/lib/checkout';

describe('getOrderIdempotencyKey', () => {
  it('returns the provided key when one is supplied', () => {
    assert.equal(
      getOrderIdempotencyKey('checkout-123', { customerEmail: 'buyer@example.com' }),
      'checkout-123'
    );
  });

  it('creates a stable key from checkout details when no key is supplied', () => {
    const first = getOrderIdempotencyKey(undefined, {
      customerEmail: 'buyer@example.com',
      customerPhone: '+2348010000000',
      items: [
        { id: 'prod-1', name: 'Battery', price: 1200, quantity: 2 },
        { id: 'prod-2', name: 'Cable', price: 500, quantity: 1 },
      ],
      amount: 2900,
    });

    const second = getOrderIdempotencyKey(undefined, {
      customerEmail: 'buyer@example.com',
      customerPhone: '+2348010000000',
      items: [
        { id: 'prod-1', name: 'Battery', price: 1200, quantity: 2 },
        { id: 'prod-2', name: 'Cable', price: 500, quantity: 1 },
      ],
      amount: 2900,
    });

    assert.equal(first, second);
    assert.match(first, /checkout/);
  });
});
