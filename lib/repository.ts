import type { Product } from '@/features/products/types/product.type';
import { productRepository, orderRepository } from '@/lib/repositories';
export type {
  ProductDocument,
  ProductRecord,
  Order,
  OrderDocument,
  OrderItem,
  OrderItemDocument,
} from '@/lib/database/mongodb.connection';

export async function ensureMongoIndexes() {
  const { ensureMongoIndexes } = await import('@/lib/database/mongodb.connection');
  return ensureMongoIndexes();
}

export async function seedProducts(products: Product[]) {
  return productRepository.seedProducts(products);
}

export async function createProduct(product: Product) {
  return productRepository.create(product);
}

export async function updateProductBySku(
  sku: string,
  partial: Partial<import('@/lib/database/mongodb.connection').ProductDocument>
) {
  return productRepository.updateBySku(sku, partial);
}

export async function getAllProducts() {
  return productRepository.findAll();
}

export async function getProductBySku(sku: string) {
  return productRepository.findBySku(sku);
}

export async function getProductBySlug(slug: string) {
  return productRepository.findBySlug(slug);
}

export async function deleteProductBySku(sku: string) {
  return productRepository.deleteBySku(sku);
}

export async function createOrder(
  order: Omit<import('@/lib/database/mongodb.connection').OrderDocument, 'created_at' | 'updated_at'> & {
    created_at?: Date;
    updated_at?: Date;
  }
) {
  return orderRepository.createOrder(order);
}

export async function getAllOrders() {
  return orderRepository.findAll();
}

export async function getOrderById(id: string) {
  return orderRepository.findById(id);
}

export async function getOrderByPaymentReference(paymentReference: string) {
  return orderRepository.findByPaymentReference(paymentReference);
}

export async function updateOrderStatus(
  id: string,
  status: import('@/lib/database/mongodb.connection').OrderStatus
) {
  return orderRepository.updateStatusById(id, status);
}

export async function deleteOrderById(id: string) {
  return orderRepository.deleteById(id);
}

export async function createOrderItem(orderItem: import('@/lib/database/mongodb.connection').OrderItemDocument) {
  return orderRepository.createOrderItems([orderItem]);
}

export async function createOrderItems(orderItems: import('@/lib/database/mongodb.connection').OrderItemDocument[]) {
  return orderRepository.createOrderItems(orderItems);
}

export async function getAllOrderItems() {
  const orders = await orderRepository.findAll();
  const items = await Promise.all(
    orders.map((order: import('@/lib/database/mongodb.connection').OrderDocument) =>
      orderRepository.findOrderItemsByOrderId(order.id)
    )
  );
  return items.flat();
}

export async function getOrderItemsByOrderId(orderId: string) {
  return orderRepository.findOrderItemsByOrderId(orderId);
}

export async function getOrderItemById(id: string) {
  return orderRepository.findOrderItemById(id);
}

export async function deleteOrderItemById(id: string) {
  return orderRepository.deleteOrderItemById(id);
}

export async function getProductCount() {
  return productRepository.count();
}

export async function getOrderCount() {
  return orderRepository.countOrders();
}

export async function getOrderItemCount() {
  return orderRepository.countOrderItems();
}
