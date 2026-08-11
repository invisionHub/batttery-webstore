'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice } from '@/lib/mock-data';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
};

// ─────────────────────────────────────────
// CART ITEM ROW
// ─────────────────────────────────────────
const CartItemRow = ({ item }: { item: ReturnType<typeof useCartStore.getState>['items'][0] }) => {
  const { removeProduct, updateQuantity } = useCartStore();

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 0',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: '64px',
          height: '64px',
          flexShrink: 0,
          borderRadius: '8px',
          backgroundColor: colors.bgLight,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
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

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: colors.secondary,
            margin: 0,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.name}
        </p>

        {item.color && (
          <p style={{ fontSize: '11px', color: colors.textMuted, margin: 0 }}>
            Color: {item.color}
          </p>
        )}

        <p style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary, margin: 0 }}>
          {formatPrice(item.price)}
        </p>

        {/* Quantity stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            marginTop: '4px',
            width: 'fit-content',
          }}
        >
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            style={{
              width: '28px',
              height: '28px',
              border: `1px solid ${colors.border}`,
              borderRight: 'none',
              borderRadius: '6px 0 0 6px',
              backgroundColor: colors.white,
              color: colors.secondary,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            −
          </button>
          <span
            style={{
              width: '32px',
              height: '28px',
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: colors.secondary,
            }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
            style={{
              width: '28px',
              height: '28px',
              border: `1px solid ${colors.border}`,
              borderLeft: 'none',
              borderRadius: '0 6px 6px 0',
              backgroundColor: colors.white,
              color: colors.secondary,
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeProduct(item.id)}
        aria-label="Remove item"
        style={{
          flexShrink: 0,
          width: '28px',
          height: '28px',
          border: 'none',
          backgroundColor: 'transparent',
          color: colors.textMuted,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.errorBg;
          (e.currentTarget as HTMLButtonElement).style.color = colors.error;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted;
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
          <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" strokeLinecap="round" />
          <path d="M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────
const CartDrawer: React.FC = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, calculateTotals, clearCart } = useCartStore();
  const { subtotal, discount, itemCount, total } = calculateTotals();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    if (isCartDrawerOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          backgroundColor: 'rgba(13,27,42,0.5)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          zIndex: 50,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: colors.white,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'javal-slide-left 0.25s ease',
        }}
      >
        <style>{`
          @keyframes javal-slide-left {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* ── Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg
              width="20"
              height="20"
              fill="none"
              stroke={colors.secondary}
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: '16px', fontWeight: 800, color: colors.secondary }}>
              Your Cart
            </span>
            {itemCount > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCartDrawer}
            aria-label="Close cart"
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              backgroundColor: colors.white,
              color: colors.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Items list ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {items.length === 0 ? (
            // Empty state
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '16px',
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
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
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: colors.secondary,
                    margin: '0 0 6px 0',
                  }}
                >
                  Your cart is empty
                </p>
                <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
                  Add some products to get started
                </p>
              </div>
              <button
                onClick={closeCartDrawer}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  backgroundColor: colors.primary,
                  color: colors.white,
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}

              {/* Clear cart */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.error,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 0',
                  }}
                >
                  Remove all items
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Footer: Order summary + CTA ── */}
        {items.length > 0 && (
          <div
            style={{
              flexShrink: 0,
              padding: '16px 20px',
              borderTop: `1px solid ${colors.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              backgroundColor: colors.white,
            }}
          >
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>Subtotal</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: colors.textMuted }}>Savings</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary }}>
                  -{formatPrice(discount)}
                </span>
              </div>
            )}

            {/* Shipping note */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>Shipping</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.primary }}>
                Calculated at checkout
              </span>
            </div>

            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '10px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}
              >
                <span style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary }}>
                  Total
                </span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: colors.secondary }}>
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkOut"
                onClick={closeCartDrawer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '13px',
                  borderRadius: '8px',
                  backgroundColor: colors.primary,
                  color: colors.white,
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginBottom: '8px',
                }}
              >
                Proceed to Checkout →
              </Link>

              {/* Continue shopping */}
              <button
                onClick={closeCartDrawer}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.white,
                  color: colors.secondary,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
