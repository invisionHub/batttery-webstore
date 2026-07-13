import { NextResponse } from 'next/server';
import { createPendingOrder } from '@/lib/checkout';
import { initializePayment } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      amount: Number(body.amount ?? 0),
      items: Array.isArray(body.items) ? body.items : [],
      paymentReference: body.paymentReference,
      idempotencyKey: body.idempotencyKey,
      shippingAddress: body.shippingAddress,
      notes: body.notes,
    };

    const result = await createPendingOrder(payload);

    if (!result.ok || !result.paymentReference) {
      return NextResponse.json(result, { status: 409 });
    }

    const payment = await initializePayment(
      result.paymentReference,
      payload.amount,
      payload.customerEmail
    );

    return NextResponse.json(
      {
        ...result,
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error while creating checkout';

    return NextResponse.json(
      {
        ok: false,
        status: 'error',
        message,
      },
      { status: 500 }
    );
  }
}
