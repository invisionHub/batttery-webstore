import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { productTable } from './schema/product.schema';

export type Product = InferSelectModel<typeof productTable>;
export type NewProduct = InferInsertModel<typeof productTable>;
