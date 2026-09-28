'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Product } from '@/database/types';
import { formatPrice } from '@/utils/utils';

interface ProductDetailsProps {
  product: Product;
  className?: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, className = '' }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const router = useRouter();

  const addProduct = useCartStore((state) => state.addProduct);
  const openCartDrawer = useUIStore((state) => state.openCartDrawer);

  const handleAddToCart = () => {
    addProduct(product, quantity);
    setIsAdded(true);
    openCartDrawer();
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addProduct(product, quantity);
    router.push('/checkOut');
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Brand & Category Kicker */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span className="text-[#CC0000] font-bold uppercase tracking-wider">
          {product.category?.replace(/-/g, ' ')}
        </span>
        {product.brand && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">Brand: {product.brand}</span>
          </>
        )}
        {product.sku && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">SKU: {product.sku}</span>
          </>
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* Price & Stock Status */}
      <div className="flex items-baseline gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {formatPrice(product.price!)}
          </span>
          <span className="block text-[11px] text-slate-500 mt-0.5">
            Inclusive of standard VAT · Verified commercial grade
          </span>
        </div>

        <div className="ml-auto">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${
              product.stockStatus === 'Out of Stock'
                ? 'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            <span>{product.stockStatus ?? 'In Stock · Ready to Ship'}</span>
          </span>
        </div>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-slate-600 leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Engineering Specifications Matrix */}
      <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-white">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Core Technical Specifications
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="block text-slate-500 text-[11px]">Primary Application</span>
            <span className="font-bold text-slate-800">
              Power Backup &amp; Electrical Setup
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="block text-slate-500 text-[11px]">Direct Warranty</span>
            <span className="font-bold text-slate-800">2-Year Certified Coverage</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="block text-slate-500 text-[11px]">Compliance Standard</span>
            <span className="font-bold text-slate-800">CE / SONCAP Approved</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="block text-slate-500 text-[11px]">Quality Inspection</span>
            <span className="font-bold text-slate-800">100% Tested Prior Dispatch</span>
          </div>
        </div>
      </div>

      {/* Quantity & Purchase CTAs */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-base font-bold cursor-pointer"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 text-center text-sm font-bold text-slate-900 tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-base font-bold cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 h-12 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-[#CC0000] hover:bg-[#B30000] text-white shadow-red-900/30'
            }`}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{isAdded ? '✓ Added to Cart' : 'Add to Cart'}</span>
          </button>
        </div>

        {/* Buy Now Direct Checkout */}
        <button
          onClick={handleBuyNow}
          className="w-full h-12 rounded-xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Buy It Now — Fast Checkout
        </button>
      </div>

      {/* Trust & Delivery Guarantees */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-center">
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="text-lg">🚚</div>
          <div className="text-[11px] font-bold text-slate-900 mt-1">Fast Dispatch</div>
          <div className="text-[10px] text-slate-500">Tracked nationwide</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="text-lg">🛡️</div>
          <div className="text-[11px] font-bold text-slate-900 mt-1">2-Yr Warranty</div>
          <div className="text-[10px] text-slate-500">Official guarantee</div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50">
          <div className="text-lg">📞</div>
          <div className="text-[11px] font-bold text-slate-900 mt-1">Tech Advice</div>
          <div className="text-[10px] text-slate-500">Talk to engineers</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
