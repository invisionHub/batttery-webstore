import { MongoClient } from 'mongodb';
import type { Collection, Db, Document } from 'mongodb';
import { z } from 'zod';
import type { Product } from '@/features/products/types/product.type';

export const MongoProductSchema = z.object({
  sku: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string(),
  price: z.number().min(0),
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  pricePoints: z.number().min(1),
  shortDescription: z.string(),
  stockStatus: z.enum(['In Stock', 'Out of Stock']),
  images: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const OrderSchema = z.object({
  id: z.string().min(1),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(1),
  amount: z.number().min(0),
  payment_reference: z.string().min(1),
  status: z.string().min(1),
  created_at: z.date(),
});

export const OrderItemSchema = z.object({
  id: z.string().min(1),
  order_id: z.string().min(1),
  product_id: z.string().min(1),
  quantity: z.number().int().min(1),
  price_at_purchase: z.number().min(0),
});

export type MongoProduct = z.infer<typeof MongoProductSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

export interface ProductSeedResult {
  database: string;
  collection: string;
  indexedFields: string[];
  inserted: number;
  matched: number;
  modified: number;
}

const DEFAULT_DB_NAME = 'battery-webstore';
const DEFAULT_PRODUCTS_COLLECTION = 'products';
const DEFAULT_ORDERS_COLLECTION = 'orders';
const DEFAULT_ORDER_ITEMS_COLLECTION = 'order_items';

export function getMongoConfig() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required for MongoDB access.');
  }

  return {
    uri,
    dbName: process.env.MONGODB_DB_NAME ?? DEFAULT_DB_NAME,
    productsCollection: process.env.MONGODB_PRODUCTS_COLLECTION ?? DEFAULT_PRODUCTS_COLLECTION,
    ordersCollection: process.env.MONGODB_ORDERS_COLLECTION ?? DEFAULT_ORDERS_COLLECTION,
    orderItemsCollection:
      process.env.MONGODB_ORDER_ITEMS_COLLECTION ?? DEFAULT_ORDER_ITEMS_COLLECTION,
  };
}

export function createMongoClient(uri = getMongoConfig().uri) {
  return new MongoClient(uri);
}

export function getMongoDb(client: MongoClient): Db {
  return client.db(getMongoConfig().dbName);
}

export function getProductsCollection(db: Db): Collection<Document> {
  return db.collection(getMongoConfig().productsCollection);
}

export function getOrdersCollection(db: Db): Collection<Order> {
  return db.collection<Order>(getMongoConfig().ordersCollection);
}

export function getOrderItemsCollection(db: Db): Collection<OrderItem> {
  return db.collection<OrderItem>(getMongoConfig().orderItemsCollection);
}

export async function createProductIndexes(collection: Collection<Document>) {
  await collection.createIndexes([
    {
      key: { sku: 1 },
      unique: true,
    },
    {
      key: { slug: 1 },
    },
    {
      key: { category: 1, subcategory: 1 },
    },
    {
      key: { brand: 1 },
    },
    {
      key: { stockStatus: 1 },
    },
    {
      key: { price: 1 },
    },
    {
      key: { name: 'text', brand: 'text', category: 'text', shortDescription: 'text' },
    },
  ]);
}

export async function createOrderIndexes(collection: Collection<Order>) {
  await collection.createIndexes([
    {
      key: { id: 1 },
      unique: true,
    },
    {
      key: { payment_reference: 1 },
      unique: true,
    },
    {
      key: { customer_email: 1 },
    },
    {
      key: { status: 1 },
    },
    {
      key: { created_at: -1 },
    },
  ]);
}

export async function createOrderItemIndexes(collection: Collection<OrderItem>) {
  await collection.createIndexes([
    {
      key: { id: 1 },
      unique: true,
    },
    {
      key: { order_id: 1 },
    },
    {
      key: { product_id: 1 },
    },
    {
      key: { order_id: 1, product_id: 1 },
    },
  ]);
}

export async function createMongoIndexes(db: Db) {
  await Promise.all([
    createProductIndexes(getProductsCollection(db)),
    createOrderIndexes(getOrdersCollection(db)),
    createOrderItemIndexes(getOrderItemsCollection(db)),
  ]);
}

export async function seedProductsToMongo(products: Product[]): Promise<ProductSeedResult> {
  const config = getMongoConfig();
  const client = createMongoClient(config.uri);

  try {
    await client.connect();

    const db = client.db(config.dbName);
    const collection = getProductsCollection(db);

    await createMongoIndexes(db);

    const now = new Date();
    const result = await collection.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { sku: product.sku },
          update: {
            $set: {
              ...product,
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          upsert: true,
        },
      }))
    );

    return {
      database: config.dbName,
      collection: config.productsCollection,
      indexedFields: [
        'sku',
        'slug',
        'category',
        'subcategory',
        'brand',
        'stockStatus',
        'price',
        'textSearch',
      ],
      inserted: result.upsertedCount,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    };
  } finally {
    await client.close();
  }
}
