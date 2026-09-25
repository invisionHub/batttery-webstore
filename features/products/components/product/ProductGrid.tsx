'use client';

import React from 'react';
import { ProductCard } from '@/components/product';
import { GridListArrangement, ProductNotFound } from './ProductToolBar';
import Pagination from '@/components/ui/Pagination';
import { Product } from '@/database/types';
import { SortOption } from '../../types';

interface IProductGrid {
  productLength: number;
  paginatedProducts: Product[];
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
  sort?: SortOption;
  setSort?: (sort: SortOption) => void;
  onOpenMobileFilters?: () => void;
  onResetFilters?: () => void;
}

export const ProductGrid = ({
  paginatedProducts,
  productLength,
  setView,
  view,
  totalPages,
  page,
  setPage,
  sort = 'popular',
  setSort,
  onOpenMobileFilters,
  onResetFilters,
}: IProductGrid) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          {onOpenMobileFilters && (
            <button
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
            </button>
          )}

          <span className="text-xs font-medium text-gray-500">
            {productLength} {productLength === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Dropdown */}
          {setSort && (
            <div className="flex items-center gap-2">
              <label htmlFor="product-sort" className="text-xs font-medium text-gray-500 hidden sm:inline">
                Sort:
              </label>
              <select
                id="product-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-xs font-semibold text-gray-800 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
              >
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="newest">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          )}

          {/* Grid / List view toggle */}
          <GridListArrangement setView={setView} view={view} />
        </div>
      </div>

      {/* Products list or empty state */}
      {paginatedProducts.length > 0 ? (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full'
              : 'flex flex-col gap-3 w-full'
          }
        >
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} view={view} />
          ))}
        </div>
      ) : (
        <ProductNotFound onReset={onResetFilters} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
};
