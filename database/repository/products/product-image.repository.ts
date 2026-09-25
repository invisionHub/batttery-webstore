/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../../client';
import { productImageTable } from '../../schema/product-image.schema';
import { NewProductImage, ProductImage } from '../../types';
import { ImageStatus, ProductImageRepository } from './interfaces/product-image.interfaces';
import {
  DuplicatePrimaryImageError,
  ProductImageError,
  ProductImageNotFoundError,
  ProductNotFoundError,
} from './errors/product-image.errors';
import { productRepository } from './product.repository';

// In-memory state store for fallback/testing environments without direct Postgres access
const inMemoryImages: ProductImage[] = [];

export const productImageRepository: ProductImageRepository = {
  create: async (image: NewProductImage): Promise<ProductImage> => {
    // 1. If real DATABASE_URL is configured, execute via Drizzle
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db.insert(productImageTable).values(image).returning();
        if (rows && rows.length > 0) {
          return rows[0];
        }
      } catch (err: unknown) {
        // Handle PostgreSQL error codes (unwrapping nested DrizzleQueryError causes)
        const extractPgInfo = (e: any): { code?: string; constraint?: string; message: string } => {
          let current = e;
          let combinedMsg = '';
          let foundCode: string | undefined;
          let foundConstraint: string | undefined;

          while (current) {
            if (current.code) foundCode = current.code;
            if (current.constraint) foundConstraint = current.constraint;
            if (current.message) combinedMsg += ' ' + current.message;
            if (current.detail) combinedMsg += ' ' + current.detail;
            current = current.cause;
          }

          return { code: foundCode, constraint: foundConstraint, message: combinedMsg };
        };

        const { code, constraint, message: msg } = extractPgInfo(err);

        if (code === '23505' || constraint?.includes('is_primary_unique') || (msg && msg.includes('is_primary_unique'))) {
          throw new DuplicatePrimaryImageError(image.productId);
        }
        if (code === '23503' || constraint?.includes('fkey') || (msg && msg.includes('foreign key'))) {
          throw new ProductNotFoundError(image.productId);
        }
        throw new ProductImageError(`Failed to insert product image: ${msg || 'Unknown database error'}`, err);
      }
    }

    // 2. In-memory fallback
    // Verify foreign key integrity: product must exist
    const matchingProducts = await productRepository.findById(image.productId);
    if (!matchingProducts || matchingProducts.length === 0) {
      throw new ProductNotFoundError(image.productId);
    }

    // Verify duplicate primary image invariant
    if (image.isPrimary) {
      const existingPrimary = inMemoryImages.find(
        (img) => img.productId === image.productId && img.isPrimary
      );
      if (existingPrimary) {
        throw new DuplicatePrimaryImageError(image.productId);
      }
    }

    const createdRecord: ProductImage = {
      id: image.id ?? `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: image.productId,
      cloudinaryPublicId: image.cloudinaryPublicId,
      cloudinaryUrl: image.cloudinaryUrl,
      sourceUrl: image.sourceUrl,
      source: image.source ?? null,
      confidenceScore: String(image.confidenceScore),
      status: image.status ?? 'PENDING',
      altText: image.altText ?? null,
      sortOrder: image.sortOrder ?? 0,
      isPrimary: Boolean(image.isPrimary),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryImages.push(createdRecord);
    return createdRecord;
  },

  findByProductId: async (productId: string): Promise<ProductImage[]> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(productImageTable)
          .where(eq(productImageTable.productId, productId))
          .orderBy(asc(productImageTable.sortOrder), asc(productImageTable.createdAt));
        if (Array.isArray(rows)) {
          return rows;
        }
      } catch (err) {
        console.warn('[ProductImageRepository] Database query failed, using in-memory fallback:', err);
      }
    }

    return inMemoryImages
      .filter((img) => img.productId === productId)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  },

  findPrimaryByProductId: async (productId: string): Promise<ProductImage | null> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(productImageTable)
          .where(
            and(
              eq(productImageTable.productId, productId),
              eq(productImageTable.isPrimary, true)
            )
          )
          .limit(1);
        if (Array.isArray(rows) && rows.length > 0) {
          return rows[0];
        }
        return null;
      } catch (err) {
        console.warn('[ProductImageRepository] Database query failed, using in-memory fallback:', err);
      }
    }

    const found = inMemoryImages.find(
      (img) => img.productId === productId && img.isPrimary
    );
    return found ?? null;
  },

  findAllPrimaryProductIds: async (): Promise<Set<string>> => {
    const ids = new Set<string>();
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select({ productId: productImageTable.productId })
          .from(productImageTable)
          .where(eq(productImageTable.isPrimary, true));
        for (const row of rows) {
          if (row.productId) ids.add(row.productId);
        }
        return ids;
      } catch (err) {
        console.warn('[ProductImageRepository] Database query failed, using in-memory fallback:', err);
      }
    }

    for (const img of inMemoryImages) {
      if (img.isPrimary && img.productId) {
        ids.add(img.productId);
      }
    }
    return ids;
  },

  findByCloudinaryPublicId: async (publicId: string): Promise<ProductImage | null> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(productImageTable)
          .where(eq(productImageTable.cloudinaryPublicId, publicId))
          .limit(1);
        if (Array.isArray(rows) && rows.length > 0) {
          return rows[0];
        }
        return null;
      } catch (err) {
        console.warn('[ProductImageRepository] Database query failed, using in-memory fallback:', err);
      }
    }

    const found = inMemoryImages.find((img) => img.cloudinaryPublicId === publicId);
    return found ?? null;
  },

  existsForProduct: async (productId: string): Promise<boolean> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select({ id: productImageTable.id })
          .from(productImageTable)
          .where(eq(productImageTable.productId, productId))
          .limit(1);
        return Array.isArray(rows) && rows.length > 0;
      } catch (err) {
        console.warn('[ProductImageRepository] Database query failed, using in-memory fallback:', err);
      }
    }

    return inMemoryImages.some((img) => img.productId === productId);
  },

  updateStatus: async (id: string, status: ImageStatus): Promise<ProductImage> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .update(productImageTable)
          .set({ status, updatedAt: new Date() })
          .where(eq(productImageTable.id, id))
          .returning();
        if (Array.isArray(rows) && rows.length > 0) {
          return rows[0];
        }
        throw new ProductImageNotFoundError(id);
      } catch (err: unknown) {
        if (err instanceof ProductImageNotFoundError) throw err;
        throw new ProductImageError(`Failed to update status for product image "${id}"`, err);
      }
    }

    const image = inMemoryImages.find((img) => img.id === id);
    if (!image) {
      throw new ProductImageNotFoundError(id);
    }

    image.status = status;
    image.updatedAt = new Date();
    return image;
  },

  delete: async (id: string): Promise<boolean> => {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .delete(productImageTable)
          .where(eq(productImageTable.id, id))
          .returning({ id: productImageTable.id });
        return Array.isArray(rows) && rows.length > 0;
      } catch (err) {
        throw new ProductImageError(`Failed to delete product image with id "${id}"`, err);
      }
    }

    const index = inMemoryImages.findIndex((img) => img.id === id);
    if (index !== -1) {
      inMemoryImages.splice(index, 1);
      return true;
    }
    return false;
  },
};
