'use server';

import { productRepository } from '@/database/repository/products/product.repository';
import toCatalogProduct from '../mappers/product-mapper';

export async function fetchProducts() {
  try {
    const documents = await productRepository.getAllProducts();

    return {
      product: documents.map(toCatalogProduct),
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
    const document = await productRepository.findById(id);

    if (!document) {
      return {
        product: null,
        error: 'Product not found.',
      };
    }

    console.info(`[products] Fetched product with id: ${id}`);

    return {
      product: toCatalogProduct(document[0]),
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
