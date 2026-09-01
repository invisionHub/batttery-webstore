import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { orderTable } from './order.schema';

export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
  'CANCELLED',
]);

export const paymentTable = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .references(() => orderTable.id, { onDelete: 'cascade' })
    .notNull(),
  provider: text('provider').notNull(),
  providerReference: text('provider_reference'),
  providerTransactionId: text('provider_transaction_id'),
  amount: integer('amount').notNull(),
  currency: text('currency').default('NGN').notNull(),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
