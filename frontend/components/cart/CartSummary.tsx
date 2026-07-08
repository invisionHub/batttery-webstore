'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CartSummary() {
  const { calculateTotals, clearCart } = useCartStore();
  const { subtotal, discount, itemCount, total } = calculateTotals();

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0D1B2A' }}>
        Order Summary
      </h2>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        <span>Items ({itemCount})</span>
        <span>₦{subtotal.toLocaleString('en-NG')}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        <span>Discount</span>
        <span>₦{discount.toLocaleString('en-NG')}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: 800,
          color: '#0D1B2A',
        }}
      >
        <span>Total</span>
        <span>₦{total.toLocaleString('en-NG')}</span>
      </div>

      <Link
        href="/checkout"
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#22C55E',
          color: '#fff',
          textAlign: 'center',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        Proceed to Checkout
      </Link>

      <button
        onClick={clearCart}
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: '1px solid #FECACA',
          backgroundColor: '#FEF2F2',
          color: '#EF4444',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Clear Cart
      </button>
    </div>
  );
}
