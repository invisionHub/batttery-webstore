'use server';

import type { Product as CatalogProduct } from '@/lib/mock-data';
import { getAllProducts } from '@/lib/repository';
import type { ProductRecord } from '@/lib/repository';
import type { Product as ProductEntity } from '@/features/products/types/product.type';

export type ProductFetchResult = {
  products: CatalogProduct[];
  error: string | null;
};

type ProductLike = ProductRecord | ProductEntity | Record<string, unknown>;

function toCatalogProduct(product: ProductLike): CatalogProduct {
  const price = typeof product.price === 'number' ? product.price : 0;
  const stockStatus = typeof product.stockStatus === 'string' ? product.stockStatus : undefined;
  const images = Array.isArray(product.images)
    ? product.images.filter((item): item is string => typeof item === 'string')
    : [];
  const category = typeof product.category === 'string' ? product.category : 'uncategorized';
  const brand = typeof product.brand === 'string' ? product.brand : 'unknown';
  const slug = typeof product.slug === 'string' ? product.slug : '';
  const name = typeof product.name === 'string' ? product.name : 'Unnamed product';
  const sku = typeof product.sku === 'string' ? product.sku : slug;
  const pricePoints = typeof product.pricePoints === 'number' ? product.pricePoints : 1;
  const shortDescription =
    typeof product.shortDescription === 'string' ? product.shortDescription : '';

  return {
    id: sku,
    name,
    slug,
    price,
    originalPrice: price + Math.round(price * 0.08),
    rating: 4.2 + ((pricePoints ?? 1) % 3) * 0.2,
    reviewCount: 10 + (pricePoints ?? 1) * 5,
    image: images[0] ?? '/images/products/placeholder.jpg',
    category,
    brand,
    badge: pricePoints > 8 ? 'best-seller' : undefined,
    inStock: stockStatus ? stockStatus === 'In Stock' : true,
    description: shortDescription,
  };
}

export async function fetchProductsFromDatabase(): Promise<ProductFetchResult> {
  try {
    const documents = await getAllProducts();

    console.log(documents);
    const products = documents.map((product) => toCatalogProduct(product));

    console.info(`[products] Fetched ${products.length} products from the database.`);

    return {
      products,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch products from the database.';

    console.error('[products] Failed to load products:', message);

    return {
      products: [],
      error: message,
    };
  }
}
