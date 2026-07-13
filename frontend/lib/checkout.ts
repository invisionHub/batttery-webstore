import crypto from 'node:crypto';
import {
  createOrder,
  createOrderItems,
  getOrderById,
  getOrderByPaymentReference,
} from '@/lib/repository';
import type { Order, OrderItem } from '@/lib/mongodb';

export type CheckoutStatus = 'pending' | 'exists' | 'error';

export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  items: CheckoutItem[];
  paymentReference?: string;
  idempotencyKey?: string;
  shippingAddress?: string;
  notes?: string;
};

export type PendingOrderResult = {
  ok: boolean;
  orderId?: string;
  status: CheckoutStatus;
  message: string;
  paymentReference?: string;
  idempotencyKey?: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getOrderIdempotencyKey(
  proposedKey?: string,
  payload?: Partial<CheckoutPayload>
): string {
  if (proposedKey) {
    return proposedKey;
  }

  const seedSource = [
    payload?.customerEmail ?? '',
    payload?.customerPhone ?? '',
    payload?.amount?.toString() ?? '',
    (payload?.items ?? []).map((item) => `${item.id}:${item.quantity}`).join('|'),
  ].join('|');

  return `checkout:${crypto.createHash('sha256').update(seedSource).digest('hex')}`;
}

function createOrderReference() {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createPendingOrder(payload: CheckoutPayload): Promise<PendingOrderResult> {
  try {
    const normalizedEmail = normalize(payload.customerEmail);
    const idempotencyKey = getOrderIdempotencyKey(payload.idempotencyKey, payload);
    const paymentReference = payload.paymentReference ?? createOrderReference();
    const orderId = idempotencyKey || createOrderReference();

    const existingOrderById = await getOrderById(orderId);
    if (existingOrderById) {
      return {
        ok: false,
        status: 'exists',
        message: 'This checkout has already been submitted.',
        paymentReference,
        idempotencyKey,
      };
    }

    const existingOrderByPaymentReference = await getOrderByPaymentReference(paymentReference);
    if (existingOrderByPaymentReference) {
      return {
        ok: false,
        status: 'exists',
        message: 'A similar order already exists for this payment reference.',
        paymentReference,
        idempotencyKey,
      };
    }

    const order: Order = {
      id: orderId,
      customer_name: payload.customerName,
      customer_email: normalizedEmail,
      customer_phone: payload.customerPhone,
      amount: payload.amount,
      payment_reference: paymentReference,
      status: 'pending',
      created_at: new Date(),
    };

    await createOrder(order);

    const orderItems: OrderItem[] = payload.items.map((item, index) => ({
      id: `${orderId}-${index + 1}`,
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    await createOrderItems(orderItems);

    return {
      ok: true,
      orderId,
      status: 'pending',
      message: 'Checkout created successfully.',
      paymentReference,
      idempotencyKey,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order';
    return {
      ok: false,
      status: 'error',
      message,
    };
  }
}
