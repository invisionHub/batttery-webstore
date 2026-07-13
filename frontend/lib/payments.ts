import { getOrderById, getOrderItemsByOrderId, updateOrderStatus } from '@/lib/repository';
import { buildOrderEmailPayloads } from '@/lib/notifications';

export type PaymentProvider = 'mock' | 'paystack' | 'flutterwave' | 'stripe';

export type PaymentResult = {
  ok: boolean;
  provider: PaymentProvider;
  status: 'initialized' | 'succeeded' | 'failed' | 'pending';
  paymentUrl?: string;
  message: string;
  reference?: string;
};

export function getPaymentProviderName(): PaymentProvider {
  return (process.env.PAYMENT_PROVIDER as PaymentProvider | undefined) ?? 'mock';
}

export function buildPaymentCallbackUrl(origin: string, reference: string) {
  const baseUrl = origin.replace(/\/$/, '');
  return `${baseUrl}/api/payments/callback?reference=${encodeURIComponent(reference)}`;
}

export async function initializePayment(reference: string, amount: number, customerEmail: string) {
  const provider = getPaymentProviderName();

  switch (provider) {
    case 'paystack':
      return {
        ok: true,
        provider,
        status: 'initialized' as const,
        paymentUrl: `https://paystack.com/pay/${reference}`,
        message: 'Paystack initialization is ready.',
        reference,
      };
    case 'flutterwave':
      return {
        ok: true,
        provider,
        status: 'initialized' as const,
        paymentUrl: `https://checkout.flutterwave.com/${reference}`,
        message: 'Flutterwave initialization is ready.',
        reference,
      };
    case 'stripe':
      return {
        ok: true,
        provider,
        status: 'initialized' as const,
        paymentUrl: `https://checkout.stripe.com/pay/${reference}`,
        message: 'Stripe initialization is ready.',
        reference,
      };
    default:
      return {
        ok: true,
        provider: 'mock',
        status: 'initialized' as const,
        paymentUrl: `/payments/mock?reference=${encodeURIComponent(reference)}&amount=${amount}&email=${encodeURIComponent(customerEmail)}`,
        message: 'Mock payment flow initialized.',
        reference,
      };
  }
}

export async function handlePaymentCallback(reference: string) {
  const updated = await updateOrderStatus(reference, 'paid');
  const order = await getOrderById(reference);
  const items = order ? await getOrderItemsByOrderId(order.id) : [];

  const notifications = order ? buildOrderEmailPayloads(order, items) : [];

  return {
    ok: true,
    updated,
    reference,
    notifications,
    message: 'Payment callback processed.',
  };
}
