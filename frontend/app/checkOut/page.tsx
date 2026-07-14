'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  checkoutSchema,
  checkoutDefaultValues,
  type CheckoutFormData,
} from '@/schemas/checkoutSchema';
import { useCartStore } from '@/store/cartStore';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentButton from '@/components/checkout/PaymentButton';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
};

const VAT = 0.075;
const SHIPPING: Record<string, number> = { standard: 3500, express: 7000, pickup: 0 };
const steps = ['Cart', 'Checkout', 'Confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, calculateTotals, clearCart } = useCartStore();
  const { subtotal } = calculateTotals();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: checkoutDefaultValues,
    mode: 'onBlur',
  });

  const deliveryMethod = methods.watch('deliveryMethod');
  const paymentMethod = methods.watch('paymentMethod');
  const shipping =
    deliveryMethod === 'pickup' ? 0 : subtotal >= 50000 ? 0 : (SHIPPING[deliveryMethod] ?? 3500);
  const total = subtotal + shipping + Math.round(subtotal * VAT);

  const onSubmit = methods.handleSubmit(() => {
    setIsLoading(true);
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 2000);
  });

  if (items.length === 0) {
    return (
      <div
        style={{
          backgroundColor: colors.bgLight,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: colors.secondary,
              marginBottom: '16px',
            }}
          >
            Your cart is empty
          </p>
          <Link
            href="/products"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '24px', paddingBottom: '56px' }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            gap: '6px',
            fontSize: '12px',
            color: colors.textMuted,
            marginBottom: '20px',
          }}
        >
          <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Cart
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>Checkout</span>
        </nav>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: i <= 1 ? colors.primary : colors.border,
                    color: i <= 1 ? colors.white : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: i === 1 ? 700 : 400,
                    color: i === 1 ? colors.secondary : colors.textMuted,
                  }}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-8 sm:w-16"
                  style={{
                    height: '2px',
                    backgroundColor: i === 0 ? colors.primary : colors.border,
                    margin: '0 4px 16px 4px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Validation error summary */}
        {Object.keys(methods.formState.errors).length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '13px', color: colors.error, margin: 0, fontWeight: 600 }}>
              Please fix the errors below before continuing.
            </p>
          </div>
        )}

        {/* Main layout */}
        <FormProvider {...methods}>
          <div
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: '24px', alignItems: 'flex-start' }}
          >
            <div
              className="lg:col-span-2"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <CheckoutForm />
              <PaymentButton
                isLoading={isLoading}
                isDisabled={items.length === 0}
                total={total}
                paymentMethod={paymentMethod}
                onSubmit={onSubmit}
              />
            </div>
            <div>
              <OrderSummary deliveryMethod={deliveryMethod} />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
