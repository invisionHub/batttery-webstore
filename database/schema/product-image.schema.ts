import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  decimal,
  pgEnum,
  index,
  uniqueIndex,
  integer,
} from 'drizzle-orm/pg-core';
import { productTable } from './product.schema';
import { eq } from 'drizzle-orm';

// If you are declearing a value globally unique you don't need to add the index again
export const imageStatusEnum = pgEnum('image_status', [
  'PENDING',
  'SEARCHING',
  'FOUND',
  'UPLOADING',
  'UPLOADED',
  'REVIEW_REQUIRED',
  'NOT_FOUND',
  'FAILED',
]);

export const productImageTable = pgTable(
  'products_image_table',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    productId: text('product_id')
      .references(() => productTable.id)
      .notNull(),
    cloudinaryPublicId: text('cloudinary_public_id').notNull(),
    cloudinaryUrl: text('cloudinary_url').notNull(),
    sourceUrl: text('source_url').notNull(),
    source: text('source'),
    confidenceScore: decimal('confidence_score', {
      precision: 5,
      scale: 4,
    }).notNull(),
    status: imageStatusEnum('status').default('PENDING').notNull(),
    altText: text('alt_text'),
    sortOrder: integer('sort_order').notNull(),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    isPrimaryUnique: uniqueIndex('is_primary_unique')
      .on(table.productId)
      .where(eq(table.isPrimary, true)),
    productIdIndex: index('product_id_index').on(table.productId),
    cloudinaryPublicidIndex: index('cloudinary_public_id_index').on(table.cloudinaryPublicId),
    statusIndex: index('status_index').on(table.status),
  })
);
