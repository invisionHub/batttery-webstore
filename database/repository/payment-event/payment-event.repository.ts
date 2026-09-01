import { eq } from 'drizzle-orm';
import { db } from '../../client';
import { paymentEventTable } from '../../schema/payment-event.schema';
import { NewPaymentEvent, PaymentEvent } from '../../types';

export interface PaymentEventRepository {
  createPaymentEvent(event: NewPaymentEvent): Promise<PaymentEvent[]>;
  getAllPaymentEvents(): Promise<PaymentEvent[]>;
  findById(id: string): Promise<PaymentEvent[]>;
  findByPaymentId(paymentId: string): Promise<PaymentEvent[]>;
  findUnprocessedEvents(): Promise<PaymentEvent[]>;
  markAsProcessed(id: string): Promise<PaymentEvent[]>;
}

export const paymentEventRepository: PaymentEventRepository = {
  createPaymentEvent: async (event) => await db.insert(paymentEventTable).values(event).returning(),
  getAllPaymentEvents: async () => await db.select().from(paymentEventTable),
  findById: async (id) =>
    await db.select().from(paymentEventTable).where(eq(paymentEventTable.id, id)),
  findByPaymentId: async (paymentId) =>
    await db.select().from(paymentEventTable).where(eq(paymentEventTable.paymentId, paymentId)),
  findUnprocessedEvents: async () =>
    await db.select().from(paymentEventTable).where(eq(paymentEventTable.processed, false)),
  markAsProcessed: async (id) =>
    await db
      .update(paymentEventTable)
      .set({ processed: true, processedAt: new Date() })
      .where(eq(paymentEventTable.id, id))
      .returning(),
};
