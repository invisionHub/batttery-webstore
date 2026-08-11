import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPaymentProviderName, buildPaymentCallbackUrl } from '@/lib/payments';

describe('payments', () => {
  it('defaults to the mock provider when no provider is configured', () => {
    assert.equal(getPaymentProviderName(), 'mock');
  });

  it('builds a callback URL from a request origin', () => {
    const url = buildPaymentCallbackUrl('https://store.example.com', 'order-123');
    assert.equal(url, 'https://store.example.com/api/payments/callback?reference=order-123');
  });
});
