'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import CartItem from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export default function CartPage() {
  const { items, clearCart, calculateTotals } = useCartStore();
  const { itemCount } = calculateTotals();

  // ── Empty cart state ──
  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: colors.bgLight, minHeight: '70vh' }}>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ paddingTop: '60px', paddingBottom: '60px' }}
        >
          {/* Breadcrumb */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: colors.textMuted,
              marginBottom: '32px',
            }}
          >
            <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
              Home
            </Link>
            <span>/</span>
            <span style={{ color: colors.secondary, fontWeight: 600 }}>Cart</span>
          </nav>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '20px',
              padding: '60px 24px',
              backgroundColor: colors.white,
              borderRadius: '16px',
              border: `1px dashed ${colors.border}`,
            }}
          >
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
              <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                stroke={colors.border}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                stroke={colors.border}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M16 10a4 4 0 01-8 0"
                stroke={colors.primary}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: colors.secondary,
                  margin: '0 0 8px 0',
                }}
              >
                Your cart is empty
              </h1>
              <p
                style={{ fontSize: '14px', color: colors.textMuted, margin: 0, maxWidth: '360px' }}
              >
                Looks like you have not added anything yet. Browse our products and find something
                you love.
              </p>
            </div>
            <div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
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
                Shop Now
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
            alignItems: 'center',
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
          <span style={{ color: colors.secondary, fontWeight: 600 }}>Cart</span>
        </nav>

        {/* Page header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
              Your Cart
            </h1>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: '4px 0 0 0' }}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={clearCart}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#EF4444',
              background: 'none',
              border: '1px solid #FECACA',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FEF2F2';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
          >
            Clear Cart
          </button>
        </div>

        {/* Main layout: items + summary */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: '24px', alignItems: 'flex-start' }}
        >
          {/* Cart items — takes 2/3 width on desktop */}
          <div
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Continue shopping link */}
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: colors.primary,
                textDecoration: 'none',
                marginTop: '4px',
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order summary — sticky on desktop */}
          <div>
            <CartSummary />
          </div>
        </div>

        {/* You may also like — small prompt */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 20px',
            backgroundColor: colors.white,
            borderRadius: '10px',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: colors.secondary, margin: 0 }}>
              Complete your setup
            </p>
            <p style={{ fontSize: '12px', color: colors.textMuted, margin: '2px 0 0 0' }}>
              Customers who bought these also loved these products
            </p>
          </div>
          <Link
            href="/products"
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
