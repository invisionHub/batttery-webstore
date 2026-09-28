'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/database/types';
import { ProductCard } from '@/components/product';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'accessories' | 'switches' | 'protection'>('all');

  // Filter based on active category tab
  const filtered = products.filter((p) => {
    if (activeTab === 'all') return true;
    const cat = (p.category || '').toLowerCase();
    if (activeTab === 'accessories') return cat.includes('accessories');
    if (activeTab === 'switches') return cat.includes('switch') || cat.includes('socket');
    if (activeTab === 'protection') return cat.includes('mccb') || cat.includes('protection') || cat.includes('isolator') || cat.includes('board');
    return true;
  });

  const displayList = filtered.slice(0, 8);

  return (
    <section className="bg-white py-16 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Segmented Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
              Verified Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Power Products &amp; Components
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              In-stock items ready for immediate dispatch across Nigeria with full warranty.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Systems ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'accessories'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Battery Accessories
            </button>
            <button
              onClick={() => setActiveTab('switches')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'switches'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Switches &amp; Sockets
            </button>
            <button
              onClick={() => setActiveTab('protection')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'protection'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MCCB &amp; Panels
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayList.map((product) => (
              <ProductCard key={product.id} product={product} view="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-8">
            <p className="text-sm font-semibold text-slate-600">No products found in this category.</p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-3 text-xs font-bold text-[#CC0000] hover:underline"
            >
              Reset to all products
            </button>
          </div>
        )}

        {/* Bottom CTA to View Full Catalog */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            <span>Explore Full 400+ Product Catalog</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
