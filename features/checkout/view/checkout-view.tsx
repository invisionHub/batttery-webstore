'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  checkoutDefaultValues,
  checkoutSchema,
  type CheckoutFormData,
} from '@/schemas/checkoutSchema';
import type { CreateOrderInput } from '@/lib/zod/checkoutformSchema';

import { useCheckOut } from '../hook/useCheckOut';
import { deliveryConfig } from '../constants';
import { StepIndicator } from '../components/checkout/StepIndicator';
import { FormErrorFormat } from '../components/checkout/FormErrorFormat';
import { CheckOutForm } from '../components/checkout/CheckOutForm';
import { CheckOutLayout } from '../components/checkout/CheckOutLayout';

interface CheckoutViewProps {
  createOrderAction: (input: CreateOrderInput) => Promise<{
    ok: boolean;
    orderId?: string;
    paymentReference?: string;
    message?: string;
    payment?: { status?: string; paymentUrl?: string };
    status?: string;
  }>;
}

export default function CheckoutView({ createOrderAction }: CheckoutViewProps) {
  const { isLoading, items, router, subtotal, setIsLoading } = useCheckOut();
  const { steps, delivery } = deliveryConfig;

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as unknown as Resolver<CheckoutFormData>,
    defaultValues: checkoutDefaultValues,
    mode: 'onBlur',
  });

  const deliveryMethod = methods.watch('deliveryMethod');
  const paymentMethod = methods.watch('paymentMethod');

  const total = deliveryMethod ? delivery[deliveryMethod] + subtotal : subtotal;

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
      const result = await createOrderAction({
        ...values,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          color: item.color,
        })),
      });

      if (!result.ok) {
        methods.setError('root', {
          type: 'server',
          message: result.message || 'Unable to create your order right now.',
        });
        return;
      }

      if (result.payment?.paymentUrl) {
        window.location.assign(result.payment.paymentUrl);
        return;
      }

      if (result.status === 'pending' || result.payment?.status === 'pending') {
        const pendingUrl = new URL('/checkOut/success', window.location.origin);
        pendingUrl.searchParams.set('reference', result.paymentReference ?? '');

        if (result.orderId) {
          pendingUrl.searchParams.set('orderId', result.orderId);
        }

        pendingUrl.searchParams.set('status', 'pending');
        router.push(`${pendingUrl.pathname}${pendingUrl.search}`);
        return;
      }

      const successUrl = new URL('/checkOut/success', window.location.origin);
      successUrl.searchParams.set('reference', result.paymentReference ?? '');

      if (result.orderId) {
        successUrl.searchParams.set('orderId', result.orderId);
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
        pricing={{ subTotal: subtotal, total, deliveryPrice: delivery[deliveryMethod] }}
      />
    </CheckOutLayout>
  );
}
