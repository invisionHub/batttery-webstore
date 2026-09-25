'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE,
  DEFAULT_SORT,
  DEFAULT_VIEW,
} from '../constants/product.constants';
import {
  generateFilterOptions,
  filterProducts,
  paginateProducts,
  searchProducts,
  sortProducts,
} from '../bussiness';
import { ProductHeader } from '../components/header/ProductHeader';
import { Catalog } from '../components/filter/Catalog';
import { ProductLayout } from '../components/layout/ProductLayout';
import { FilterSidebar } from '@/components/product';
import { FilterState } from '@/components/product/FilterSidebar';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductNotFound } from '../components/product/ProductToolBar';
import { Product } from '@/database/types';
import { SortOption } from '../types';

type ProductsViewProps = {
  initialProducts: Product[] | undefined;
  initialError: string | undefined;
  allProducts?: Product[];
  initialSearch?: string;
  initialCategory?: string;
  initialBrand?: string;
};

export function ProductsView({
  initialProducts,
  initialError,
  allProducts,
  initialSearch = '',
  initialCategory,
  initialBrand,
}: ProductsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
    brands: initialBrand ? [initialBrand] : [],
  }));
  const [sort, setSort] = useState<SortOption>(DEFAULT_SORT);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [view, setView] = useState<'grid' | 'list'>(DEFAULT_VIEW);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  if (!initialProducts || initialError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductNotFound error={initialError} />
      </div>
    );
  }

  // URL update helper
  const syncUrlParams = (newSearch: string, newFilters: FilterState, newSort: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      if (newSearch.trim()) {
        params.set('search', newSearch.trim());
      } else {
        params.delete('search');
      }

      if (newFilters.categories.length === 1) {
        params.set('category', newFilters.categories[0]);
      } else if (newFilters.categories.length > 1) {
        params.set('categories', newFilters.categories.join(','));
      } else {
        params.delete('category');
        params.delete('categories');
      }

      if (newFilters.brands.length === 1) {
        params.set('brand', newFilters.brands[0]);
      } else if (newFilters.brands.length > 1) {
        params.set('brands', newFilters.brands.join(','));
      } else {
        params.delete('brand');
        params.delete('brands');
      }

      if (newFilters.priceMin > 0) {
        params.set('minPrice', String(newFilters.priceMin));
      } else {
        params.delete('minPrice');
      }

      if (newFilters.priceMax < 500000) {
        params.set('maxPrice', String(newFilters.priceMax));
      } else {
        params.delete('maxPrice');
      }

      if (newSort && newSort !== 'featured') {
        params.set('sort', newSort);
      } else {
        params.delete('sort');
      }

      const queryString = params.toString();
      const newUrl = queryString ? `/products?${queryString}` : '/products';
      router.replace(newUrl, { scroll: false });
    });
  };

  const handleSearchSubmit = () => {
    setPage(1);
    syncUrlParams(search, filters, sort);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    syncUrlParams(search, newFilters, sort);
  };

  const handleCategorySelect = (categoryValue: string | null) => {
    const updatedCategories = categoryValue
      ? filters.categories.includes(categoryValue)
        ? []
        : [categoryValue]
      : [];
    const newFilters = { ...filters, categories: updatedCategories };
    setFilters(newFilters);
    setPage(1);
    syncUrlParams(search, newFilters, sort);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
    syncUrlParams(search, filters, newSort);
  };

  const handleReset = () => {
    setSearch('');
    const resetFilters = {
      categories: [],
      brands: [],
      priceMin: 0,
      priceMax: 500000,
      rating: null,
      inStockOnly: false,
    };
    setFilters(resetFilters);
    setSort('popular');
    setPage(1);
    router.replace('/products', { scroll: false });
  };

  // Base pool for options
  const optionPool = allProducts && allProducts.length > 0 ? allProducts : initialProducts;
  const categoryOptions = generateFilterOptions(optionPool, 'category');
  const brandOptions = generateFilterOptions(optionPool, 'brand');

  // Filter pipeline
  const searchedProducts = searchProducts(initialProducts, search);
  const filteredProducts = filterProducts(searchedProducts, filters);
  const sortedProducts = sortProducts(filteredProducts, sort);
  const { totalPages, items } = paginateProducts(sortedProducts, page);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      {/* Top Header & Search Bar */}
      <ProductHeader
        resultCount={filteredProducts.length}
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Category Pill Selector */}
        <Catalog
          categoryOptions={categoryOptions}
          selected={filters.categories}
          onSelectCategory={handleCategorySelect}
        />

        {/* Sidebar + Products Grid Layout */}
        <ProductLayout
          SiderBar={
            <FilterSidebar
              filters={filters}
              brands={brandOptions}
              categories={categoryOptions}
              onChange={handleFiltersChange}
            />
          }
        >
          <ProductGrid
            page={page}
            paginatedProducts={items}
            productLength={filteredProducts.length}
            setPage={setPage}
            setView={setView}
            totalPages={totalPages}
            view={view}
            sort={sort}
            setSort={handleSortChange}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            onResetFilters={handleReset}
          />
        </ProductLayout>
      </div>

      {/* Mobile Filters Slide-out Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl p-4 overflow-y-auto flex flex-col z-10">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <span className="font-extrabold text-gray-900 text-base">Filter Catalog</span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:text-gray-900"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              brands={brandOptions}
              categories={categoryOptions}
              onChange={(updated) => {
                handleFiltersChange(updated);
              }}
            />
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="mt-4 w-full py-3 bg-[#CC0000] text-white font-bold rounded-lg text-sm shadow-md"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
