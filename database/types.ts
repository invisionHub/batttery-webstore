import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { orderTable } from './schema/order.schema';
import { paymentEventTable } from './schema/payment-event.schema';
import { paymentTable } from './schema/payment.schema';
import { productTable } from './schema/product.schema';

export type Product = InferSelectModel<typeof productTable>;
export type NewProduct = InferInsertModel<typeof productTable>;

export type Order = InferSelectModel<typeof orderTable>;
export type NewOrder = InferInsertModel<typeof orderTable>;

export type Payment = InferSelectModel<typeof paymentTable>;
export type NewPayment = InferInsertModel<typeof paymentTable>;

export type PaymentEvent = InferSelectModel<typeof paymentEventTable>;
export type NewPaymentEvent = InferInsertModel<typeof paymentEventTable>;
