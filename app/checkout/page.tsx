import { createOrderAction } from '@/features/checkout/actions/create-order-actions';
import CheckoutView from '@/features/checkout/view/checkout-view';

export default async function CheckoutPage() {
  return (
    <div>
      <CheckoutView createOrderAction={createOrderAction} />
    </div>
  );
}
