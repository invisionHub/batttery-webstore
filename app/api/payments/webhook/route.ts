import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { handlePaymentCallback } from '@/lib/payments';

function getPaystackSignature(secret: string, rawBody: string) {
  return crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { ok: false, message: 'PAYSTACK_SECRET_KEY is not configured.' },
      { status: 500 }
    );
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature') ?? '';
    const expectedSignature = getPaystackSignature(secretKey, rawBody);

    if (!signature || signature !== expectedSignature) {
      return NextResponse.json({ ok: false, message: 'Invalid webhook signature.' }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        reference?: string;
      };
    };

    if (event.event !== 'charge.success' || !event.data?.reference) {
      return NextResponse.json({ ok: true, message: 'Webhook received and ignored.' });
    }

    const result = await handlePaymentCallback(event.data.reference);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process webhook.';
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
