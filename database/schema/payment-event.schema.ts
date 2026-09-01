import { boolean, json, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { paymentTable } from './payment.schema';

export const paymentEventTypeEnum = pgEnum('payment_event_type', [
  'INITIATED',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'REFUNDED',
  'REVERSED',
  'PENDING',
]);

export const paymentEventTable = pgTable('payment_events', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  paymentId: uuid('payment_id')
    .references(() => paymentTable.id, { onDelete: 'cascade' })
    .notNull(),
  provider: text('provider').notNull(),
  eventId: text('event_id').notNull(),
  eventType: paymentEventTypeEnum('event_type').notNull(),
  reference: text('reference'),
  payload: json('payload'),
  processed: boolean('processed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
});
