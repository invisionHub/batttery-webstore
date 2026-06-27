'use client';

import React, { useState, useMemo } from 'react';
import { mockProducts, mockCategories, type Product } from '@/lib/mock-data'; // Assuming Product type is exported from mock-data
import ProductCard from '@/components/product/ProductCard'; // Renamed alias to reflect actual component
import ProductGridDisplay from '@/components/product/ProductGridDisplay'; // New component for displaying a grid of products
import FilterSidebar, { type FilterState } from '@/components/product/FilterSidebar';
import SearchBar from '@/components/ui/SearchBar';
import Link from 'next/link';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceMin: 0,
    priceMax: 500000,
    rating: null,
    badge: [],
  });

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Price filter
    result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);

    // Rating filter
    if (filters.rating !== null) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }

    // Badge filter
    if (filters.badge.length > 0) {
      result = result.filter((p) => p.badge && filters.badge.includes(p.badge));
    }

    // Sort
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating); // Fixed: Sort by rating in descending order
        break;
      case 'newest':
        result.reverse();
        break;
    }

    return result;
  }, [search, filters, sort]);

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.badge.length +
    (filters.rating ? 1 : 0);

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: colors.textMuted }}>
          <Link href="/" style={{ color: colors.textMuted }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>All Products</span>
        </nav>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black" style={{ color: colors.secondary }}>
              All Products
            </h1>
            <p className="text-sm mt-1" style={{ color: colors.textMuted }}>
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Search bar — desktop */}
          <div className="hidden sm:block w-full max-w-sm">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSearch={setSearch}
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* Search bar — mobile */}
        <div className="sm:hidden mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={setSearch}
            placeholder="Search products..."
          />
        </div>

        {/* Category quick filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <button
            onClick={() => setFilters({ ...filters, categories: [] })}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
            style={{
              backgroundColor: filters.categories.length === 0 ? colors.primary : colors.white,
              color: filters.categories.length === 0 ? colors.white : colors.textMuted,
              border: `1px solid ${filters.categories.length === 0 ? colors.primary : colors.border}`,
            }}
          >
            All
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters({ ...filters, categories: [cat.slug] })}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
              style={{
                backgroundColor: filters.categories.includes(cat.slug)
                  ? colors.primary
                  : colors.white,
                color: filters.categories.includes(cat.slug) ? colors.white : colors.textMuted,
                border: `1px solid ${filters.categories.includes(cat.slug) ? colors.primary : colors.border}`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: '220px' }}>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div
              className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl"
              style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }}
            >
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold"
                style={{ color: colors.secondary }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Results count */}
              <span className="text-xs hidden lg:block" style={{ color: colors.textMuted }}>
                Showing {filteredProducts.length} results
              </span>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-md focus:outline-none"
                  style={{
                    border: `1px solid ${colors.border}`,
                    color: colors.secondary,
                    backgroundColor: colors.white,
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View toggle */}
                <div
                  className="hidden sm:flex items-center rounded-md overflow-hidden"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  {(['grid', 'list'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="p-1.5 transition-colors duration-150"
                      style={{
                        backgroundColor: view === v ? colors.primary : colors.white,
                        color: view === v ? colors.white : colors.textMuted,
                      }}
                      aria-label={`${v} view`}
                    >
                      {v === 'grid' ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? ( // Conditional rendering for empty state
              <ProductGridDisplay products={filteredProducts} view={view} /> // Use the new ProductGridDisplay component
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20 px-4 rounded-xl border-2 border-dashed"
                style={{ borderColor: colors.border, backgroundColor: colors.white }}
              >
                <p className="text-lg font-medium" style={{ color: colors.secondary }}>
                  No products found
                </p>
                <p className="text-sm mt-1 mb-6" style={{ color: colors.textMuted }}>
                  Try adjusting your filters or search terms to find what youre looking for.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      categories: [],
                      brands: [],
                      priceMin: 0,
                      priceMax: 500000,
                      rating: null,
                      badge: [],
                    })
                  }
                  className="px-6 py-2 rounded-full text-white font-bold text-sm transition-transform active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl p-4 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: colors.white }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black" style={{ color: colors.secondary }}>
                Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ color: colors.textMuted }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        </>
      )}
    </div>
  );
}
