import type { WithId } from 'mongodb';
import { createMongoClient, createMongoIndexes, getMongoConfig, getMongoDb, getOrderItemsCollection, getOrdersCollection, getProductsCollection, type MongoProduct, type Order, type OrderItem } from '@/lib/mongodb';
import type { Product } from '@/features/products/types/product.type';

export type ProductDocument = MongoProduct & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderDocument = Order;
export type OrderItemDocument = OrderItem;

async function withMongoContext<T>(handler: (collections: {
  products: ReturnType<typeof getProductsCollection>;
  orders: ReturnType<typeof getOrdersCollection>;
  orderItems: ReturnType<typeof getOrderItemsCollection>;
}) => Promise<T>): Promise<T> {
  const config = getMongoConfig();
  const client = createMongoClient(config.uri);

  try {
    await client.connect();

    const db = getMongoDb(client);

    return handler({
      products: getProductsCollection(db),
      orders: getOrdersCollection(db),
      orderItems: getOrderItemsCollection(db),
    });
  } finally {
    await client.close();
  }
}

export async function ensureMongoIndexes() {
  const config = getMongoConfig();
  const client = createMongoClient(config.uri);

  try {
    await client.connect();
    await createMongoIndexes(getMongoDb(client));
  } finally {
    await client.close();
  }
}

export async function seedProducts(products: Product[]) {
  const config = getMongoConfig();
  const client = createMongoClient(config.uri);

  try {
    await client.connect();

    const db = getMongoDb(client);
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
      })),
    );

    return {
      database: config.dbName,
      collection: config.productsCollection,
      indexedFields: ['sku', 'slug', 'category', 'subcategory', 'brand', 'stockStatus', 'price', 'textSearch'],
      inserted: result.upsertedCount,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    };
  } finally {
    await client.close();
  }
}

export async function createProduct(product: Product) {
  return withMongoContext(async ({ products }) => {
    const now = new Date();
    const result = await products.updateOne(
      { sku: product.sku },
      {
        $set: {
          ...product,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );

    return result;
  });
}

export async function updateProductBySku(sku: string, partial: Partial<ProductDocument>) {
  return withMongoContext(async ({ products }) => {
    const result = await products.updateOne(
      { sku },
      {
        $set: {
          ...partial,
          updatedAt: new Date(),
        },
      },
    );

    return result;
  });
}

export async function getAllProducts() {
  return withMongoContext(async ({ products }) => {
    return products.find({}).sort({ createdAt: -1 }).toArray();
  });
}

export async function getProductBySku(sku: string) {
  return withMongoContext(async ({ products }) => {
    return products.findOne({ sku });
  });
}

export async function getProductBySlug(slug: string) {
  return withMongoContext(async ({ products }) => {
    return products.findOne({ slug });
  });
}

export async function deleteProductBySku(sku: string) {
  return withMongoContext(async ({ products }) => {
    return products.deleteOne({ sku });
  });
}

export async function createOrder(order: Omit<Order, 'created_at'> & { created_at?: Date }) {
  return withMongoContext(async ({ orders }) => {
    const createdAt = order.created_at ?? new Date();
    const document: Order = {
      ...order,
      created_at: createdAt,
    };

    const result = await orders.updateOne(
      { id: document.id },
      {
        $set: document,
        $setOnInsert: {
          created_at: createdAt,
        },
      },
      { upsert: true },
    );

    return result;
  });
}

export async function getAllOrders() {
  return withMongoContext(async ({ orders }) => {
    return orders.find({}).sort({ created_at: -1 }).toArray();
  });
}

export async function getOrderById(id: string) {
  return withMongoContext(async ({ orders }) => {
    return orders.findOne({ id });
  });
}

export async function getOrderByPaymentReference(paymentReference: string) {
  return withMongoContext(async ({ orders }) => {
    return orders.findOne({ payment_reference: paymentReference });
  });
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  return withMongoContext(async ({ orders }) => {
    return orders.updateOne(
      { id },
      {
        $set: {
          status,
        },
      },
    );
  });
}

export async function deleteOrderById(id: string) {
  return withMongoContext(async ({ orders }) => {
    return orders.deleteOne({ id });
  });
}

export async function createOrderItem(orderItem: OrderItem) {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.updateOne(
      { id: orderItem.id },
      {
        $set: orderItem,
      },
      { upsert: true },
    );
  });
}

export async function createOrderItems(orderItems: OrderItem[]) {
  return withMongoContext(async ({ orderItems: collection }) => {
    let inserted = 0;
    let matched = 0;
    let modified = 0;

    for (const orderItem of orderItems) {
      const result = await collection.updateOne(
        { id: orderItem.id },
        {
          $set: orderItem,
        },
        { upsert: true },
      );

      inserted += result.upsertedCount;
      matched += result.matchedCount;
      modified += result.modifiedCount;
    }

    return {
      insertedCount: inserted,
      matchedCount: matched,
      modifiedCount: modified,
    };
  });
}

export async function getAllOrderItems() {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.find({}).toArray();
  });
}

export async function getOrderItemsByOrderId(orderId: string) {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.find({ order_id: orderId }).toArray();
  });
}

export async function getOrderItemById(id: string) {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.findOne({ id });
  });
}

export async function deleteOrderItemById(id: string) {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.deleteOne({ id });
  });
}

export async function getProductCount() {
  return withMongoContext(async ({ products }) => {
    return products.countDocuments({});
  });
}

export async function getOrderCount() {
  return withMongoContext(async ({ orders }) => {
    return orders.countDocuments({});
  });
}

export async function getOrderItemCount() {
  return withMongoContext(async ({ orderItems }) => {
    return orderItems.countDocuments({});
  });
}

export type ProductRecord = WithId<ProductDocument>;
