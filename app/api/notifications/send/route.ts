import { NextResponse } from 'next/server';
import { sendOrderEmailNotifications } from '@/lib/notifications';
import type { Order, OrderItem } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = body.order as Order;
    const items = (body.items ?? []) as OrderItem[];

    const result = await sendOrderEmailNotifications(order, items);

    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error while sending notifications';

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
