import { db } from '../../client';
import { productTable } from '../../schema/product.schema';
import { NewProduct } from '../../types';
import { eq } from 'drizzle-orm';

export const productRepository = {
  seedProduct: async (products: NewProduct[]) =>
    await db.insert(productTable).values(products).returning(),
  getAllProducts: async () => await db.select().from(productTable),
  findById: async (id: string) =>
    await db.select().from(productTable).where(eq(productTable.id, id)),
};
