'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Product } from '@/database/types';
import { formatPrice } from '@/utils/utils';

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
  badgeSale: '#EF4444',
  badgeNew: '#3B82F6',
  badgeBestSeller: '#F59E0B',
  badgeHot: '#EF4444',
};

export function getProductImage(product: Product): string | null {
  if (!product.images) return null;
  if (Array.isArray(product.images)) {
    const first = (product.images as unknown[])[0];
    return typeof first === 'string' && first.trim() ? first : null;
  }
  if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      if (product.images.trim()) return product.images.trim();
    }
  }
  return null;
}

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
export const ProductBadge = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  const badgeColors: Record<string, string> = {
    sale: colors.badgeSale,
    new: colors.badgeNew,
    'best-seller': colors.badgeBestSeller,
    hot: colors.badgeHot,
  };
  return (
    <span
      className="px-2 py-0.5 text-[10px] font-bold uppercase rounded text-white"
      style={{ backgroundColor: badgeColors[badge] || colors.primary }}
    >
      {badge}
    </span>
  );
};

// ─────────────────────────────────────────
// IMAGE PLACEHOLDER
// ─────────────────────────────────────────
export const ProductImagePlaceholder = ({ name }: { name: string }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-2 p-2"
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
    <span className="text-[11px] text-center px-2 line-clamp-2 leading-tight" style={{ color: colors.textMuted }}>
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
  const [imageError, setImageError] = useState(false);

  const addProduct = useCartStore((state) => state.addProduct);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const imageUrl = getProductImage(product);
  const productHref = `/products/${product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(product, 1);
    setAddedToCart(true);
    openCartDrawer();
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <div
        className={`flex gap-4 rounded-xl overflow-hidden transition-all duration-200 p-3 items-center ${className}`}
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Image */}
        <div
          className="relative shrink-0 rounded-lg overflow-hidden bg-white"
          style={{ width: '110px', height: '110px', border: `1px solid ${colors.border}` }}
        >
          <Link href={productHref} className="block w-full h-full relative">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={product.name ?? 'Product'}
                fill
                sizes="110px"
                className="object-contain p-2 hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <ProductImagePlaceholder name={product.name!} />
            )}
          </Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: colors.primary }}
          >
            {product.category?.replace(/-/g, ' ')}
          </span>
          <Link href={productHref} className="hover:underline">
            <h3
              className="text-sm font-bold leading-snug line-clamp-2"
              style={{ color: colors.secondary }}
            >
              {product.name}
            </h3>
          </Link>
          {product.brand && (
            <span className="text-xs" style={{ color: colors.textMuted }}>
              Brand: {product.brand}
            </span>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-base font-black" style={{ color: colors.secondary }}>
              {formatPrice(product.price!)}
            </span>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: product.stockStatus === 'Out of Stock' ? '#FEE2E2' : '#DCFCE7',
                color: product.stockStatus === 'Out of Stock' ? '#DC2626' : '#16A34A',
              }}
            >
              {product.stockStatus ?? 'In Stock'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0 items-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
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
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer"
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
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-white" style={{ height: '190px' }}>
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
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

        <Link href={productHref} className="block w-full h-full relative">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={product.name ?? 'Product'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder name={product.name!} />
          )}
        </Link>
      </div>

      {/* Info Container */}
      <div className="flex flex-col gap-2 p-3.5 flex-1 border-t" style={{ borderColor: colors.border }}>
        <span
          className="text-[11px] font-bold uppercase tracking-wider line-clamp-1"
          style={{ color: colors.primary }}
        >
          {product.category?.replace(/-/g, ' ')}
        </span>

        <Link href={productHref} className="hover:underline">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 min-h-[38px]"
            style={{ color: colors.secondary }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price & Stock */}
        <div className="flex items-baseline justify-between gap-2 mt-auto pt-1">
          <span className="text-base font-black" style={{ color: colors.secondary }}>
            {formatPrice(product.price!)}
          </span>
          {product.brand && (
            <span className="text-[11px] text-gray-500 font-medium truncate max-w-[90px]">
              {product.brand}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 rounded-lg text-xs font-bold transition-all duration-200 mt-1 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          style={{
            backgroundColor: addedToCart ? colors.primaryHover : colors.primary,
            color: colors.white,
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
