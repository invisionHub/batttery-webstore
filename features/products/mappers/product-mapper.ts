import { Product } from '@/database/types';
import type { CatalogProduct } from '@/features/products/types/product.type';

export default function toCatalogProduct(product: Product): CatalogProduct {
  const price =
    typeof product.price === 'number'
      ? product.price
      : Number(product.price) || 0;
  const stockStatus = product.stockStatus === 'In Stock' ? 'In Stock' : 'Out of Stock';
  let images: string[] = [];
  if (Array.isArray(product.images)) {
    images = product.images.filter((item: unknown): item is string => typeof item === 'string');
  } else if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) images = parsed;
      else images = [product.images];
    } catch {
      images = [product.images];
    }
  }
  const category = typeof product.category === 'string' ? product.category : 'uncategorized';
  const brand = typeof product.brand === 'string' ? product.brand : 'unknown';
  const slug = typeof product.slug === 'string' ? product.slug : '';
  const name = typeof product.name === 'string' ? product.name : 'Unnamed product';
  const sku = typeof product.sku === 'string' ? product.sku : slug;
  const pricePoints =
    typeof product.pricePoints === 'number'
      ? product.pricePoints
      : Number(product.pricePoints) || 1;
  const shortDescription =
    typeof product.shortDescription === 'string' ? product.shortDescription : '';

  return {
    id: product.id,
    sku,
    name,
    slug,
    price,
    originalPrice: price + Math.round(price * 0.08),
    rating: 4.2 + (pricePoints % 3) * 0.2,
    reviewCount: 10 + pricePoints * 5,
    images: images.length > 0 ? images : ['/images/categories/led-bulb.jpg'],
    imageGallery: images.map((url, idx) => ({
      secureUrl: url,
      isPrimary: idx === 0,
      sortOrder: idx,
      altText: `${name} View ${idx + 1}`,
    })),
    category,
    brand,
    badge: pricePoints > 8 ? 'best-seller' : undefined,
    stockStatus,
    shortDescription,
  };
}
