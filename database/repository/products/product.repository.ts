import { eq, inArray } from 'drizzle-orm';

import { db } from '../../client';
import { productTable } from '../../schema/product.schema';
import { NewProduct, Product } from '../../types';

export interface ProductRepository {
  seedProduct(products: NewProduct[]): Promise<void>;
  getAllProducts(): Promise<Product[]>;
  findById(id: string): Promise<Product[]>;
  findByIds(ids: string[]): Promise<Product[]>;
}

export const productRepository: ProductRepository = {
  seedProduct: async (products: NewProduct[]) => {
    await Promise.all(
      products.map((product) => db.insert(productTable).values(product).returning())
    );
  },
  getAllProducts: async () => await db.select().from(productTable),
  findById: async (id: string) =>
    await db.select().from(productTable).where(eq(productTable.id, id)),
  findByIds: async (ids: string[]) =>
    ids.length === 0
      ? []
      : await db.select().from(productTable).where(inArray(productTable.id, ids)),
};
