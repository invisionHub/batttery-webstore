import {
  ensureMongoIndexes,
  getMongoDb,
  getOrderItemsCollection,
  getOrdersCollection,
  type OrderDocument,
  type OrderItemDocument,
  type OrderStatus,
} from '@/lib/database/mongodb.connection';

export type CreateOrderInput = Omit<OrderDocument, 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

export type CreateOrderWithItemsResult = {
  created: boolean;
  order: OrderDocument;
  existingOrder?: OrderDocument | null;
};

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'number' &&
    error.code === 11000
  );
}

export class OrderRepository {
  private async getCollections() {
    await ensureMongoIndexes();
    const db = await getMongoDb();

    return {
      orders: getOrdersCollection(db),
      orderItems: getOrderItemsCollection(db),
    };
  }

  async createOrder(order: CreateOrderInput) {
    const { orders } = await this.getCollections();
    const createdAt = order.created_at ?? new Date();
    const updatedAt = order.updated_at ?? createdAt;

    const document: OrderDocument = {
      ...order,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    return orders.updateOne(
      { id: document.id },
      {
        $set: document,
        $setOnInsert: {
          created_at: createdAt,
        },
      },
      { upsert: true }
    );
  }

  async createOrderItems(orderItems: OrderItemDocument[]) {
    if (orderItems.length === 0) {
      return {
        insertedCount: 0,
        matchedCount: 0,
        modifiedCount: 0,
      };
    }

    const { orderItems: collection } = await this.getCollections();
    const result = await collection.bulkWrite(
      orderItems.map((orderItem) => ({
        updateOne: {
          filter: { id: orderItem.id },
          update: {
            $set: orderItem,
          },
          upsert: true,
        },
      })),
      { ordered: true }
    );

    return {
      insertedCount: result.upsertedCount,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async createOrderWithItems(order: CreateOrderInput, orderItems: OrderItemDocument[]): Promise<CreateOrderWithItemsResult> {
    const { orders, orderItems: orderItemsCollection } = await this.getCollections();
    const createdAt = order.created_at ?? new Date();
    const updatedAt = order.updated_at ?? createdAt;

    const document: OrderDocument = {
      ...order,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    try {
      const orderResult = await orders.updateOne(
        { id: document.id },
        {
          $setOnInsert: document,
        },
        { upsert: true }
      );

      if (orderResult.upsertedCount === 0) {
        const existingOrder = await this.findById(document.id);

        return {
          created: false,
          order: existingOrder ?? document,
          existingOrder,
        };
      }

      if (orderItems.length > 0) {
        await orderItemsCollection.bulkWrite(
          orderItems.map((orderItem) => ({
            updateOne: {
              filter: { id: orderItem.id },
              update: {
                $set: orderItem,
              },
              upsert: true,
            },
          })),
          { ordered: true }
        );
      }

      return {
        created: true,
        order: document,
      };
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }

      const existingOrder =
        (await this.findByIdempotencyKey(document.idempotency_key)) ??
        (await this.findByPaymentReference(document.payment_reference)) ??
        (await this.findById(document.id));

      return {
        created: false,
        order: existingOrder ?? document,
        existingOrder,
      };
    }
  }

  async findAll() {
    const { orders } = await this.getCollections();
    return orders.find({}).sort({ created_at: -1 }).toArray();
  }

  async findById(id: string) {
    const { orders } = await this.getCollections();
    return orders.findOne({ id });
  }

  async findByIdempotencyKey(idempotencyKey: string) {
    const { orders } = await this.getCollections();
    return orders.findOne({ idempotency_key: idempotencyKey });
  }

  async findByPaymentReference(paymentReference: string) {
    const { orders } = await this.getCollections();
    return orders.findOne({ payment_reference: paymentReference });
  }

  async updateStatusById(id: string, status: OrderStatus) {
    const { orders } = await this.getCollections();

    return orders.updateOne(
      { id },
      {
        $set: {
          status,
          updated_at: new Date(),
          ...(status === 'paid' ? { paid_at: new Date() } : {}),
        },
      }
    );
  }

  async updateStatusByPaymentReference(paymentReference: string, status: OrderStatus) {
    const { orders } = await this.getCollections();

    return orders.updateOne(
      { payment_reference: paymentReference },
      {
        $set: {
          status,
          updated_at: new Date(),
          ...(status === 'paid' ? { paid_at: new Date() } : {}),
        },
      }
    );
  }

  async findOrderItemsByOrderId(orderId: string) {
    const { orderItems } = await this.getCollections();
    return orderItems.find({ order_id: orderId }).toArray();
  }

  async findOrderItemById(id: string) {
    const { orderItems } = await this.getCollections();
    return orderItems.findOne({ id });
  }

  async findOrderWithItemsByPaymentReference(paymentReference: string) {
    const { orders, orderItems } = await this.getCollections();
    const order = await orders.findOne({ payment_reference: paymentReference });

    if (!order) {
      return {
        order: null,
        items: [],
      };
    }

    const items = await orderItems.find({ order_id: order.id }).toArray();

    return {
      order,
      items,
    };
  }

  async deleteById(id: string) {
    const { orders } = await this.getCollections();
    return orders.deleteOne({ id });
  }

  async deleteOrderItemById(id: string) {
    const { orderItems } = await this.getCollections();
    return orderItems.deleteOne({ id });
  }

  async countOrders() {
    const { orders } = await this.getCollections();
    return orders.countDocuments({});
  }

  async countOrderItems() {
    const { orderItems } = await this.getCollections();
    return orderItems.countDocuments({});
  }
}

export const orderRepository = new OrderRepository();
