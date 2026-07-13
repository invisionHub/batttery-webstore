'use client';

import React, { useState } from 'react';
import { type Product, formatPrice } from '@/lib/mock-data';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

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

const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? colors.badgeBest : 'none'}
          stroke={colors.badgeBest}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>{rating}</span>
    <span style={{ fontSize: '13px', color: colors.textMuted }}>({count} reviews)</span>
  </div>
);

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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const badgeColors: Record<string, string> = {
    sale: colors.badgeSale,
    new: colors.badgeNew,
    'best-seller': colors.badgeBest,
    hot: colors.badgeSale,
  };

  // ── Add to Cart — now wired to Zustand ──
  const handleAddToCart = () => {
    addProduct(product, quantity, colorOptions[selectedColor].name);
    openCartDrawer(); // slide open the cart drawer immediately
  };

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Badge + Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {product.badge && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'capitalize',
              backgroundColor: badgeColors[product.badge],
              color: colors.white,
              padding: '3px 10px',
              borderRadius: '4px',
            }}
          >
            {product.badge.replace(/-/g, ' ')}
          </span>
        )}
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
      <StarRating rating={product.rating} count={product.reviewCount} />

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '30px', fontWeight: 900, color: colors.secondary }}>
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span
              style={{ fontSize: '16px', textDecoration: 'line-through', color: colors.textMuted }}
            >
              {formatPrice(product.originalPrice)}
            </span>
            {discount && (
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: colors.badgeSale,
                  backgroundColor: '#FEF2F2',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                Save {discount}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Stock status */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '6px',
          width: 'fit-content',
          backgroundColor: product.inStock ? colors.successBg : '#FEF2F2',
          border: `1px solid ${product.inStock ? colors.successBorder : '#FECACA'}`,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: product.inStock ? colors.primary : colors.badgeSale,
          }}
        />
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: product.inStock ? '#15803D' : colors.badgeSale,
          }}
        >
          {product.inStock ? 'In Stock — Ready to Ship' : 'Out of Stock'}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.7, margin: 0 }}>
        {product.description}
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
          disabled={!product.inStock}
          style={{
            flex: 1,
            minWidth: '180px',
            height: '44px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: !product.inStock
              ? colors.border
              : inCart
                ? colors.primaryHover
                : colors.primary,
            color: colors.white,
            fontSize: '14px',
            fontWeight: 700,
            cursor: product.inStock ? 'pointer' : 'not-allowed',
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
