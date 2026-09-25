'use server';

import {
  productRepository,
  ProductQueryOptions,
} from '@/database/repository/products/product.repository';

export async function fetchProducts(options?: ProductQueryOptions) {
  try {
    const products = await productRepository.getAllProducts(options);

    return {
      product: products,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      product: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function fetchProductById(id: string) {
  try {
    const products = await productRepository.findById(id);
    const product = products[0];

    if (!product) {
      return {
        product: null,
        error: 'Product not found.',
      };
    }

    console.info(`[products] Fetched product with id: ${id}`);

    return {
      product,
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
