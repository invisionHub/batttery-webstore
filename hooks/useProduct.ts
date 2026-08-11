import { useQuery } from '@tanstack/react-query';
import { fetchRelatedProducts } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import type { Product } from '@/lib/mock-data';
import { fetchProductBySlug } from '@/features/products/actions/get-products';

// ============================================
// useProduct — single product detail hook
// Used on: /products/[slug] page
// ============================================
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const result = await fetchProductBySlug(slug);

      if (result.error) {
        throw new Error(result.error);
      }

      return result.product;
    },
    enabled: !!slug,
  });
}

// ============================================
// useRelatedProducts — related products hook
// Used on: /products/[slug] page bottom section
// ============================================
export function useRelatedProducts(category: string, excludeId: string, limit = 4) {
  return useQuery<Product[], Error>({
    queryKey: [...queryKeys.products.byCategory(category), 'related', excludeId],
    queryFn: () => fetchRelatedProducts(category, excludeId, limit),

    // Only run if we have both category and excludeId
    enabled: Boolean(category) && Boolean(excludeId),

    // Related products can stay fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });
}

// --- USAGE ---
//
// In product detail page:
// const { data: product, isLoading, isError } = useProduct(slug);
//
// if (isLoading) return <PageSkeleton />
// if (isError || !product) return <ErrorState />
//
// <ProductGallery productName={product.name} />
// <ProductDetails product={product} />
//
// Related products:
// const { data: related = [] } = useRelatedProducts(
//   product.category,
//   product.id
// );
