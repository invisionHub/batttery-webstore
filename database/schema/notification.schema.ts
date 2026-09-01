import { integer, json, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const notificationJobStatusEnum = pgEnum('notification_job_status', [
  'QUEUED',
  'AVAILABLE',
  'SENT',
  'FAILED',
  'CANCELLED',
]);

export const emailDeliveryStatusEnum = pgEnum('email_delivery_status', [
  'QUEUED',
  'SENT',
  'FAILED',
  'CANCELLED',
]);

export const notificationJobTable = pgTable('notification_jobs', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  type: text('type').notNull(),
  recipient: text('recipient').notNull(),
  payload: json('payload').notNull(),
  status: notificationJobStatusEnum('status').default('QUEUED').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  availableAt: timestamp('available_at').defaultNow().notNull(),
  lastError: text('last_error'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const emailDeliveryTable = pgTable('email_deliveries', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  notificationJobId: uuid('notification_job_id')
    .references(() => notificationJobTable.id, { onDelete: 'cascade' })
    .notNull(),
  provider: text('provider').notNull(),
  providerMessageId: text('provider_message_id'),
  status: emailDeliveryStatusEnum('status').default('QUEUED').notNull(),
  attempts: integer('attempts').default(0).notNull(),
  lastError: text('last_error'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
