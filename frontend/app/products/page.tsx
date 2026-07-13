'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { type Product } from '@/lib/mock-data';
import FilterSidebar, { type FilterState } from '@/components/product/FilterSidebar';
import SortSelect from '@/components/ui/SortSelect';
import Pagination from '@/components/ui/Pagination';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { fetchProductsFromDatabase } from '@/features/products/actions/get-products';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceMin: 0,
    priceMax: 500000,
    rating: null,
    inStockOnly: false,
  });

  const normalizeValue = (value: string | undefined | null) => (value ?? '').trim().toLowerCase();

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();

    products.forEach((product) => {
      const category = product.category?.trim();
      if (!category) return;

      const key = normalizeValue(category);
      const existing = counts.get(key);
      counts.set(key, {
        name: category,
        count: (existing?.count ?? 0) + 1,
      });
    });

    return Array.from(counts.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value], index) => ({
        id: `${key}-${index}`,
        name: value.name,
        value: value.name,
        count: value.count,
      }));
  }, [products]);

  const brandOptions = useMemo(() => {
    const counts = new Map<string, { name: string; count: number }>();

    products.forEach((product) => {
      const brand = product.brand?.trim();
      if (!brand) return;

      const key = normalizeValue(brand);
      const existing = counts.get(key);
      counts.set(key, {
        name: brand,
        count: (existing?.count ?? 0) + 1,
      });
    });

    return Array.from(counts.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value], index) => ({
        id: `${key}-${index}`,
        name: value.name,
        value: value.name,
        count: value.count,
      }));
  }, [products]);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const result = await fetchProductsFromDatabase();

        if (!isActive) return;

        setProducts(result.products ?? []);
        setLoadError(result.error);
      } catch (error) {
        if (!isActive) return;

        setProducts([]);
        setLoadError(error instanceof Error ? error.message : 'Failed to load products');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some(
          (category) => normalizeValue(category) === normalizeValue(p.category)
        )
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) =>
        filters.brands.some((brand) => normalizeValue(brand) === normalizeValue(p.brand))
      );
    }

    result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);

    if (filters.rating !== null) {
      result = result.filter((p) => p.rating >= filters.rating!);
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [filters, products, search, sort]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearch('');
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setFilters({
      ...filters,
      categories: [category],
    });
    setPage(1);
  };

  const handleAllCategories = () => {
    setFilters({
      ...filters,
      categories: [],
    });
    setPage(1);
  };
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '24px', paddingBottom: '48px' }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: colors.textMuted,
            marginBottom: '20px',
          }}
        >
          <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>All Products</span>
        </nav>

        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ marginBottom: '20px' }}
        >
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
              All Products
            </h1>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: '4px 0 0 0' }}>
              {loading ? 'Loading products...' : `${filteredProducts.length} products found`}
            </p>
          </div>

          {loadError && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 14px',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            >
              {loadError}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            className="hidden sm:flex items-center rounded-md overflow-hidden"
            style={{
              border: `1.5px solid ${colors.border}`,
              width: '320px',
              backgroundColor: colors.white,
            }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              placeholder="Search products..."
              style={{
                flex: 1,
                padding: '9px 14px',
                fontSize: '13px',
                color: colors.secondary,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                style={{
                  padding: '0 8px',
                  color: colors.textMuted,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              style={{
                padding: '9px 14px',
                backgroundColor: colors.primary,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={handleAllCategories}
            style={{
              flexShrink: 0,
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: filters.categories.length === 0 ? colors.primary : colors.white,
              color: filters.categories.length === 0 ? colors.white : colors.textMuted,
              outline: filters.categories.length === 0 ? 'none' : `1px solid ${colors.border}`,
            }}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (filters.categories.includes(cat.value)) {
                  handleAllCategories();
                } else {
                  handleCategorySelect(cat.value);
                }
              }}
              style={{
                flexShrink: 0,
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: filters.categories.includes(cat.value)
                  ? colors.primary
                  : colors.white,
                color: filters.categories.includes(cat.value) ? colors.white : colors.textMuted,
                outline: filters.categories.includes(cat.value)
                  ? 'none'
                  : `1px solid ${colors.border}`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div className="hidden lg:block" style={{ width: '220px', flexShrink: 0 }}>
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              categories={categoryOptions}
              brands={brandOptions}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '16px',
                padding: '10px 14px',
                backgroundColor: colors.white,
                borderRadius: '10px',
                border: `1px solid ${colors.border}`,
              }}
            >
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.secondary,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
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
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      color: colors.white,
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span
                className="hidden lg:block"
                style={{ fontSize: '12px', color: colors.textMuted }}
              >
                {loading
                  ? 'Loading...'
                  : `Showing ${paginatedProducts.length} of ${filteredProducts.length}`}
              </span>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}
              >
                <SortSelect value={sort} onChange={handleSortChange} />
                <div
                  className="hidden sm:flex"
                  style={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {(['grid', 'list'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-label={`${v} view`}
                      style={{
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: view === v ? colors.primary : colors.white,
                        color: view === v ? colors.white : colors.textMuted,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {v === 'grid' ? (
                        <svg
                          width="14"
                          height="14"
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
                          width="14"
                          height="14"
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

            {loading && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '16px',
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {loadError && !loading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: colors.errorBg,
                  borderRadius: '12px',
                  border: `1px solid ${colors.errorBorder}`,
                }}
              >
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ marginBottom: '16px' }}
                >
                  <circle cx="12" cy="12" r="10" stroke={colors.error} strokeWidth="1.5" />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke={colors.error}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.secondary,
                    margin: '0 0 8px 0',
                  }}
                >
                  Failed to load products
                </h3>
                <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 16px 0' }}>
                  {loadError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: colors.primary,
                    color: colors.white,
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !loadError && filteredProducts.length === 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '64px 24px',
                  textAlign: 'center',
                  backgroundColor: colors.white,
                  borderRadius: '12px',
                  border: `1px dashed ${colors.border}`,
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.secondary,
                    margin: '0 0 8px 0',
                  }}
                >
                  No products found
                </h3>
                <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
                  Try adjusting your filters or search term
                </p>
              </div>
            )}

            {!loading && !loadError && filteredProducts.length > 0 && (
              <div
                style={
                  view === 'grid'
                    ? {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '16px',
                      }
                    : { display: 'flex', flexDirection: 'column', gap: '12px' }
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} view={view} />
                ))}
              </div>
            )}

            {!loading && !loadError && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <>
          <div
            onClick={() => setMobileFiltersOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'rgba(0,0,0,0.5)' }}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              borderRadius: '20px 20px 0 0',
              backgroundColor: colors.white,
              padding: '16px',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: colors.secondary, margin: 0 }}>
                Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.textMuted,
                }}
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
            <FilterSidebar
              filters={filters}
              onChange={(f) => {
                handleFilterChange(f);
                setMobileFiltersOpen(false);
              }}
              categories={categoryOptions}
              brands={brandOptions}
            />
          </div>
        </>
      )}
    </div>
  );
}
