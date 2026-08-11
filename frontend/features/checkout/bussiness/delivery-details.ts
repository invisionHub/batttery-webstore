import {
  FREE_DELIVERY_THRESHOLD,
  SHIPPING_FEES,
  VAT_RATE,
  type DeliveryMethod,
} from './pricing';

export const deliveryDetails = (deliveryMethod: DeliveryMethod, subtotal: number) => {
  const shipping =
    deliveryMethod === 'pickup'
      ? 0
      : subtotal >= FREE_DELIVERY_THRESHOLD
        ? 0
        : SHIPPING_FEES[deliveryMethod];

  return subtotal + shipping + Math.round(subtotal * VAT_RATE);
};
