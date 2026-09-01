import { pgTable, text, uuid, decimal } from 'drizzle-orm/pg-core';

export const productTable = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: text('sku'),
  slug: text('slug'),
  name: text('name'),
  brand: text('brand'),
  category: text('category'),
  subcategory: text('subcategory'),
  price: decimal('price'),
  minPrice: decimal('minPrice'),
  maxPrice: decimal('maxPrice'),
  pricePoints: decimal('pricePoints'),
  shortDescription: text('shortDescription'),
  stockStatus: text('stockStatus'),
  images: text('images'),
});
