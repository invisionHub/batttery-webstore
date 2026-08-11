import type { Product } from '@/features/products/types/product.type';
import {
  ensureMongoIndexes,
  getMongoConfig,
  getMongoDb,
  getProductsCollection,
  type ProductDocument,
} from '@/lib/database/mongodb.connection';

export class ProductRepository {
  private async getCollection() {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    return getProductsCollection(db);
  }

  async seedProducts(products: Product[]) {
    await ensureMongoIndexes();

    const db = await getMongoDb();
    const collection = getProductsCollection(db);
    const config = getMongoConfig();
    const now = new Date();

    const result = await collection.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { sku: product.sku },
          update: {
            $set: {
              ...product,
              updatedAt: now,
            },
            $setOnInsert: {
              createdAt: now,
            },
          },
          upsert: true,
        },
      }))
    );

    return {
      database: config.dbName,
      collection: config.productsCollection,
      indexedFields: [
        'sku',
        'slug',
        'category',
        'subcategory',
        'brand',
        'stockStatus',
        'price',
        'textSearch',
      ],
      inserted: result.upsertedCount,
      matched: result.matchedCount,
      modified: result.modifiedCount,
    };
  }

  async create(product: Product) {
    const collection = await this.getCollection();
    const now = new Date();

    return collection.updateOne(
      { sku: product.sku },
      {
        $set: {
          ...product,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  async updateBySku(sku: string, partial: Partial<ProductDocument>) {
    const collection = await this.getCollection();

    return collection.updateOne(
      { sku },
      {
        $set: {
          ...partial,
          updatedAt: new Date(),
        },
      }
    );
  }

  async findAll() {
    const collection = await this.getCollection();
    return collection.find({}).sort({ createdAt: -1, name: 1 }).toArray();
  }

  async findBySku(sku: string) {
    const collection = await this.getCollection();
    return collection.findOne({ sku });
  }

  async findBySlug(slug: string) {
    const collection = await this.getCollection();
    return collection.findOne({ slug });
  }

  async deleteBySku(sku: string) {
    const collection = await this.getCollection();
    return collection.deleteOne({ sku });
  }

  async count() {
    const collection = await this.getCollection();
    return collection.countDocuments({});
  }
}

export const productRepository = new ProductRepository();
