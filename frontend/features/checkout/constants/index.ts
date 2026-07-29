

export const deliveryConfig = {
    VAT: 0.075,
    SHIPPING: { standard: 3500, express: 7000, pickup: 0 } as Record<string, number>,
    steps: [ 'Cart', 'Checkout', 'Confirmation' ]
};


