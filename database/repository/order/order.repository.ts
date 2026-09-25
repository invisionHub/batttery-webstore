import { eq } from 'drizzle-orm';
import { db } from '../../client';
import { orderTable } from '../../schema/order.schema';
import { NewOrder, Order } from '../../types';
import { productRepository } from '../products/product.repository';
import { deliveryConfig } from '@/features/checkout/constants';

export interface OrderItemInput {
  id: string;
  quantity: number;
  color?: string;
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  vatAmount: number;
  total: number;
}

export interface OrderRepository {
  createOrder(order: NewOrder): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  findById(id: string): Promise<Order[]>;
  findByReference(reference: string): Promise<Order[]>;
  updateOrderStatus(
    id: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'REFUNDED'
  ): Promise<Order[]>;
  calculateOrderTotals(
    items: OrderItemInput[],
    deliveryMethod: 'standard' | 'express' | 'pickup'
  ): Promise<OrderTotals>;
}

const toAmount = (value: number) => Math.round(Number(value) || 0);

const inMemoryOrders: Order[] = [];

export const orderRepository: OrderRepository = {
  createOrder: async (order) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.insert(orderTable).values(order).returning();
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB createOrder failed, saving in-memory:', err);
      }
    }
    const created: Order = {
      id: order.id ?? `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      reference: order.reference,
      customerInfo: order.customerInfo,
      amount: order.amount,
      statusEnum: order.statusEnum ?? 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryOrders.push(created);
    return [created];
  },

  getAllOrders: async () => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.select().from(orderTable);
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB getAllOrders failed, using in-memory:', err);
      }
    }
    return inMemoryOrders;
  },

  findById: async (id) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.select().from(orderTable).where(eq(orderTable.id, id));
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB findById failed, using in-memory:', err);
      }
    }
    return inMemoryOrders.filter((o) => o.id === id);
  },

  findByReference: async (reference) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(orderTable)
          .where(eq(orderTable.reference, reference));
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB findByReference failed, using in-memory:', err);
      }
    }
    return inMemoryOrders.filter((o) => o.reference === reference);
  },

  updateOrderStatus: async (id, status) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .update(orderTable)
          .set({ statusEnum: status, updatedAt: new Date() })
          .where(eq(orderTable.id, id))
          .returning();
        if (Array.isArray(rows) && rows.length > 0) return rows;
      } catch (err) {
        console.warn('[AI Studio] DB updateOrderStatus failed, using in-memory:', err);
      }
    }
    const order = inMemoryOrders.find((o) => o.id === id);
    if (order) {
      order.statusEnum = status;
      order.updatedAt = new Date();
      return [order];
    }
    return [];
  },

  calculateOrderTotals: async (items, deliveryMethod) => {
    const productMap = new Map(
      (await productRepository.findByIds(items.map((item) => item.id))).map((product) => [
        product.id,
        product,
      ])
    );

    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error(`Product ${item.id} could not be found in the catalog.`);
      }

      const unitPrice = Number(product.price ?? 0);

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        throw new Error(`Product ${product.name ?? item.id} has an invalid price.`);
      }

      subtotal += unitPrice * item.quantity;
    }

    const deliveryFee = deliveryConfig.delivery[deliveryMethod] ?? 0;
    const vatAmount = toAmount(subtotal * deliveryConfig.VAT);
    const total = toAmount(subtotal + deliveryFee + vatAmount);

    return {
      subtotal: toAmount(subtotal),
      deliveryFee,
      vatAmount,
      total,
    };
  },
};
