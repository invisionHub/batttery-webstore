import { eq, inArray, and, or, ilike, sql } from 'drizzle-orm';
import { db } from '../../client';
import { productTable } from '../../schema/product.schema';
import { productImageTable } from '../../schema/product-image.schema';
import { NewProduct, Product } from '../../types';
import { mockProducts } from '@/lib/mock-data';

const inMemoryProducts: Product[] = mockProducts.map((p) => ({
  id: p.id,
  sku: p.slug,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  subcategory: p.category,
  price: String(p.price),
  minPrice: String(p.price),
  maxPrice: String(p.originalPrice ?? p.price),
  pricePoints: '5',
  shortDescription: p.description,
  stockStatus: p.inStock ? 'In Stock' : 'Out of Stock',
  images: JSON.stringify([p.image]),
}));

export interface ProductQueryOptions {
  search?: string;
  category?: string;
  categories?: string[];
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: string;
}

export interface ProductRepository {
  seedProduct(products: NewProduct[]): Promise<void>;
  getAllProducts(options?: ProductQueryOptions): Promise<Product[]>;
  findById(id: string): Promise<Product[]>;
  findByIds(ids: string[]): Promise<Product[]>;
}

export const productRepository: ProductRepository = {
  seedProduct: async (products: NewProduct[]) => {
    if (process.env.DATABASE_URL) {
      try {
        await Promise.all(
          products.map((product) => db.insert(productTable).values(product).returning())
        );
      } catch (err) {
        console.warn('[AI Studio] DB seed failed, falling back to memory store:', err);
      }
    }
    for (const p of products) {
      inMemoryProducts.push({
        id: p.id ?? `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sku: p.sku ?? null,
        slug: p.slug ?? null,
        name: p.name ?? null,
        brand: p.brand ?? null,
        category: p.category ?? null,
        subcategory: p.subcategory ?? null,
        price: p.price ?? null,
        minPrice: p.minPrice ?? null,
        maxPrice: p.maxPrice ?? null,
        pricePoints: p.pricePoints ?? null,
        shortDescription: p.shortDescription ?? null,
        stockStatus: p.stockStatus ?? null,
        images: p.images ?? null,
      });
    }
  },

  getAllProducts: async (options?: ProductQueryOptions) => {
    if (process.env.DATABASE_URL) {
      try {
        const conditions = [];

        if (options?.search && options.search.trim()) {
          const term = `%${options.search.trim()}%`;
          conditions.push(
            or(
              ilike(productTable.name, term),
              ilike(productTable.brand, term),
              ilike(productTable.category, term),
              ilike(productTable.sku, term),
              ilike(productTable.shortDescription, term)
            )
          );
        }

        const activeCategories = [
          ...(options?.categories ?? []),
          ...(options?.category ? [options.category] : []),
        ].filter(Boolean);

        if (activeCategories.length > 0) {
          conditions.push(
            or(
              ...activeCategories.map((c) =>
                or(ilike(productTable.category, c), ilike(productTable.category, c.replace(/-/g, ' ')))
              )
            )
          );
        }

        const activeBrands = [
          ...(options?.brands ?? []),
          ...(options?.brand ? [options.brand] : []),
        ].filter(Boolean);

        if (activeBrands.length > 0) {
          conditions.push(
            or(...activeBrands.map((b) => ilike(productTable.brand, b)))
          );
        }

        if (options?.inStockOnly) {
          conditions.push(eq(productTable.stockStatus, 'In Stock'));
        }

        const query = db
          .select({
            product: productTable,
            primaryImageUrl: productImageTable.cloudinaryUrl,
          })
          .from(productTable)
          .leftJoin(
            productImageTable,
            and(
              eq(productImageTable.productId, productTable.id),
              eq(productImageTable.isPrimary, true)
            )
          );

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const rows = whereClause ? await query.where(whereClause) : await query;

        if (Array.isArray(rows) && rows.length > 0) {
          let mapped = rows.map((r) => {
            const p = r.product;
            if (r.primaryImageUrl) {
              p.images = JSON.stringify([r.primaryImageUrl]);
            }
            return p;
          });

          // Price filtering in number space
          if (options?.minPrice !== undefined && options.minPrice > 0) {
            mapped = mapped.filter((p) => Number(p.price || 0) >= options.minPrice!);
          }
          if (options?.maxPrice !== undefined && options.maxPrice < 500000) {
            mapped = mapped.filter((p) => Number(p.price || 0) <= options.maxPrice!);
          }

          // Sorting
          if (options?.sort === 'price-asc') {
            mapped.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
          } else if (options?.sort === 'price-desc') {
            mapped.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
          } else if (options?.sort === 'name-asc') {
            mapped.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          } else if (options?.sort === 'name-desc') {
            mapped.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
          }

          return mapped;
        }
      } catch (err) {
        console.warn('[AI Studio] DB select failed, using in-memory products:', err);
      }
    }

    // In-memory fallback
    let result = [...inMemoryProducts];
    if (options?.search && options.search.trim()) {
      const term = options.search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.sku?.toLowerCase().includes(term)
      );
    }
    const cats = [...(options?.categories ?? []), ...(options?.category ? [options.category] : [])];
    if (cats.length > 0) {
      result = result.filter((p) =>
        cats.some(
          (c) =>
            p.category?.toLowerCase() === c.toLowerCase() ||
            p.category?.toLowerCase() === c.replace(/-/g, ' ').toLowerCase()
        )
      );
    }
    const brs = [...(options?.brands ?? []), ...(options?.brand ? [options.brand] : [])];
    if (brs.length > 0) {
      result = result.filter((p) => brs.some((b) => p.brand?.toLowerCase() === b.toLowerCase()));
    }
    if (options?.minPrice !== undefined) {
      result = result.filter((p) => Number(p.price || 0) >= options.minPrice!);
    }
    if (options?.maxPrice !== undefined && options.maxPrice < 500000) {
      result = result.filter((p) => Number(p.price || 0) <= options.maxPrice!);
    }
    if (options?.inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'In Stock');
    }
    return result;
  },

  findById: async (id: string) => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select({
            product: productTable,
            primaryImageUrl: productImageTable.cloudinaryUrl,
          })
          .from(productTable)
          .leftJoin(
            productImageTable,
            and(
              eq(productImageTable.productId, productTable.id),
              eq(productImageTable.isPrimary, true)
            )
          )
          .where(or(eq(productTable.id, id), eq(productTable.slug, id)));

        if (Array.isArray(rows) && rows.length > 0) {
          const p = rows[0].product;
          // Also fetch all images for this product from productImageTable
          try {
            const allImages = await db
              .select({
                cloudinaryUrl: productImageTable.cloudinaryUrl,
              })
              .from(productImageTable)
              .where(eq(productImageTable.productId, p.id))
              .orderBy(sql`${productImageTable.sortOrder} ASC`);

            if (allImages.length > 0) {
              const validUrls = allImages
                .map((img: { cloudinaryUrl: string | null }) => img.cloudinaryUrl)
                .filter((url: string | null): url is string => url !== null && url.length > 0);
              p.images = JSON.stringify(validUrls);
            } else if (rows[0].primaryImageUrl) {
              p.images = JSON.stringify([rows[0].primaryImageUrl]);
            }
          } catch {
            if (rows[0].primaryImageUrl) {
              p.images = JSON.stringify([rows[0].primaryImageUrl]);
            }
          }
          return [p];
        }
      } catch (err) {
        console.warn('[AI Studio] DB findById failed, using in-memory search:', err);
      }
    }
    return inMemoryProducts.filter((p) => p.id === id || p.slug === id);
  },

  findByIds: async (ids: string[]) => {
    if (ids.length === 0) return [];
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select({
            product: productTable,
            primaryImageUrl: productImageTable.cloudinaryUrl,
          })
          .from(productTable)
          .leftJoin(
            productImageTable,
            and(
              eq(productImageTable.productId, productTable.id),
              eq(productImageTable.isPrimary, true)
            )
          )
          .where(inArray(productTable.id, ids));

        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r) => {
            const p = r.product;
            if (r.primaryImageUrl) {
              p.images = JSON.stringify([r.primaryImageUrl]);
            }
            return p;
          });
        }
      } catch (err) {
        console.warn('[AI Studio] DB findByIds failed, using in-memory search:', err);
      }
    }
    return inMemoryProducts.filter((p) => ids.includes(p.id) || ids.includes(p.slug ?? ''));
  },
};
