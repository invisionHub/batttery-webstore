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

export const orderRepository: OrderRepository = {
  createOrder: async (order) => await db.insert(orderTable).values(order).returning(),
  getAllOrders: async () => await db.select().from(orderTable),
  findById: async (id) => await db.select().from(orderTable).where(eq(orderTable.id, id)),
  findByReference: async (reference) =>
    await db.select().from(orderTable).where(eq(orderTable.reference, reference)),
  updateOrderStatus: async (id, status) =>
    await db
      .update(orderTable)
      .set({ statusEnum: status, updatedAt: new Date() })
      .where(eq(orderTable.id, id))
      .returning(),
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
