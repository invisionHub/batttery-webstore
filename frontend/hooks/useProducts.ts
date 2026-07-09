import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchProducts, type ProductFilters, type ProductsResponse } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import type { Product } from '@/lib/mock-data';

// ============================================
// useProducts — product listing hook
// Used on: /products page, category pages
// ============================================
export function useProducts(filters: ProductFilters = {}) {
  return useQuery<ProductsResponse, Error>({
    queryKey: queryKeys.products.list(filters as Record<string, unknown>),
    queryFn: () => fetchProducts(filters),

    // Keep showing previous page data while fetching next page
    // prevents layout jump during pagination
    placeholderData: keepPreviousData,

    // Products list can go stale after 2 minutes
    staleTime: 1000 * 60 * 2,

    // Keep in cache for 10 minutes
    gcTime: 1000 * 60 * 10,
  });
}

// ============================================
// useFeaturedProducts — homepage featured section
// ============================================
export function useFeaturedProducts() {
  const { fetchFeaturedProducts } = require('@/lib/api');

  return useQuery<Product[], Error>({
    queryKey: queryKeys.products.featured(),
    queryFn: fetchFeaturedProducts,

    // Featured products rarely change — cache for 5 minutes
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
}

// ============================================
// useCategories — category list hook
// ============================================
export function useCategories() {
  const { fetchCategories } = require('@/lib/api');

  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: fetchCategories,

    // Categories rarely change — cache for 15 minutes
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

// ============================================
// useBrands — brand list hook
// ============================================
export function useBrands() {
  const { fetchBrands } = require('@/lib/api');

  return useQuery({
    queryKey: queryKeys.brands.list(),
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });
}

// --- USAGE ---
//
// Basic product listing:
// const { data, isLoading, isError, error } = useProducts();
//
// With filters:
// const { data, isLoading } = useProducts({
//   search: "solar",
//   category: "solar-panels",
//   priceMin: 50000,
//   sort: "price-asc",
//   page: 1,
//   limit: 12,
// });
//
// Access data:
// data.products  → Product[]
// data.total     → number
// data.totalPages → number
// data.hasMore   → boolean
