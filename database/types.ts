import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

import {
  productImageTable,
  productTable,
  orderTable,
  paymentTable,
  paymentEventTable,
} from './schema/index';

export type Product = InferSelectModel<typeof productTable>;
export type NewProduct = InferInsertModel<typeof productTable>;

export type Order = InferSelectModel<typeof orderTable>;
export type NewOrder = InferInsertModel<typeof orderTable>;

export type Payment = InferSelectModel<typeof paymentTable>;
export type NewPayment = InferInsertModel<typeof paymentTable>;

export type PaymentEvent = InferSelectModel<typeof paymentEventTable>;
export type NewPaymentEvent = InferInsertModel<typeof paymentEventTable>;

export type ProductImage = InferSelectModel<typeof productImageTable>;
export type NewProductImage = InferInsertModel<typeof productImageTable>;
