'use server';

import { getAllProducts, getProductBySlug } from '@/lib/repository';
import toCatalogProduct from '../mappers/product-mapper';

// export type ProductFetchResult = {
//   products: CatalogProduct[];
//   error: string | null;
// };

export async function fetchProducts() {
  try {
    const documents = await getAllProducts();
    return {
      product: documents.map(toCatalogProduct),
      error: null,
    };
  } catch (error) {
    return {
      product: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const documents = await getProductBySlug(slug);

    if (!documents) {
      return {
        product: null,
        error: 'Product not found.',
      };
    }

    console.info(`[products] Fetched product with slug: ${slug}`);

    return {
      product: documents.map(toCatalogProduct)[0],
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product.';

    console.error('[products] Failed to load product:', message);

    return {
      product: null,
      error: message,
    };
  }
}
