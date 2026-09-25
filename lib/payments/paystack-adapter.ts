import type {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentProvider,
  VerifyPaymentResult,
} from './types';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export class PaystackAdapter implements PaymentProvider {
  constructor(
    private readonly secretKey: string,
    private readonly appUrl: string
  ) {}

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    if (!this.secretKey || process.env.PAYMENT_PROVIDER === 'mock') {
      const callback = input.callbackUrl ?? `${this.appUrl}/checkOut/success`;
      const url = new URL(callback);
      url.searchParams.set('reference', input.reference);
      url.searchParams.set('trxref', input.reference);

      return {
        ok: true,
        authorizationUrl: url.toString(),
        accessCode: `mock_code_${Date.now()}`,
        reference: input.reference,
        raw: { status: true, message: 'Mock payment initialization successful' },
      };
    }

    const payload = {
      email: input.email,
      amount: Math.round(Number(input.amount) * 100),
      reference: input.reference,
      callback_url: input.callbackUrl ?? `${this.appUrl}/checkOut/success`,
      metadata: {
        ...input.metadata,
        order_reference: input.reference,
      },
    };

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        authorization_url?: string;
        access_code?: string;
        reference?: string;
      };
    };

    if (!response.ok || !result.status || !result.data) {
      return {
        ok: false,
        message: result.message || 'Unable to initialize Paystack payment.',
        raw: result,
      };
    }

    return {
      ok: true,
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: result.data.reference ?? input.reference,
      raw: result,
    };
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    if (!this.secretKey || process.env.PAYMENT_PROVIDER === 'mock') {
      return {
        ok: true,
        reference,
        status: 'success',
        raw: { status: true, message: 'Mock payment verified successfully' },
      };
    }

    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );

    const result = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        reference?: string;
        status?: 'success' | 'failed' | 'abandoned' | 'pending' | string;
        amount?: number;
        currency?: string;
        customer?: {
          email?: string;
        };
      };
    };

    if (!response.ok || !result.status || !result.data) {
      return {
        ok: false,
        message: result.message || 'Unable to verify Paystack payment.',
        raw: result,
      };
    }

    return {
      ok: true,
      reference: result.data.reference,
      status: result.data.status,
      amount: result.data.amount ? result.data.amount / 100 : undefined,
      currency: result.data.currency,
      customer: result.data.customer,
      raw: result,
    };
  }
}

export function createPaystackAdapter() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY ?? '';
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return new PaystackAdapter(secretKey, appUrl);
}
