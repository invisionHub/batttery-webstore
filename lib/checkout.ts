import crypto from 'node:crypto';
import { calculateCheckoutPricing } from '@/features/checkout/bussiness/pricing';
import { orderRepository } from '@/lib/repositories';
import type {
  DeliveryMethod,
  OrderDocument,
  OrderItemDocument,
  PaymentMethod,
} from '@/lib/database/mongodb.connection';

export type CheckoutStatus = 'pending' | 'exists' | 'error';

export type CheckoutItem = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  quantity: number;
  color?: string;
};

export type CheckoutPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  items: CheckoutItem[];
  paymentReference?: string;
  idempotencyKey?: string;
  notes?: string;
};

export type PendingOrderResult = {
  ok: boolean;
  orderId?: string;
  status: CheckoutStatus;
  message: string;
  paymentReference?: string;
  idempotencyKey?: string;
  amount?: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function createOrderReference(prefix: 'ORD' | 'PAY') {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export function getOrderIdempotencyKey(
  proposedKey?: string,
  payload?: Partial<CheckoutPayload>
): string {
  if (proposedKey) {
    return proposedKey;
  }

  const seedSource = [
    payload?.firstName ?? '',
    payload?.lastName ?? '',
    payload?.email ?? '',
    payload?.phone ?? '',
    payload?.deliveryMethod ?? '',
    (payload?.items ?? [])
      .map((item) => `${item.id}:${item.quantity}:${item.price}:${item.color ?? ''}`)
      .join('|'),
  ].join('|');

  return `checkout:${crypto.createHash('sha256').update(seedSource).digest('hex')}`;
}

function createOrderDocument(payload: CheckoutPayload): {
  order: OrderDocument;
  orderItems: OrderItemDocument[];
} {
  const normalizedEmail = normalize(payload.email);
  const idempotencyKey = getOrderIdempotencyKey(payload.idempotencyKey, payload);
  const paymentReference = payload.paymentReference ?? createOrderReference('PAY');
  const orderId = createOrderReference('ORD');
  const pricing = calculateCheckoutPricing(payload.items, payload.deliveryMethod);
  const createdAt = new Date();
  const customerName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();

  const order: OrderDocument = {
    id: orderId,
    idempotency_key: idempotencyKey,
    first_name: payload.firstName.trim(),
    last_name: payload.lastName.trim(),
    customer_name: customerName,
    customer_email: normalizedEmail,
    customer_phone: payload.phone.trim(),
    address: payload.address.trim(),
    city: payload.city.trim(),
    state: payload.state.trim(),
    delivery_method: payload.deliveryMethod,
    payment_method: payload.paymentMethod,
    payment_reference: paymentReference,
    payment_provider: 'paystack',
    currency: 'NGN',
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping_fee: pricing.shippingFee,
    vat_amount: pricing.vatAmount,
    amount: pricing.total,
    item_count: pricing.itemCount,
    notes: payload.notes?.trim() || undefined,
    status: 'pending',
    created_at: createdAt,
    updated_at: createdAt,
  };

  const orderItems: OrderItemDocument[] = payload.items.map((item, index) => ({
    id: `${orderId}-${index + 1}`,
    order_id: orderId,
    product_id: item.id,
    product_slug: item.slug,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    price_at_purchase: item.price,
    line_total: item.price * item.quantity,
    color: item.color,
    image: item.image,
  }));

  return {
    order,
    orderItems,
  };
}

export async function createPendingOrder(payload: CheckoutPayload): Promise<PendingOrderResult> {
  try {
    if (payload.items.length === 0) {
      return {
        ok: false,
        status: 'error',
        message: 'Cannot create an order without at least one item.',
      };
    }

    const { order, orderItems } = createOrderDocument(payload);
    const result = await orderRepository.createOrderWithItems(order, orderItems);

    if (!result.created) {
      return {
        ok: false,
        status: 'exists',
        message: 'This checkout has already been submitted.',
        orderId: result.order.id,
        paymentReference: result.order.payment_reference,
        idempotencyKey: result.order.idempotency_key,
        amount: result.order.amount,
      };
    }

    return {
      ok: true,
      orderId: order.id,
      status: 'pending',
      message: 'Checkout created successfully.',
      paymentReference: order.payment_reference,
      idempotencyKey: order.idempotency_key,
      amount: order.amount,
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
