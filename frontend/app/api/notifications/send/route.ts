import { NextResponse } from 'next/server';
import { buildOrderEmailPayloads } from '@/lib/notifications';
import type { Order, OrderItem } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = body.order as Order;
    const items = (body.items ?? []) as OrderItem[];

    const payloads = buildOrderEmailPayloads(order, items);

    return NextResponse.json({ ok: true, payloads });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected error while building notifications';

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
