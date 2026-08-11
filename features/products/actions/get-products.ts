'use server';

import { productRepository } from '@/lib/repositories';
import toCatalogProduct from '../mappers/product-mapper';

export async function fetchProducts() {
  try {
    const documents = await productRepository.findAll();

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
    const document = await productRepository.findBySlug(slug);

    if (!document) {
      return {
        product: null,
        error: 'Product not found.',
      };
    }

    console.info(`[products] Fetched product with slug: ${slug}`);

    return {
      product: toCatalogProduct(document),
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
