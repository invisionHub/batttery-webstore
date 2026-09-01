'use server';

import { orderRepository } from '@/database/repository/order/order.repository';
import { createPaymentService } from '@/lib/payments';
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

  const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const paymentService = createPaymentService();

  const paymentInitialization = await paymentService.initializePayment({
    orderId: createdOrder.id,
    orderReference: createdOrder.reference,
    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
    email: customerInfo.email,
    amount: total,
    reference: paymentReference,
    callbackUrl: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/checkOut/success`,
    metadata: {
      orderId: createdOrder.id,
      orderReference: createdOrder.reference,
    },
  });

  if (!paymentInitialization.ok || !paymentInitialization.paymentUrl) {
    await orderRepository.updateOrderStatus(createdOrder.id, 'FAILED');

    return {
      ok: false,
      orderId: createdOrder.id,
      message: paymentInitialization.message || 'Unable to initialize payment for this order.',
    };
  }

  return {
    ok: true,
    orderId: createdOrder.id,
    reference: createdOrder.reference,
    paymentReference: paymentReference,
    amount: createdOrder.amount,
    subtotal,
    deliveryFee,
    vatAmount,
    total,
    payment: {
      paymentUrl: paymentInitialization.paymentUrl,
      status: paymentInitialization.status,
      paymentId: paymentInitialization.paymentId,
    },
    status: 'pending',
    message: 'Order created successfully and payment initialization started.',
  };
}
