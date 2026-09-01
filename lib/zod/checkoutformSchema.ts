import { z } from 'zod';

import {
  checkoutDefaultValues,
  checkoutSchema,
  deliveryMethodOptions,
  paymentMethodOptions,
  nigerianStates,
} from '../../schemas/checkoutSchema';

export {
  checkoutDefaultValues,
  checkoutSchema,
  deliveryMethodOptions,
  paymentMethodOptions,
  nigerianStates,
};

export type { CheckoutFormData } from '../../schemas/checkoutSchema';

const cartItemSchema = z.object({
  id: z.string().min(1, 'Product id is required.'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
  color: z.string().optional(),
});

export const createOrderInputSchema = checkoutSchema.extend({
  items: z.array(cartItemSchema).min(1, 'Your cart is empty.'),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;
