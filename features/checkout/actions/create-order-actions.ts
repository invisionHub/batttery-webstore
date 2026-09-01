'use server';

import { orderRepository } from '@/database/repository/order/order.repository';
import { createOrderInputSchema, type CreateOrderInput } from '@/lib/zod/checkoutformSchema';

export async function createOrderAction(input: CreateOrderInput) {
  const parsedInput = createOrderInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = parsedInput.error.issues[0];
    throw new Error(firstError?.message ?? 'Invalid order payload.');
  }

  const { items, ...customerInfo } = parsedInput.data;

  const { subtotal, deliveryFee, vatAmount, total } = await orderRepository.calculateOrderTotals(
    items,
    parsedInput.data.deliveryMethod
  );

  const orderReference = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const order = await orderRepository.createOrder({
    reference: orderReference,
    customerInfo: {
      ...customerInfo,
      items: items.map(({ id, quantity, color }) => ({ id, quantity, color })),
      totals: {
        subtotal,
        deliveryFee,
        vatAmount,
        total,
      },
    },
    amount: total,
    statusEnum: 'PENDING',
  });

  const createdOrder = order[0];

  if (!createdOrder) {
    throw new Error('Order creation failed. No order was returned from the database.');
  }

  return {
    ok: true,
    orderId: createdOrder.id,
    reference: createdOrder.reference,
    amount: createdOrder.amount,
    subtotal,
    deliveryFee,
    vatAmount,
    total,
    message: 'Order created successfully.',
  };
}
