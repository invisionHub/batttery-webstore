'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  checkoutSchema,
  checkoutDefaultValues,
  type CheckoutFormData,
} from '@/schemas/checkoutSchema';
import { useCheckOut } from '../hook/useCheckOut';
import { deliveryConfig } from '../constants';
import { StepIndicator } from '../components/checkout/StepIndicator';
import { FormErrorFormat } from '../components/checkout/FormErrorFormat';
import { CheckOutForm } from '../components/checkout/CheckOutForm';
import { CheckOutLayout } from '../components/checkout/CheckOutLayout';
import { calculateCheckoutPricing } from '../bussiness/pricing';

export default function CheckoutView() {
  const { isLoading, items, router, subtotal, clearCart, setIsLoading } = useCheckOut();
  const { steps } = deliveryConfig;

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema as never),
    defaultValues: checkoutDefaultValues,
    mode: 'onBlur',
  });

  const deliveryMethod = methods.watch('deliveryMethod');
  const paymentMethod = methods.watch('paymentMethod');
  const total = calculateCheckoutPricing(items, deliveryMethod).total;

  const onSubmit = methods.handleSubmit(async (values) => {
    if (items.length === 0) {
      methods.setError('root', {
        type: 'manual',
        message: 'Your cart is empty. Add at least one item before checking out.',
      });
      return;
    }

    setIsLoading(true);
    methods.clearErrors('root');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          items,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        orderId?: string;
        payment?: { paymentUrl?: string; status?: string };
        paymentReference?: string;
      };

      if (!response.ok || !result.ok) {
        methods.setError('root', {
          type: 'server',
          message: result.message || 'Unable to create your order right now.',
        });
        return;
      }

      clearCart();

      if (result.payment?.paymentUrl) {
        window.location.assign(result.payment.paymentUrl);
        return;
      }

      const successUrl = new URL('/checkOut/success', window.location.origin);
      successUrl.searchParams.set('reference', result.paymentReference ?? '');

      if (result.orderId) {
        successUrl.searchParams.set('orderId', result.orderId);
      }

      if (result.payment?.status === 'pending') {
        successUrl.searchParams.set('status', 'pending');
      }

      router.push(`${successUrl.pathname}${successUrl.search}`);
    } catch (error) {
      methods.setError('root', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Unable to create your order right now.',
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <CheckOutLayout>
      <StepIndicator steps={steps} />
      <FormErrorFormat errors={methods.formState.errors} />
      <CheckOutForm
        deliveryMethod={deliveryMethod}
        paymentMethod={paymentMethod}
        isLoading={isLoading}
        methods={methods}
        onSubmit={onSubmit}
        total={total}
      />
    </CheckOutLayout>
  );
}
