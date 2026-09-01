import { createOrderAction } from '@/features/checkout/actions/create-order-actions';
import CheckoutView from '@/features/checkout/view/checkout-view';

const CheckOutPage = async () => {
  return (
    <div>
      <CheckoutView createOrderAction={createOrderAction} />
    </div>
  );
};

export default CheckOutPage;
