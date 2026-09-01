import { createHmac, timingSafeEqual } from 'crypto';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/database/client';
import { orderTable } from '@/database/schema/order.schema';
import { paymentEventTable } from '@/database/schema/payment-event.schema';
import { paymentTable } from '@/database/schema/payment.schema';
import { paymentEventRepository } from '@/database/repository/payment-event/payment-event.repository';
import { paymentRepository } from '@/database/repository/payment/payment.repository';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? '';

function getPaystackSignature(body: string) {
  return createHmac('sha512', PAYSTACK_SECRET_KEY).update(body, 'utf8').digest('hex');
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { ok: false, message: 'Paystack secret key is not configured.' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('x-paystack-signature') ?? '';
  const expectedSignature = getPaystackSignature(rawBody);
  const isValidSignature =
    signature.length > 0 && timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValidSignature) {
    return NextResponse.json(
      { ok: false, message: 'Invalid Paystack signature.' },
      { status: 401 }
    );
  }

  let payload;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const event = payload?.event;
  const data = payload?.data ?? {};
  const reference = String(data.reference ?? '');
  const eventId = String(data.id ?? `${event}-${Date.now()}`);

  if (!event || !reference) {
    return NextResponse.json(
      { ok: false, message: 'Missing Paystack event payload.' },
      { status: 400 }
    );
  }

  const existingPayments = await paymentRepository.findByProviderReference(reference);
  const payment = existingPayments[0];

  if (!payment) {
    return NextResponse.json(
      { ok: false, message: 'Payment not found for the provided reference.' },
      { status: 404 }
    );
  }

  const existingEvents = await paymentEventRepository.findByPaymentId(payment.id);
  const duplicateEvent = existingEvents.find((item) => item.eventId === eventId);

  if (duplicateEvent) {
    return NextResponse.json({ ok: true, message: 'Event already processed.' });
  }

  const normalizedEventType =
    event === 'charge.success' ? 'CAPTURED' : event === 'charge.failed' ? 'FAILED' : 'PENDING';

  const normalizedPaymentStatus =
    event === 'charge.success' ? 'PAID' : event === 'charge.failed' ? 'FAILED' : 'PENDING';

  const normalizedOrderStatus =
    normalizedPaymentStatus === 'PAID'
      ? 'SUCCESS'
      : normalizedPaymentStatus === 'FAILED'
        ? 'FAILED'
        : 'PENDING';

  await db.transaction(async (tx) => {
    await tx.insert(paymentEventTable).values({
      paymentId: payment.id,
      provider: 'paystack',
      eventId,
      eventType: normalizedEventType,
      reference,
      payload: data,
      processed: true,
      processedAt: new Date(),
    });

    if (normalizedPaymentStatus !== 'PENDING') {
      await tx
        .update(paymentTable)
        .set({ status: normalizedPaymentStatus, updatedAt: new Date() })
        .where(eq(paymentTable.id, payment.id));

      await tx
        .update(orderTable)
        .set({
          statusEnum: normalizedOrderStatus,
          updatedAt: new Date(),
        })
        .where(eq(orderTable.id, payment.orderId));
    }
  });

  return NextResponse.json({ ok: true, message: 'Webhook processed successfully.' });
}
