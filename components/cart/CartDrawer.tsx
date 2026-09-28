'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { formatPrice } from '@/utils/utils';

const FREE_SHIPPING_THRESHOLD = 50000;

const CartItemRow = ({ item }: { item: ReturnType<typeof useCartStore.getState>['items'][0] }) => {
  const { removeProduct, updateQuantity } = useCartStore();
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="flex gap-3.5 py-4 border-b border-slate-100 items-center">
      {/* Product Image Thumbnail */}
      <div className="relative w-16 h-16 shrink-0 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
        {item.image && !imgErr ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            className="object-contain p-1.5"
            referrerPolicy="no-referrer"
            onError={() => setImgErr(true)}
          />
        ) : (
          <svg width="22" height="22" fill="none" stroke="#94A3B8" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Info & Quantity */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          href={`/products/${item.slug || item.id}`}
          className="text-xs font-bold text-slate-900 hover:text-[#CC0000] truncate transition-colors"
        >
          {item.name}
        </Link>

        {item.color && (
          <span className="text-[11px] text-slate-500">
            Specification: {item.color}
          </span>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-black text-slate-900 tabular-nums">
            {formatPrice(item.price)}
          </span>

          {/* Stepper */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-xs font-bold cursor-pointer"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors text-xs font-bold cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => removeProduct(item.id)}
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
        aria-label="Remove item"
      >
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" strokeLinecap="round" />
          <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};

export const CartDrawer: React.FC = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { items, calculateTotals, clearCart } = useCartStore();
  const { subtotal, itemCount, total } = calculateTotals();

  // Escape key handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    if (isCartDrawerOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isCartDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-slate-900 text-lg">Your Cart</span>
            {itemCount > 0 && (
              <span className="bg-[#CC0000] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs">
          {amountRemaining > 0 ? (
            <p className="text-slate-700 font-medium mb-1.5">
              Add <span className="font-bold text-[#CC0000] tabular-nums">{formatPrice(amountRemaining)}</span> more to unlock <span className="font-bold text-emerald-700">Free Delivery</span>
            </p>
          ) : (
            <p className="text-emerald-700 font-bold mb-1.5 flex items-center gap-1.5">
              <span>🎉 Congratulations! Your order qualifies for Free Delivery!</span>
            </p>
          )}
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                amountRemaining === 0 ? 'bg-emerald-500' : 'bg-[#CC0000]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                Explore our certified batteries, hybrid inverters, and electrical protection systems.
              </p>
              <button
                onClick={closeCartDrawer}
                className="px-6 py-2.5 bg-[#CC0000] text-white text-xs font-bold rounded-lg hover:bg-[#B30000] transition-colors cursor-pointer shadow-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}

              <div className="py-3 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-red-600 transition-colors font-semibold cursor-pointer"
                >
                  Clear all items
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800 tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Delivery</span>
              <span className="font-semibold text-emerald-600">
                {amountRemaining === 0 ? 'FREE' : 'Calculated at checkout'}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span className="tabular-nums text-lg text-[#CC0000]">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkOut"
              onClick={closeCartDrawer}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#CC0000] hover:bg-[#B30000] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <button
              onClick={closeCartDrawer}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
