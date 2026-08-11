'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore, type CartItem as CartItemType } from '@/store/cartStore';
import { formatPrice } from '@/lib/mock-data';
import QuantitySelector from './QuantitySelector';

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
  error: '#EF4444',
  errorBg: '#FEF2F2',
};

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeProduct, updateQuantity } = useCartStore();
  const [removing, setRemoving] = useState(false);

  const lineTotal = item.price * item.quantity;
  const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;

  const handleRemove = () => {
    setRemoving(true);
    // Small delay for animation feel
    setTimeout(() => removeProduct(item.id), 200);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        backgroundColor: colors.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        transition: 'opacity 0.2s',
        opacity: removing ? 0.4 : 1,
      }}
    >
      {/* Product image */}
      <Link
        href={`/products/${item.slug}`}
        style={{
          flexShrink: 0,
          width: '96px',
          height: '96px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.bgLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
        }}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
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
      </Link>

      {/* Product info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Name */}
        <Link href={`/products/${item.slug}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: colors.secondary,
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.name}
          </h3>
        </Link>

        {/* Variant / color */}
        {item.color && (
          <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
            Color: <span style={{ fontWeight: 600 }}>{item.color}</span>
          </p>
        )}

        {/* Unit price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary }}>
            {formatPrice(item.price)}
          </span>
          {item.originalPrice && (
            <span
              style={{ fontSize: '12px', textDecoration: 'line-through', color: colors.textMuted }}
            >
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Bottom row: qty + line total + remove */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '4px',
          }}
        >
          {/* Quantity selector */}
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={99}
            onChange={(qty) => updateQuantity(item.id, qty)}
            size="sm"
          />

          {/* Line total */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, color: colors.secondary }}>
              {formatPrice(lineTotal)}
            </span>
            {savings > 0 && (
              <span style={{ fontSize: '11px', color: colors.primary, fontWeight: 600 }}>
                You save {formatPrice(savings)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Remove button */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start' }}>
        <button
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
          style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            backgroundColor: colors.white,
            color: colors.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.errorBg;
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.error;
            (e.currentTarget as HTMLButtonElement).style.color = colors.error;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.white;
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
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
    </div>
  );
};

export default CartItem;
