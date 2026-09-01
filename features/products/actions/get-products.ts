'use server';

import { productRepository } from '@/database/repository/products/product.repository';

export async function fetchProducts() {
  try {
    const products = await productRepository.getAllProducts();

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
    const product = await productRepository.findById(id);

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
