import { eq } from 'drizzle-orm';
import { db } from '../../client';
import { orderTable } from '../../schema/order.schema';
import { NewOrder, Order } from '../../types';

export interface OrderRepository {
  createOrder(order: NewOrder): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  findById(id: string): Promise<Order[]>;
  findByReference(reference: string): Promise<Order[]>;
  updateOrderStatus(
    id: string,
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED' | 'REFUNDED'
  ): Promise<Order[]>;
}

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
};
