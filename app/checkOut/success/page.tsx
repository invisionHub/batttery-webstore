import { Suspense } from 'react';
import CheckoutSuccessView from '@/features/checkout/view/checkout-success-view';

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}
        >
          Loading payment status...
        </div>
      }
    >
      <CheckoutSuccessView />
    </Suspense>
  );
}
