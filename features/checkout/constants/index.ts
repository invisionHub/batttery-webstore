export const deliveryConfig = {
  VAT: 0.075,
  delivery: { standard: 3500, express: 7000, pickup: 0 },
  steps: ['Cart', 'Checkout', 'Confirmation'],
};

export type TDeliveryConfig = typeof deliveryConfig;
