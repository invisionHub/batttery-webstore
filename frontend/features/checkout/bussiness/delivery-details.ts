import { deliveryConfig } from '../constants';
export const deliveryDetails = (deliveryMethod: string, subtotal: number) => {
    const shipping = deliveryMethod === 'pickup' ? 0 : subtotal >= 50000 ? 0 : (deliveryConfig.SHIPPING[ deliveryMethod ] ?? 3500);
    const total = subtotal + shipping + Math.round(subtotal * deliveryConfig.VAT);

    return total
}
