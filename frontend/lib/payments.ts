import { orderRepository } from '@/lib/repositories';
import { sendOrderEmailNotifications } from '@/lib/notifications';
import type { PaymentMethod } from '@/lib/database/mongodb.connection';

export type PaymentProvider = 'mock' | 'paystack';

export type PaymentResult = {
  ok: boolean;
  provider: PaymentProvider;
  status: 'initialized' | 'succeeded' | 'failed' | 'pending';
  paymentUrl?: string;
  message: string;
  reference?: string;
};

type PaymentVerificationResult = {
  ok: boolean;
  paid: boolean;
  message: string;
};

const paystackChannels: Record<PaymentMethod, string[]> = {
  card: ['card'],
  bank_transfer: ['bank_transfer'],
  ussd: ['ussd'],
};

export function getPaymentProviderName(): PaymentProvider {
  return (process.env.PAYMENT_PROVIDER as PaymentProvider | undefined) ?? 'mock';
}

export function buildPaymentCallbackUrl(origin: string, reference: string) {
  const baseUrl = origin.replace(/\/$/, '');
  return `${baseUrl}/api/payments/callback?reference=${encodeURIComponent(reference)}`;
}

function buildCheckoutSuccessUrl(origin: string, reference: string, status?: string, orderId?: string) {
  const baseUrl = origin.replace(/\/$/, '');
  const url = new URL(`${baseUrl}/checkOut/success`);
  url.searchParams.set('reference', reference);

  if (status) {
    url.searchParams.set('status', status);
  }

  if (orderId) {
    url.searchParams.set('orderId', orderId);
  }

  return url.toString();
}

function toKobo(amount: number) {
  return Math.round(amount * 100);
}

function getPaystackSecretKey() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is required for Paystack payments.');
  }

  return secretKey;
}

async function initializePaystackPayment(
  reference: string,
  amount: number,
  customerEmail: string,
  origin: string,
  paymentMethod: PaymentMethod,
  orderId?: string
): Promise<PaymentResult> {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: customerEmail,
      amount: toKobo(amount),
      reference,
      channels: paystackChannels[paymentMethod],
      callback_url: buildCheckoutSuccessUrl(origin, reference, undefined, orderId),
      metadata: {
        reference,
        orderId,
        paymentMethod,
      },
    }),
  });

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message ?? 'Unable to initialize Paystack payment.');
  }

  return {
    ok: true,
    provider: 'paystack',
    status: 'initialized',
    paymentUrl: payload.data.authorization_url,
    message: payload.message ?? 'Paystack payment initialized successfully.',
    reference: payload.data.reference ?? reference,
  };
}

async function verifyPaystackPayment(
  reference: string,
  expectedAmount: number,
  expectedEmail: string
): Promise<PaymentVerificationResult> {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
      },
      cache: 'no-store',
    }
  );

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      status?: string;
      amount?: number;
      customer?: { email?: string };
      reference?: string;
    };
  };

  if (!response.ok || !payload.status || !payload.data) {
    return {
      ok: false,
      paid: false,
      message: payload.message ?? 'Unable to verify Paystack payment.',
    };
  }

  if (payload.data.status !== 'success') {
    return {
      ok: true,
      paid: false,
      message:
        payload.data.status === 'pending'
          ? 'Your payment is still pending. Complete the Paystack flow and refresh this page if needed.'
          : `Payment is not successful yet. Current Paystack status: ${payload.data.status ?? 'unknown'}.`,
    };
  }

  if (payload.data.amount !== toKobo(expectedAmount)) {
    return {
      ok: false,
      paid: false,
      message: 'Verified payment amount does not match the order total.',
    };
  }

  if ((payload.data.customer?.email ?? '').toLowerCase() !== expectedEmail.toLowerCase()) {
    return {
      ok: false,
      paid: false,
      message: 'Verified payment email does not match the order email.',
    };
  }

  return {
    ok: true,
    paid: true,
    message: 'Paystack payment verified successfully.',
  };
}

export async function initializePayment(
  reference: string,
  amount: number,
  customerEmail: string,
  options?: {
    origin?: string;
    paymentMethod?: PaymentMethod;
    orderId?: string;
  }
) {
  const provider = getPaymentProviderName();
  const paymentMethod = options?.paymentMethod ?? 'card';
  const origin = options?.origin ?? process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;

  if (!origin) {
    throw new Error('An application base URL is required to initialize checkout payments.');
  }

  if (provider === 'paystack') {
    return initializePaystackPayment(
      reference,
      amount,
      customerEmail,
      origin,
      paymentMethod,
      options?.orderId
    );
  }

  return {
    ok: true,
    provider: 'mock',
    status: 'initialized' as const,
    paymentUrl: buildCheckoutSuccessUrl(origin, reference, 'mock', options?.orderId),
    message: 'Mock payment flow initialized.',
    reference,
  };
}

export async function handlePaymentCallback(reference: string) {
  const existingOrder = await orderRepository.findByPaymentReference(reference);

  if (!existingOrder) {
    return {
      ok: false,
      reference,
      notifications: [],
      message: 'No order was found for this payment reference.',
    };
  }

  if (existingOrder.status === 'paid') {
    return {
      ok: true,
      reference,
      orderId: existingOrder.id,
      orderStatus: existingOrder.status,
      notifications: [],
      message: 'Payment already confirmed.',
    };
  }

  const provider = getPaymentProviderName();

  if (provider === 'paystack') {
    const verification = await verifyPaystackPayment(
      reference,
      existingOrder.amount,
      existingOrder.customer_email
    );

    if (!verification.ok) {
      return {
        ok: false,
        reference,
        orderId: existingOrder.id,
        orderStatus: existingOrder.status,
        notifications: [],
        message: verification.message,
      };
    }

    if (!verification.paid) {
      return {
        ok: true,
        reference,
        orderId: existingOrder.id,
        orderStatus: existingOrder.status,
        notifications: [],
        message: verification.message,
      };
    }
  }

  const updated = await orderRepository.updateStatusByPaymentReference(reference, 'paid');
  const { order, items } = await orderRepository.findOrderWithItemsByPaymentReference(reference);

  if (!order) {
    return {
      ok: false,
      updated,
      reference,
      notifications: [],
      message: 'Payment was verified but the order could not be reloaded.',
    };
  }

  const notificationResult = await sendOrderEmailNotifications(order, items);

  return {
    ok: true,
    updated,
    reference,
    orderId: order.id,
    orderStatus: order.status,
    notifications: notificationResult.payloads,
    email: notificationResult,
    message: notificationResult.message,
  };
}
