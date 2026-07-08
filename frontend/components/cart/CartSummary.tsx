'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/mock-data';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
};

const FREE_DELIVERY_THRESHOLD = 50000;
const SHIPPING_FEE = 3500;
const VAT_RATE = 0.075;

const CartSummary: React.FC = () => {
  const { calculateTotals } = useCartStore();
  const { subtotal, discount, itemCount } = calculateTotals();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const shipping = qualifiesForFreeDelivery ? 0 : SHIPPING_FEE;
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + shipping + vat - promoDiscount;
  const remainingForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'JAVAL10') {
      setPromoDiscount(Math.round(subtotal * 0.1));
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try JAVAL10.');
      setPromoDiscount(0);
      setPromoApplied(false);
    }
  };

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
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.bgLight,
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary, margin: 0 }}>
          Order Summary
        </h2>
        <p style={{ fontSize: '12px', color: colors.textMuted, margin: '2px 0 0 0' }}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Free delivery progress */}
        {!qualifiesForFreeDelivery && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 12px',
              backgroundColor: '#FFF7ED',
              borderRadius: '8px',
              border: '1px solid #FED7AA',
            }}
          >
            <p style={{ fontSize: '12px', color: '#92400E', margin: '0 0 6px 0', fontWeight: 600 }}>
              Add {formatPrice(remainingForFreeDelivery)} more for FREE delivery
            </p>
            <div
              style={{
                height: '6px',
                backgroundColor: '#FED7AA',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%`,
                  backgroundColor: '#F97316',
                  borderRadius: '3px',
                  transition: 'width 0.3s',
                }}
              />
            </div>
          </div>
        )}

        {qualifiesForFreeDelivery && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 12px',
              backgroundColor: colors.successBg,
              borderRadius: '8px',
              border: `1px solid ${colors.successBorder}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill={colors.primary} />
              <path
                d="M8 12l3 3 5-5"
                stroke={colors.white}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p style={{ fontSize: '12px', color: '#15803D', margin: 0, fontWeight: 600 }}>
              You qualify for FREE delivery!
            </p>
          </div>
        )}

        {/* Line items */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>Subtotal</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
              {formatPrice(subtotal)}
            </span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>Product Savings</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary }}>
                -{formatPrice(discount)}
              </span>
            </div>
          )}
          {promoDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>Promo (JAVAL10)</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary }}>
                -{formatPrice(promoDiscount)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>Shipping</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: qualifiesForFreeDelivery ? colors.primary : colors.secondary,
              }}
            >
              {qualifiesForFreeDelivery ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: colors.textMuted }}>VAT (7.5%)</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
              {formatPrice(vat)}
            </span>
          </div>
        </div>

        {/* Promo code */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: colors.secondary,
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Promo Code
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              disabled={promoApplied}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                border: `1px solid ${promoError ? colors.error : colors.border}`,
                borderRadius: '6px',
                color: colors.secondary,
                outline: 'none',
                backgroundColor: promoApplied ? colors.bgLight : colors.white,
              }}
            />
            <button
              onClick={handlePromo}
              disabled={promoApplied || !promoCode}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: promoApplied ? colors.bgLight : colors.primary,
                color: promoApplied ? colors.textMuted : colors.white,
                cursor: promoApplied || !promoCode ? 'not-allowed' : 'pointer',
              }}
            >
              {promoApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
          {promoError && (
            <p style={{ fontSize: '11px', color: colors.error, margin: '4px 0 0 0' }}>
              {promoError}
            </p>
          )}
          {promoApplied && (
            <p
              style={{
                fontSize: '11px',
                color: colors.primary,
                margin: '4px 0 0 0',
                fontWeight: 600,
              }}
            >
              ✓ Promo code applied — 10% off!
            </p>
          )}
        </div>

        {/* Total */}
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            paddingTop: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary }}>
              Total
            </span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: colors.secondary }}>
              {formatPrice(total)}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: colors.textMuted, margin: '4px 0 0 0' }}>
            Including VAT
          </p>
        </div>

        {/* Checkout CTA */}
        <Link
          href="/checkout"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: colors.primary,
            color: colors.white,
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            marginBottom: '10px',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.primaryHover)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.primary)
          }
        >
          Proceed to Checkout
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <Link
          href="/products"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '11px',
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.white,
            color: colors.secondary,
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Continue Shopping
        </Link>

        {/* Payment icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          {['Visa', 'Mastercard', 'PayStack', 'Bank'].map((method) => (
            <div
              key={method}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
              }}
            >
              {method}
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: '11px',
            color: colors.textMuted,
            textAlign: 'center',
            margin: '8px 0 0 0',
          }}
        >
          🔒 Secure checkout — 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
};

export default CartSummary;
