export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export type CheckoutPricingItem = {
  price: number;
  originalPrice?: number;
  quantity: number;
};

export const VAT_RATE = 0.075;
export const SHIPPING_FEES: Record<DeliveryMethod, number> = {
  standard: 3500,
  express: 7000,
  pickup: 0,
};
export const FREE_DELIVERY_THRESHOLD = 50000;

export function calculateCheckoutPricing(
  items: CheckoutPricingItem[],
  deliveryMethod: DeliveryMethod
) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => {
    if (!item.originalPrice) {
      return sum;
    }

    return sum + Math.max(item.originalPrice - item.price, 0) * item.quantity;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee =
    deliveryMethod === 'pickup'
      ? 0
      : subtotal >= FREE_DELIVERY_THRESHOLD
        ? 0
        : SHIPPING_FEES[deliveryMethod];
  const vatAmount = Math.round(subtotal * VAT_RATE);
  const total = subtotal + shippingFee + vatAmount;

  return {
    subtotal,
    discount,
    itemCount,
    shippingFee,
    vatAmount,
    total,
  };
}
