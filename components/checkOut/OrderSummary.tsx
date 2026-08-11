'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/mock-data';
import { calculateCheckoutPricing, type DeliveryMethod } from '@/features/checkout/bussiness/pricing';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

interface OrderSummaryProps {
  deliveryMethod?: DeliveryMethod;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ deliveryMethod = 'standard' }) => {
  const { items } = useCartStore();
  const { subtotal, discount, shippingFee, vatAmount, total } = calculateCheckoutPricing(
    items,
    deliveryMethod
  );

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        position: 'sticky',
        top: '88px',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: colors.bgLight,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary, margin: 0 }}>
          Order Summary
        </h2>
        <p style={{ fontSize: '12px', color: colors.textMuted, margin: '2px 0 0 0' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${colors.border}`,
          maxHeight: '240px',
          overflowY: 'auto',
        }}
      >
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                flexShrink: 0,
                borderRadius: '6px',
                backgroundColor: colors.bgLight,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke={colors.border}
                  strokeWidth="1.5"
                />
                <circle cx="8.5" cy="8.5" r="1.5" stroke={colors.textMuted} strokeWidth="1.5" />
                <path
                  d="M21 15l-5-5L5 21"
                  stroke={colors.textMuted}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.secondary,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name}
              </p>
              {item.color && (
                <p style={{ fontSize: '11px', color: colors.textMuted, margin: '1px 0 0 0' }}>
                  Color: {item.color}
                </p>
              )}
              <p style={{ fontSize: '11px', color: colors.textMuted, margin: '1px 0 0 0' }}>
                Qty: {item.quantity}
              </p>
            </div>
            <p
              style={{ fontSize: '12px', fontWeight: 700, color: colors.secondary, flexShrink: 0 }}
            >
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>Subtotal</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
              {formatPrice(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>Savings</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary }}>
                -{formatPrice(discount)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>Shipping</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: shippingFee === 0 ? colors.primary : colors.secondary,
              }}
            >
              {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>VAT (7.5%)</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
              {formatPrice(vatAmount)}
            </span>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary }}>Total</span>
          <span style={{ fontSize: '20px', fontWeight: 900, color: colors.secondary }}>
            {formatPrice(total)}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: colors.textMuted, margin: '4px 0 0 0' }}>
          Including VAT
        </p>

        <Link
          href="/cart"
          style={{
            display: 'block',
            textAlign: 'center',
            fontSize: '12px',
            color: colors.primary,
            textDecoration: 'none',
            marginTop: '12px',
            fontWeight: 600,
          }}
        >
          ← Edit Cart
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
