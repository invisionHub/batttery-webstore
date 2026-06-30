'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockProducts, formatPrice, type Product } from '@/lib/mock-data';

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
  badgeBest: '#F59E0B',
};

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg
        key={s}
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? colors.badgeBest : 'none'}
        stroke={colors.badgeBest}
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const RelatedCard = ({ product }: { product: Product }) => {
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const badgeColors: Record<string, string> = {
    sale: colors.badgeSale,
    new: colors.badgeNew,
    'best-seller': colors.badgeBest,
    hot: colors.badgeSale,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.white,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '150px', backgroundColor: colors.bgLight }}>
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              zIndex: 1,
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'capitalize',
              backgroundColor: badgeColors[product.badge],
              color: colors.white,
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {product.badge.replace(/-/g, ' ')}
          </span>
        )}
        <Link
          href={`/products/${product.slug}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
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
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px' }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h4
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: colors.secondary,
              margin: 0,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h4>
        </Link>
        <StarRating rating={product.rating} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 900, color: colors.secondary }}>
            {formatPrice(product.price)}
          </span>
          {discount && (
            <span style={{ fontSize: '10px', fontWeight: 700, color: colors.badgeSale }}>
              -{discount}%
            </span>
          )}
        </div>
        <button
          onClick={() => {
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          style={{
            width: '100%',
            padding: '7px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: added ? colors.primaryHover : colors.primary,
            color: colors.white,
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '2px',
          }}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  category,
  className = '',
}) => {
  // Get products from the same category, excluding the current one
  const related = mockProducts
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 4);

  // Fallback: if not enough in same category, fill with other products
  const fallback = mockProducts
    .filter((p) => p.id !== currentProductId && !related.some((r) => r.id === p.id))
    .slice(0, 4 - related.length);

  const displayProducts = [...related, ...fallback].slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className={className}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
            You May Also Like
          </h2>
          <div
            style={{
              width: '36px',
              height: '3px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              marginTop: '6px',
            }}
          />
        </div>
        <Link
          href="/products"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: colors.primary,
            textDecoration: 'none',
          }}
        >
          View all →
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
        }}
      >
        {displayProducts.map((product) => (
          <RelatedCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
