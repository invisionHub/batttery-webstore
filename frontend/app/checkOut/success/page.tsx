'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export default function CheckoutSuccessPage() {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrderNumber(`JVL-${Date.now().toString().slice(-6)}`);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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
          maxWidth: '480px',
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
            backgroundColor: '#F0FDF4',
            border: '2px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
          }}
        >
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={colors.primary} />
            <path
              d="M8 12l3 3 5-5"
              stroke={colors.white}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
          Order Placed Successfully!
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: colors.textMuted,
            margin: '0 0 8px 0',
            lineHeight: 1.7,
          }}
        >
          Thank you for your order. We will send a confirmation to your email shortly.
        </p>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: colors.secondary,
            margin: '0 0 28px 0',
          }}
        >
          Order #{orderNumber}
        </p>
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
