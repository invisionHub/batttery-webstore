import { NextResponse } from 'next/server';
import { handlePaymentCallback } from '@/lib/payments';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference') ?? '';

  if (!reference) {
    return NextResponse.json({ ok: false, message: 'Missing payment reference.' }, { status: 400 });
  }

  const result = await handlePaymentCallback(reference);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
