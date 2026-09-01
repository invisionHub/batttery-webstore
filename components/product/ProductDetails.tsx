'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Product } from '@/database/types';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  badgeSale: '#EF4444',
  badgeNew: '#3B82F6',
  badgeBest: '#F59E0B',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
};

const colorOptions = [
  { name: 'Matte Black', hex: '#1a1a1a' },
  { name: 'Pearl White', hex: '#F5F5F5' },
  { name: 'Champagne Gold', hex: '#C9A876' },
];

interface ProductDetailsProps {
  product: Product;
  className?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, className = '' }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  // ── Zustand store hooks ──
  const addProduct = useCartStore((state) => state.addProduct);
  const isInCart = useCartStore((state) => state.isInCart);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const inCart = isInCart(product.id);

  // ── Add to Cart — now wired to Zustand ──
  const handleAddToCart = () => {
    addProduct(product, quantity, colorOptions[selectedColor].name);
    openCartDrawer(); // slide open the cart drawer immediately
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Badge + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: colors.primary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {product.brand}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '26px',
          fontWeight: 800,
          color: colors.secondary,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {product.name}
      </h1>

      {/* Rating */}

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '30px', fontWeight: 900, color: colors.secondary }}>
          {product.price}
        </span>
      </div>

      {/* Stock status */}

      {/* Description */}
      <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.7, margin: 0 }}>
        {product.shortDescription}
      </p>

      <hr style={{ border: 'none', borderTop: `1px solid ${colors.border}`, margin: '4px 0' }} />

      {/* Color selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary }}>
          Color:{' '}
          <span style={{ fontWeight: 400, color: colors.textMuted }}>
            {colorOptions[selectedColor].name}
          </span>
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          {colorOptions.map((color, i) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(i)}
              aria-label={`Select ${color.name}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: color.hex,
                border: `2px solid ${selectedColor === i ? colors.primary : 'transparent'}`,
                outline: selectedColor === i ? 'none' : `1px solid ${colors.border}`,
                outlineOffset: '2px',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Quantity + Add to Cart */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '4px',
        }}
      >
        {/* Quantity stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: `1.5px solid ${colors.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            style={{
              width: '36px',
              height: '40px',
              border: 'none',
              backgroundColor: colors.white,
              color: colors.secondary,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            −
          </button>
          <span
            style={{
              width: '40px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: colors.secondary,
            }}
          >
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            style={{
              width: '36px',
              height: '40px',
              border: 'none',
              backgroundColor: colors.white,
              color: colors.secondary,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>

        {/* Add to Cart — wired to cartStore */}
        <button
          onClick={handleAddToCart}
          style={{
            flex: 1,
            minWidth: '180px',
            height: '44px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: inCart ? colors.primaryHover : colors.primary,
            color: colors.white,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke={colors.white}
            strokeWidth="2"
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
          {inCart ? 'Added — View Cart' : 'Add to Cart'}
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Add to wishlist"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            border: `1.5px solid ${colors.border}`,
            backgroundColor: colors.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? colors.badgeSale : 'none'}
            stroke={wishlisted ? colors.badgeSale : colors.secondary}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      {/* Buy Now */}
      <button
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '8px',
          border: `2px solid ${colors.secondary}`,
          backgroundColor: 'transparent',
          color: colors.secondary,
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Buy It Now
      </button>

      {/* Trust badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '8px',
          paddingTop: '16px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        {[
          { label: 'Free Delivery', icon: '🚚' },
          { label: '2 Year Warranty', icon: '🛡️' },
          { label: 'Secure Payment', icon: '🔒' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
