import { NextRequest, NextResponse } from 'next/server';

import { createPaymentService } from '@/lib/payments';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference') ?? '';

  if (!reference) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Payment reference is required.',
      },
      { status: 400 }
    );
  }

  try {
    const paymentService = createPaymentService();
    const verification = await paymentService.verifyPayment(reference);

    if (!verification.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: verification.message || 'Payment verification failed.',
          paymentStatus: verification.paymentStatus ?? 'PENDING',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        verification.orderStatus === 'paid'
          ? 'Payment verified successfully.'
          : verification.orderStatus === 'failed'
            ? 'Payment failed or was not accepted.'
            : 'Payment is still pending confirmation.',
      orderId: verification.orderId,
      orderStatus: verification.orderStatus ?? 'pending',
      paymentStatus: verification.paymentStatus ?? 'PENDING',
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : 'Unexpected error during payment verification.',
      },
      { status: 500 }
    );
  }
}
