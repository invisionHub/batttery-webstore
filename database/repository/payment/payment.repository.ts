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

export const paymentRepository: PaymentRepository = {
  createPayment: async (payment) => await db.insert(paymentTable).values(payment).returning(),
  getAllPayments: async () => await db.select().from(paymentTable),
  findById: async (id) => await db.select().from(paymentTable).where(eq(paymentTable.id, id)),
  findByOrderId: async (orderId) =>
    await db.select().from(paymentTable).where(eq(paymentTable.orderId, orderId)),
  findByProviderReference: async (providerReference) =>
    await db
      .select()
      .from(paymentTable)
      .where(eq(paymentTable.providerReference, providerReference)),
  updatePaymentStatus: async (id, status) =>
    await db
      .update(paymentTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(paymentTable.id, id))
      .returning(),
};
