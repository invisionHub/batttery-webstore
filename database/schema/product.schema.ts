import { pgTable, text, numeric, uuid } from 'drizzle-orm/pg-core';

export const productTable = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: text('sku'),
  slug: text('slug'),
  name: text('name'),
  brand: text('brand'),
  category: text('category'),
  subcategory: text('subcategory'),
  price: numeric('price'),
  minPrice: numeric('minPrice'),
  maxPrice: numeric('maxPrice'),
  pricePoints: numeric('pricePoints'),
  shortDescription: text('shortDescription'),
  stockStatus: text('stockStatus'),
  images: text('images'),
});
