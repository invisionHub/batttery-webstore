'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { type Product, formatPrice } from '@/lib/mock-data';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  badgeSale: '#EF4444',
  badgeNew: '#3B82F6',
  badgeBestSeller: '#F59E0B',
  badgeHot: '#EF4444',
};

// ─────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────
export const StarRating = ({
  rating,
  count,
  showCount = true,
}: {
  rating: number;
  count: number;
  showCount?: boolean;
}) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? colors.badgeBestSeller : 'none'}
          stroke={colors.badgeBestSeller}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    {showCount && (
      <span className="text-xs" style={{ color: colors.textMuted }}>
        ({count})
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────
// PRODUCT BADGE
// ─────────────────────────────────────────
export const ProductBadge = ({ badge }: { badge: Product['badge'] }) => {
  if (!badge) return null;
  const config = {
    sale: { label: 'Sale', bg: colors.badgeSale },
    new: { label: 'New', bg: colors.badgeNew },
    'best-seller': { label: 'Best Seller', bg: colors.badgeBestSeller },
    hot: { label: 'Hot', bg: colors.badgeHot },
  }[badge];

  return (
    <span
      className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded text-xs font-bold"
      style={{ backgroundColor: config.bg, color: colors.white }}
    >
      {config.label}
    </span>
  );
};

// ─────────────────────────────────────────
// IMAGE PLACEHOLDER
// ─────────────────────────────────────────
export const ProductImagePlaceholder = ({ name }: { name: string }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-2"
    style={{ backgroundColor: colors.bgLight }}
  >
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.border} strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke={colors.textMuted} strokeWidth="1.5" />
      <path
        d="M21 15l-5-5L5 21"
        stroke={colors.textMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-xs text-center px-2 leading-tight" style={{ color: colors.textMuted }}>
      {name}
    </span>
  </div>
);

// ─────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid', className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <div
        className={`flex gap-4 rounded-xl overflow-hidden transition-all duration-200 p-3 ${className}`}
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Image */}
        <div
          className="relative flex-shrink-0 rounded-lg overflow-hidden"
          style={{ width: '100px', height: '100px' }}
        >
          <ProductBadge badge={product.badge} />
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <ProductImagePlaceholder name={product.name} />
          </Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: colors.primary }}
          >
            {product.category.replace(/-/g, ' ')}
          </span>
          <Link href={`/products/${product.slug}`}>
            <h3
              className="text-sm font-semibold leading-snug line-clamp-2"
              style={{ color: colors.secondary }}
            >
              {product.name}
            </h3>
          </Link>
          <StarRating rating={product.rating} count={product.reviewCount} />
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-base font-black" style={{ color: colors.secondary }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: colors.textMuted }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="text-xs font-bold" style={{ color: colors.badgeSale }}>
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ border: `1px solid ${colors.border}` }}
            aria-label="Wishlist"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isWishlisted ? colors.badgeSale : 'none'}
              stroke={isWishlisted ? colors.badgeSale : colors.textMuted}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            className="px-3 py-2 rounded-md text-xs font-bold transition-all duration-200"
            style={{
              backgroundColor: addedToCart ? colors.primaryHover : colors.primary,
              color: colors.white,
            }}
          >
            {addedToCart ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  }

  // ── GRID VIEW ──
  return (
    <div
      className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${className}`}
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)')
      }
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '180px' }}>
        <ProductBadge badge={product.badge} />

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: colors.white, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}
          aria-label="Wishlist"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={isWishlisted ? colors.badgeSale : 'none'}
            stroke={isWishlisted ? colors.badgeSale : colors.textMuted}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <ProductImagePlaceholder name={product.name} />
        </Link>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <span
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: colors.primary }}
        >
          {product.category.replace(/-/g, ' ')}
        </span>

        <Link href={`/products/${product.slug}`}>
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2"
            style={{ color: colors.secondary }}
          >
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto flex-wrap">
          <span className="text-sm font-black" style={{ color: colors.secondary }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: colors.textMuted }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-bold" style={{ color: colors.badgeSale }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 rounded-md text-xs font-bold transition-all duration-200 mt-1"
          style={{
            backgroundColor: addedToCart ? colors.primaryHover : colors.primary,
            color: colors.white,
          }}
        >
          {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
