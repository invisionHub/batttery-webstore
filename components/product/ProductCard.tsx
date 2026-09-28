'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Product } from '@/database/types';
import { formatPrice } from '@/utils/utils';

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

export const ProductImagePlaceholder = ({ name }: { name: string }) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-400">
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" />
    </svg>
    <span className="text-[10px] text-center mt-2 line-clamp-2 text-slate-500 font-medium">
      {name}
    </span>
  </div>
);

export const StarRating = ({ rating, count }: { rating: number; count?: number }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="11" height="11" viewBox="0 0 20 20" fill={s <= Math.round(rating) ? 'currentColor' : 'none'} stroke="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    {count !== undefined && (
      <span className="text-[11px] text-slate-400 font-mono">({count})</span>
    )}
  </div>
);

export const ProductBadge = ({ badge }: { badge?: string }) => {
  if (!badge) return null;
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
      {badge}
    </span>
  );
};

interface ProductCardProps {
  product: Product;
  view?: 'grid' | 'list';
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, view = 'grid', className = '' }) => {
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
        className={`flex gap-4 rounded-xl border border-slate-200 bg-white p-3.5 items-center hover:border-slate-300 hover:shadow-md transition-all duration-200 ${className}`}
      >
        {/* Thumbnail Image */}
        <div className="relative w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
          <Link href={productHref} className="block w-full h-full relative">
            {imageUrl && !imageError ? (
              <Image
                src={imageUrl}
                alt={product.name ?? 'Product'}
                fill
                sizes="120px"
                className="object-contain p-2 hover:scale-105 transition-transform duration-200"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <ProductImagePlaceholder name={product.name!} />
            )}
          </Link>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[#CC0000]">
              {product.category?.replace(/-/g, ' ')}
            </span>
            {product.brand && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.brand}</span>
              </>
            )}
          </div>

          <Link href={productHref} className="hover:text-[#CC0000] transition-colors">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-3 mt-auto pt-1">
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              {formatPrice(product.price!)}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                product.stockStatus === 'Out of Stock'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {product.stockStatus ?? 'In Stock'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
              addedToCart
                ? 'bg-emerald-600 text-white'
                : 'bg-[#CC0000] hover:bg-[#B30000] text-white active:scale-95'
            }`}
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
      className={`group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 ${className}`}
    >
      {/* Product Image Stage */}
      <div className="relative h-48 w-full bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center">
        <Link href={productHref} className="block w-full h-full relative">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={product.name ?? 'Product'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <ProductImagePlaceholder name={product.name!} />
          )}
        </Link>

        {/* Stock tag */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs ${
              product.stockStatus === 'Out of Stock'
                ? 'bg-white text-red-600 border border-red-200'
                : 'bg-white text-emerald-700 border border-emerald-200'
            }`}
          >
            {product.stockStatus ?? 'In Stock'}
          </span>
        </div>
      </div>

      {/* Info & Purchase Area */}
      <div className="flex flex-col flex-1 p-4 gap-2 justify-between">
        <div>
          {/* Metadata unboxed */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span className="text-[#CC0000] font-bold uppercase tracking-wider line-clamp-1">
              {product.category?.replace(/-/g, ' ')}
            </span>
            {product.brand && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{product.brand}</span>
              </>
            )}
          </div>

          <Link href={productHref} className="block hover:text-[#CC0000] transition-colors mt-1">
            <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[38px]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 mt-auto">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-base font-black text-slate-900 tabular-nums">
              {formatPrice(product.price!)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Verified Spec</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              addedToCart
                ? 'bg-emerald-600 text-white'
                : 'bg-[#CC0000] hover:bg-[#B30000] text-white active:scale-[0.98]'
            }`}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{addedToCart ? '✓ Added to Cart' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
