import { eq } from 'drizzle-orm';
import { db } from '../../client';
import { paymentTable } from '../../schema/payment.schema';
import { NewPayment, Payment } from '../../types';

export interface PaymentRepository {
  createPayment(payment: NewPayment): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  findById(id: string): Promise<Payment[]>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  findByProviderReference(providerReference: string): Promise<Payment[]>;
  updatePaymentStatus(
    id: string,
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  ): Promise<Payment[]>;
}

const inMemoryPayments: Payment[] = [];

export const paymentRepository: PaymentRepository = {
  createPayment: async (payment) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.insert(paymentTable).values(payment).returning();
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB createPayment failed, saving in-memory:', err);
      }
    }
    const created: Payment = {
      id: payment.id ?? `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      orderId: payment.orderId,
      provider: payment.provider,
      providerReference: payment.providerReference ?? null,
      providerTransactionId: payment.providerTransactionId ?? null,
      amount: payment.amount,
      currency: payment.currency ?? 'NGN',
      status: payment.status ?? 'PENDING',
      paidAt: payment.paidAt ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryPayments.push(created);
    return [created];
  },

  getAllPayments: async () => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.select().from(paymentTable);
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB getAllPayments failed, using in-memory:', err);
      }
    }
    return inMemoryPayments;
  },

  findById: async (id) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.select().from(paymentTable).where(eq(paymentTable.id, id));
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB findById failed, using in-memory:', err);
      }
    }
    return inMemoryPayments.filter((p) => p.id === id);
  },

  findByOrderId: async (orderId) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(paymentTable)
          .where(eq(paymentTable.orderId, orderId));
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB findByOrderId failed, using in-memory:', err);
      }
    }
    return inMemoryPayments.filter((p) => p.orderId === orderId);
  },

  findByProviderReference: async (providerReference) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(paymentTable)
          .where(eq(paymentTable.providerReference, providerReference));
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB findByProviderReference failed, using in-memory:', err);
      }
    }
    return inMemoryPayments.filter((p) => p.providerReference === providerReference);
  },

  updatePaymentStatus: async (id, status) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .update(paymentTable)
          .set({ status, updatedAt: new Date() })
          .where(eq(paymentTable.id, id))
          .returning();
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB updatePaymentStatus failed, using in-memory:', err);
      }
    }
    const payment = inMemoryPayments.find((p) => p.id === id);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date();
      if (status === 'PAID') {
        payment.paidAt = new Date();
      }
      return [payment];
    }
    return [];
  },
};
