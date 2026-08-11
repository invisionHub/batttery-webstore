import type { ProductRecord } from '@/lib/database/mongodb.connection';
import type { CatalogProduct, Product as ProductEntity } from '@/features/products/types/product.type';

type ProductLike = ProductRecord | ProductEntity | Record<string, unknown>;

export default function toCatalogProduct(product: ProductLike): CatalogProduct {
  const price = typeof product.price === 'number' ? product.price : 0;
  const stockStatus = product.stockStatus === 'In Stock' ? 'In Stock' : 'Out of Stock';
  const images = Array.isArray(product.images)
    ? product.images.filter((item: unknown): item is string => typeof item === 'string')
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
    rating: 4.2 + (pricePoints % 3) * 0.2,
    reviewCount: 10 + pricePoints * 5,
    images: images.length > 0 ? images : ['/images/products/placeholder.jpg'],
    category,
    brand,
    badge: pricePoints > 8 ? 'best-seller' : undefined,
    stockStatus,
    shortDescription,
  };
}
