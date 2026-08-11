import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkoutSchema } from '@/schemas/checkoutSchema';
import { createPendingOrder } from '@/lib/checkout';
import { initializePayment } from '@/lib/payments';

const checkoutItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().optional(),
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  image: z.string().optional(),
  quantity: z.coerce.number().int().min(1),
  color: z.string().optional(),
});

const checkoutRequestSchema = checkoutSchema.extend({
  items: z.array(checkoutItemSchema).min(1, 'At least one cart item is required'),
  paymentReference: z.string().optional(),
  idempotencyKey: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          status: 'error',
          message: 'Checkout payload is invalid.',
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await createPendingOrder(parsed.data);

    if (!result.ok || !result.paymentReference || typeof result.amount !== 'number') {
      const statusCode = result.status === 'exists' ? 409 : 500;
      return NextResponse.json(result, { status: statusCode });
    }

    const origin = new URL(request.url).origin;
    const payment = await initializePayment(result.paymentReference, result.amount, parsed.data.email, {
      origin,
      paymentMethod: parsed.data.paymentMethod,
      orderId: result.orderId,
    });

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
