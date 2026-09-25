/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';

import { db } from '@/database/client';
import { orderTable } from '@/database/schema/order.schema';
import { paymentTable } from '@/database/schema/payment.schema';
import { paymentRepository } from '@/database/repository/payment/payment.repository';

import { createPaystackAdapter } from './paystack-adapter';
import type { InitializePaymentInput, PaymentProvider, VerifyPaymentResult } from './types';

export interface PaymentServiceInitializeInput extends InitializePaymentInput {
  orderId: string;
  orderReference: string;
  customerName?: string;
}

export class PaymentService {
  constructor(private readonly provider: PaymentProvider) {}

  async initializePayment(input: PaymentServiceInitializeInput) {
    const initialization = await this.provider.initialize({
      email: input.email,
      amount: input.amount,
      reference: input.reference,
      callbackUrl: input.callbackUrl,
      metadata: {
        ...(input.metadata ?? {}),
        orderId: input.orderId,
        orderReference: input.orderReference,
        customerName: input.customerName ?? '',
      },
    });

    if (!initialization.ok || !initialization.authorizationUrl) {
      return {
        ok: false,
        message: initialization.message || 'Unable to initialize payment.',
        paymentReference: input.reference,
      };
    }

    const savedPayment = await paymentRepository.createPayment({
      orderId: input.orderId,
      provider: 'paystack',
      providerReference: input.reference,
      providerTransactionId: initialization.accessCode ?? null,
      amount: input.amount,
      currency: 'NGN',
      status: 'PENDING',
      paidAt: null,
    });

    return {
      ok: true,
      paymentReference: input.reference,
      paymentId: savedPayment[0]?.id,
      paymentUrl: initialization.authorizationUrl,
      status: 'pending',
      message: 'Payment initialized successfully.',
      raw: initialization.raw,
    };
  }

  async verifyPayment(reference: string): Promise<
    VerifyPaymentResult & {
      paymentStatus?: string;
      orderStatus?: 'paid' | 'pending' | 'failed';
      orderId?: string;
    }
  > {
    const verification = await this.provider.verify(reference);

    if (!verification.ok) {
      return {
        ...verification,
        paymentStatus: 'PENDING',
        orderStatus: 'pending',
      };
    }

    const matchingPayments = await paymentRepository.findByProviderReference(reference);
    const payment = matchingPayments[0];

    if (!payment) {
      return {
        ...verification,
        paymentStatus: 'PENDING',
        orderStatus: 'pending',
      };
    }

    const mappedStatus =
      verification.status === 'success'
        ? 'PAID'
        : verification.status === 'failed'
          ? 'FAILED'
          : verification.status === 'abandoned'
            ? 'CANCELLED'
            : 'PENDING';

    const normalizedOrderStatus =
      mappedStatus === 'PAID' ? 'paid' : mappedStatus === 'FAILED' ? 'failed' : 'pending';

    if (mappedStatus !== 'PENDING') {
      await db.transaction(async (tx: any) => {
        await tx
          .update(paymentTable)
          .set({ status: mappedStatus, updatedAt: new Date() })
          .where(eq(paymentTable.id, payment.id));

        await tx
          .update(orderTable)
          .set({
            statusEnum: mappedStatus === 'PAID' ? 'SUCCESS' : 'FAILED',
            updatedAt: new Date(),
          })
          .where(eq(orderTable.id, payment.orderId));
      });
    }

    return {
      ...verification,
      orderId: payment.orderId,
      paymentStatus: mappedStatus,
      orderStatus: normalizedOrderStatus,
    };
  }
}

export function createPaymentService(provider?: PaymentProvider) {
  return new PaymentService(provider ?? createPaystackAdapter());
}
