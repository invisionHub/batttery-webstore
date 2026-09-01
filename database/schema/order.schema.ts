import { pgTable, uuid, text, integer, pgEnum, timestamp, json } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status-enum', [
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REVERSED',
  'REFUNDED',
]);

export const orderTable = pgTable('order-table', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  reference: text('reference').unique().notNull(),
  customerInfo: json('custmer_info').notNull(),
  amount: integer('amount').notNull(),
  statusEnum: statusEnum('status-enum').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
