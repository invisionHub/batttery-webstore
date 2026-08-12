'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  success: '#166534',
  warning: '#92400E',
};

type CheckoutResultState = {
  loading: boolean;
  ok: boolean;
  title: string;
  description: string;
  orderId?: string;
};

export default function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') ?? '';
  const paymentStatus = searchParams.get('status') ?? '';
  const orderIdFromQuery = searchParams.get('orderId') ?? undefined;

  const initialState = useMemo<CheckoutResultState>(() => {
    if (paymentStatus === 'mock') {
      return {
        loading: true,
        ok: true,
        title: 'Confirming your payment...',
        description:
          'Please wait while we verify your payment and process your confirmation email.',
        orderId: orderIdFromQuery,
      };
    }

    return {
      loading: true,
      ok: true,
      title: 'Verifying your payment...',
      description:
        'Please wait while we confirm your Paystack payment and process your confirmation email.',
      orderId: orderIdFromQuery,
    };
  }, [orderIdFromQuery, paymentStatus]);

  const [state, setState] = useState<CheckoutResultState>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function verifyPayment() {
      if (!reference) {
        setState({
          loading: false,
          ok: false,
          title: 'Missing payment reference',
          description: 'We could not verify your payment because the payment reference is missing.',
          orderId: orderIdFromQuery,
        });
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/callback?reference=${encodeURIComponent(reference)}`
        );
        const result = (await response.json()) as {
          ok: boolean;
          message: string;
          orderId?: string;
          orderStatus?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok || !result.ok) {
          setState({
            loading: false,
            ok: false,
            title: 'Payment verification failed',
            description:
              result.message || 'We could not verify your payment yet. Please contact support.',
            orderId: result.orderId ?? orderIdFromQuery,
          });
          return;
        }

        const paid = result.orderStatus === 'paid';

        setState({
          loading: false,
          ok: true,
          title: paid ? 'Payment confirmed' : 'Payment pending',
          description: paid
            ? 'Your payment has been verified successfully and your confirmation email has been processed.'
            : result.message,
          orderId: result.orderId ?? orderIdFromQuery,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState({
          loading: false,
          ok: false,
          title: 'Payment verification failed',
          description:
            error instanceof Error
              ? error.message
              : 'We could not verify your payment yet. Please contact support.',
          orderId: orderIdFromQuery,
        });
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [orderIdFromQuery, reference]);

  return (
    <div
      style={{
        backgroundColor: colors.bgLight,
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: state.ok ? '#F0FDF4' : '#FEF2F2',
            border: `2px solid ${state.ok ? '#BBF7D0' : '#FECACA'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
          }}
        >
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={state.ok ? colors.primary : '#DC2626'} />
            {state.ok ? (
              <path
                d="M8 12l3 3 5-5"
                stroke={colors.white}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M9 9l6 6m0-6l-6 6"
                stroke={colors.white}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            color: colors.secondary,
            margin: '0 0 8px 0',
          }}
        >
          {state.title}
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: colors.textMuted,
            margin: '0 0 8px 0',
            lineHeight: 1.7,
          }}
        >
          {state.description}
        </p>
        {reference && (
          <p
            style={{
              fontSize: '13px',
              color: colors.textMuted,
              margin: '0 0 8px 0',
            }}
          >
            Payment reference: {reference}
          </p>
        )}
        {state.orderId && (
          <p
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: state.ok ? colors.success : colors.warning,
              margin: '0 0 28px 0',
            }}
          >
            Order #{state.orderId}
          </p>
        )}
        {state.loading && (
          <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 28px 0' }}>
            Processing...
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/products"
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.white,
              color: colors.secondary,
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
