import { MongoClient } from 'mongodb';
import type { Collection, Db, Document, WithId } from 'mongodb';
import { z } from 'zod';
import type { Product } from '@/features/products/types/product.type';

const DEFAULT_DB_NAME = 'battery-webstore';
const DEFAULT_PRODUCTS_COLLECTION = 'products';
const DEFAULT_ORDERS_COLLECTION = 'orders';
const DEFAULT_ORDER_ITEMS_COLLECTION = 'order_items';

const mongoGlobals = globalThis as typeof globalThis & {
  __batteryStoreMongoClientPromise?: Promise<MongoClient>;
  __batteryStoreMongoIndexesPromise?: Promise<void>;
};

export const OrderStatusSchema = z.enum(['pending', 'paid', 'failed', 'cancelled']);
export const DeliveryMethodSchema = z.enum(['standard', 'express', 'pickup']);
export const PaymentMethodSchema = z.enum(['card', 'bank_transfer', 'ussd']);

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
  idempotency_key: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  delivery_method: DeliveryMethodSchema,
  payment_method: PaymentMethodSchema,
  payment_reference: z.string().min(1),
  payment_provider: z.literal('paystack'),
  currency: z.literal('NGN'),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  shipping_fee: z.number().min(0),
  vat_amount: z.number().min(0),
  amount: z.number().min(0),
  item_count: z.number().int().min(0),
  notes: z.string().max(500).optional(),
  status: OrderStatusSchema,
  created_at: z.date(),
  updated_at: z.date(),
  paid_at: z.date().optional(),
});

export const OrderItemSchema = z.object({
  id: z.string().min(1),
  order_id: z.string().min(1),
  product_id: z.string().min(1),
  product_slug: z.string().min(1).optional(),
  product_name: z.string().min(1),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
  price_at_purchase: z.number().min(0),
  line_total: z.number().min(0),
  color: z.string().optional(),
  image: z.string().optional(),
});

export type MongoProduct = z.infer<typeof MongoProductSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type DeliveryMethod = z.infer<typeof DeliveryMethodSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

export type ProductDocument = MongoProduct & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderDocument = Order;
export type OrderItemDocument = OrderItem;
export type ProductRecord = WithId<ProductDocument>;

export interface ProductSeedResult {
  database: string;
  collection: string;
  indexedFields: string[];
  inserted: number;
  matched: number;
  modified: number;
}

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

async function getMongoClient() {
  if (!mongoGlobals.__batteryStoreMongoClientPromise) {
    mongoGlobals.__batteryStoreMongoClientPromise = createMongoClient().connect();
  }

  return mongoGlobals.__batteryStoreMongoClientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(getMongoConfig().dbName);
}

export function getProductsCollection(db: Db): Collection<ProductDocument> {
  return db.collection<ProductDocument>(getMongoConfig().productsCollection);
}

export function getOrdersCollection(db: Db): Collection<OrderDocument> {
  return db.collection<OrderDocument>(getMongoConfig().ordersCollection);
}

export function getOrderItemsCollection(db: Db): Collection<OrderItemDocument> {
  return db.collection<OrderItemDocument>(getMongoConfig().orderItemsCollection);
}

type MongoIndexDirection = 1 | -1 | 'text';
type MongoIndexKey = Record<string, MongoIndexDirection>;

type MongoIndexSpec = {
  key: MongoIndexKey;
  unique?: boolean;
  name?: string;
};

type ExistingMongoIndex = {
  key: MongoIndexKey;
  unique?: boolean;
};

function serializeIndexKey(key: MongoIndexKey) {
  return Object.entries(key)
    .sort(([leftField], [rightField]) => leftField.localeCompare(rightField))
    .map(([field, value]) => `${field}:${String(value)}`)
    .join('|');
}

function hasEquivalentIndex(
  existingIndex: ExistingMongoIndex,
  desiredKey: MongoIndexKey,
  desiredUnique?: boolean
) {
  const existingKey = existingIndex.key;

  if (Object.keys(existingKey).length !== Object.keys(desiredKey).length) {
    return false;
  }

  const sameKey = serializeIndexKey(existingKey) === serializeIndexKey(desiredKey);
  const sameUnique = Boolean(existingIndex.unique) === Boolean(desiredUnique);

  return sameKey && sameUnique;
}

async function createMissingIndexes<TSchema extends Document>(
  collection: Collection<TSchema>,
  indexSpecs: MongoIndexSpec[]
) {
  let existingIndexes: unknown[] = [];

  try {
    existingIndexes = await collection.indexes();
  } catch (error: unknown) {
    const isNamespaceNotFound =
      error instanceof Error &&
      ('code' in error ? (error as { code?: number }).code === 26 : false);

    if (!isNamespaceNotFound) {
      throw error;
    }
  }

  const missingIndexes = indexSpecs.filter((indexSpec) => {
    return !existingIndexes.some((existingIndex) =>
      hasEquivalentIndex(existingIndex as ExistingMongoIndex, indexSpec.key, indexSpec.unique)
    );
  });

  if (missingIndexes.length > 0) {
    const indexDescriptions = missingIndexes as Parameters<Collection<TSchema>['createIndexes']>[0];
    await collection.createIndexes(indexDescriptions);
  }
}

export async function createProductIndexes(collection: Collection<ProductDocument>) {
  await createMissingIndexes(collection, [
    { key: { sku: 1 }, unique: true, name: 'product_sku_unique' },
    { key: { slug: 1 }, unique: true, name: 'product_slug_unique' },
    { key: { category: 1, subcategory: 1 }, name: 'product_category_subcategory' },
    { key: { brand: 1 }, name: 'product_brand' },
    { key: { stockStatus: 1 }, name: 'product_stock_status' },
    { key: { price: 1 }, name: 'product_price' },
    {
      key: { name: 'text', brand: 'text', category: 'text', shortDescription: 'text' },
    },
  ]);
}

export async function createOrderIndexes(collection: Collection<OrderDocument>) {
  await createMissingIndexes(collection, [
    { key: { id: 1 }, unique: true, name: 'order_id_unique' },
    { key: { idempotency_key: 1 }, unique: true, name: 'order_idempotency_key_unique' },
    { key: { payment_reference: 1 }, unique: true, name: 'order_payment_reference_unique' },
    { key: { customer_email: 1 }, name: 'order_customer_email' },
    { key: { status: 1 }, name: 'order_status' },
    { key: { created_at: -1 }, name: 'order_created_at_desc' },
  ]);
}

export async function createOrderItemIndexes(collection: Collection<OrderItemDocument>) {
  await createMissingIndexes(collection, [
    { key: { id: 1 }, unique: true, name: 'order_item_id_unique' },
    { key: { order_id: 1 }, name: 'order_item_order_id' },
    { key: { product_id: 1 }, name: 'order_item_product_id' },
    { key: { order_id: 1, product_id: 1 }, name: 'order_item_order_product' },
  ]);
}

export async function createMongoIndexes(db: Db) {
  await Promise.all([
    createProductIndexes(getProductsCollection(db)),
    createOrderIndexes(getOrdersCollection(db)),
    createOrderItemIndexes(getOrderItemsCollection(db)),
  ]);
}

export async function ensureMongoIndexes() {
  if (!mongoGlobals.__batteryStoreMongoIndexesPromise) {
    mongoGlobals.__batteryStoreMongoIndexesPromise = (async () => {
      const db = await getMongoDb();
      await createMongoIndexes(db);
    })();
  }

  await mongoGlobals.__batteryStoreMongoIndexesPromise;
}

export async function seedProductsToMongo(products: Product[]): Promise<ProductSeedResult> {
  await ensureMongoIndexes();

  const db = await getMongoDb();
  const collection = getProductsCollection(db);
  const config = getMongoConfig();
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
}
