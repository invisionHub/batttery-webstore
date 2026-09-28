import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentService } from '@/lib/payments';

const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify Paystack signature if secret key is configured
    if (paystackSecretKey) {
      const signature = req.headers.get('x-paystack-signature');
      const hash = crypto.createHmac('sha512', paystackSecretKey).update(rawBody).digest('hex');

      if (hash !== signature) {
        return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const reference = event.data?.reference;
      if (reference) {
        const paymentService = createPaymentService();
        await paymentService.verifyPayment(reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[PaystackWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}
