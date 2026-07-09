import { QueryClient } from '@tanstack/react-query';

// ============================================
// TANSTACK QUERY CLIENT CONFIGURATION
// ============================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── Caching strategy ──
      // Data stays fresh for 2 minutes before refetching
      staleTime: 1000 * 60 * 2,

      // Cache stays in memory for 10 minutes after component unmounts
      gcTime: 1000 * 60 * 10,

      // ── Retry logic ──
      // Retry failed requests up to 2 times
      retry: 2,

      // Exponential backoff: 1s, 2s, 4s (max 30s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // ── Refetch behaviour ──
      // Refetch when window regains focus (user switches tabs and comes back)
      refetchOnWindowFocus: false,

      // Don't refetch on reconnect by default
      refetchOnReconnect: true,

      // Don't refetch on mount if data is still fresh
      refetchOnMount: true,
    },

    mutations: {
      // Retry mutations once on failure
      retry: 1,

      // Global mutation error handler — log to console for now
      // Replace with toast notification in Week 5
      onError: (error: unknown) => {
        console.error('[Mutation Error]', error);
      },
    },
  },
});

// ============================================
// QUERY KEYS FACTORY
// Centralised key management prevents typos
// and makes cache invalidation predictable
// ============================================
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
    byCategory: (category: string) => [...queryKeys.products.lists(), { category }] as const,
    byBrand: (brand: string) => [...queryKeys.products.lists(), { brand }] as const,
    featured: () => [...queryKeys.products.lists(), 'featured'] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const,
  },

  // Brands
  brands: {
    all: ['brands'] as const,
    list: () => [...queryKeys.brands.all, 'list'] as const,
  },

  // Cart (if server-side cart is added later)
  cart: {
    all: ['cart'] as const,
    detail: () => [...queryKeys.cart.all, 'detail'] as const,
  },
} as const;

// --- USAGE ---
// queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
// queryClient.invalidateQueries({ queryKey: queryKeys.products.detail("some-slug") })
