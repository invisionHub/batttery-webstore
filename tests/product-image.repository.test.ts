import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { productImageRepository } from '../database/repository/products/product-image.repository';
import { productRepository } from '../database/repository/products/product.repository';
import {
  DuplicatePrimaryImageError,
  ProductNotFoundError,
} from '../database/repository/products/errors/product-image.errors';

describe('Product Image Repository & Relationship Tests (Task 10)', () => {
  let representativeProductId: string;
  let representativeProductSku: string;
  const createdImageIds: string[] = [];

  beforeEach(async () => {
    // Select an existing representative product from the database/catalog
    const allProducts = await productRepository.getAllProducts();
    expect(allProducts.length).toBeGreaterThan(0);

    const representativeProduct = allProducts[0];
    expect(representativeProduct).toBeDefined();
    expect(representativeProduct.id).toBeDefined();

    representativeProductId = representativeProduct.id;
    representativeProductSku = representativeProduct.sku ?? 'SAMPLE-SKU';

    // Clean up any pre-existing images for representativeProduct so tests start with a clean slate
    try {
      const existing = await productImageRepository.findByProductId(representativeProductId);
      for (const img of existing) {
        await productImageRepository.delete(img.id);
      }
    } catch {
      // Ignore
    }
  });

  afterEach(async () => {
    // Test data cleanup: Delete all created image records, never delete the existing product
    for (const imageId of createdImageIds) {
      try {
        await productImageRepository.delete(imageId);
      } catch {
        // Ignore deletion errors during cleanup
      }
    }
    createdImageIds.length = 0;
  });

  it('creates an image record associated with an existing product (AC-04, AC-05)', async () => {
    const primaryPublicId = `products/${representativeProductSku}/primary`;
    const secureUrl = `https://res.cloudinary.com/test-cloud/image/upload/v123456/${primaryPublicId}.jpg`;

    const createdImage = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: primaryPublicId,
      cloudinaryUrl: secureUrl,
      sourceUrl: 'https://example.com/images/bulb.jpg',
      source: 'manufacturer-catalog',
      confidenceScore: '0.9850',
      status: 'UPLOADED',
      altText: 'Primary product photo',
      sortOrder: 0,
      isPrimary: true,
    });

    createdImageIds.push(createdImage.id);

    expect(createdImage.id).toBeDefined();
    expect(createdImage.productId).toBe(representativeProductId);
    expect(createdImage.cloudinaryPublicId).toBe(primaryPublicId);
    expect(createdImage.cloudinaryUrl).toBe(secureUrl);
    expect(createdImage.isPrimary).toBe(true);
    expect(createdImage.status).toBe('UPLOADED');
  });

  it('retrieves all images by product ID with deterministic ordering', async () => {
    const img1 = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/gallery-1`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/gallery-1.jpg`,
      sourceUrl: 'https://example.com/gallery1.jpg',
      confidenceScore: '0.9500',
      status: 'UPLOADED',
      sortOrder: 1,
      isPrimary: false,
    });
    createdImageIds.push(img1.id);

    const img2 = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/primary`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/primary.jpg`,
      sourceUrl: 'https://example.com/primary.jpg',
      confidenceScore: '0.9900',
      status: 'UPLOADED',
      sortOrder: 0,
      isPrimary: true,
    });
    createdImageIds.push(img2.id);

    const images = await productImageRepository.findByProductId(representativeProductId);
    expect(images.length).toBeGreaterThanOrEqual(2);

    // Verify ordering by sort_order
    const createdSubset = images.filter((img) => img.id === img1.id || img.id === img2.id);
    expect(createdSubset[0].id).toBe(img2.id); // sortOrder 0
    expect(createdSubset[1].id).toBe(img1.id); // sortOrder 1
  });

  it('retrieves primary image directly by product ID', async () => {
    const primaryImg = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/primary`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/primary.jpg`,
      sourceUrl: 'https://example.com/primary.jpg',
      confidenceScore: '0.9900',
      status: 'UPLOADED',
      sortOrder: 0,
      isPrimary: true,
    });
    createdImageIds.push(primaryImg.id);

    const foundPrimary = await productImageRepository.findPrimaryByProductId(representativeProductId);
    expect(foundPrimary).not.toBeNull();
    expect(foundPrimary?.id).toBe(primaryImg.id);
    expect(foundPrimary?.isPrimary).toBe(true);
  });

  it('retrieves image by Cloudinary public ID using index', async () => {
    const publicId = `products/${representativeProductSku}/gallery-lookup-test`;
    const image = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: publicId,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/${publicId}.jpg`,
      sourceUrl: 'https://example.com/lookup.jpg',
      confidenceScore: '0.9200',
      status: 'UPLOADED',
      sortOrder: 2,
      isPrimary: false,
    });
    createdImageIds.push(image.id);

    const found = await productImageRepository.findByCloudinaryPublicId(publicId);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(image.id);
    expect(found?.cloudinaryPublicId).toBe(publicId);
  });

  it('performs efficient existence check via existsForProduct()', async () => {
    const existsBefore = await productImageRepository.existsForProduct('00000000-0000-0000-0000-000000000000');
    expect(existsBefore).toBe(false);

    const image = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/exists-test`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/exists.jpg`,
      sourceUrl: 'https://example.com/exists.jpg',
      confidenceScore: '0.9100',
      status: 'PENDING',
      sortOrder: 3,
      isPrimary: false,
    });
    createdImageIds.push(image.id);

    const existsAfter = await productImageRepository.existsForProduct(representativeProductId);
    expect(existsAfter).toBe(true);
  });

  it('enforces foreign key integrity when inserting image for non-existent product', async () => {
    const nonExistentProductId = '00000000-0000-0000-0000-000000000000';

    await expect(
      productImageRepository.create({
        productId: nonExistentProductId,
        cloudinaryPublicId: `products/UNKNOWN/primary`,
        cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/unknown.jpg`,
        sourceUrl: 'https://example.com/unknown.jpg',
        confidenceScore: '0.5000',
        status: 'PENDING',
        sortOrder: 0,
        isPrimary: true,
      })
    ).rejects.toThrow(ProductNotFoundError);
  });

  it('enforces partial unique index: rejects second primary image for the same product', async () => {
    const firstPrimary = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/primary-1`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/primary-1.jpg`,
      sourceUrl: 'https://example.com/primary-1.jpg',
      confidenceScore: '0.9500',
      status: 'UPLOADED',
      sortOrder: 0,
      isPrimary: true,
    });
    createdImageIds.push(firstPrimary.id);

    // Attempt second primary image for same product
    await expect(
      productImageRepository.create({
        productId: representativeProductId,
        cloudinaryPublicId: `products/${representativeProductSku}/primary-2`,
        cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/primary-2.jpg`,
        sourceUrl: 'https://example.com/primary-2.jpg',
        confidenceScore: '0.9000',
        status: 'UPLOADED',
        sortOrder: 1,
        isPrimary: true, // Violates is_primary_unique
      })
    ).rejects.toThrow(DuplicatePrimaryImageError);
  });

  it('updates image status through lifecycle transitions', async () => {
    const image = await productImageRepository.create({
      productId: representativeProductId,
      cloudinaryPublicId: `products/${representativeProductSku}/lifecycle-test`,
      cloudinaryUrl: `https://res.cloudinary.com/test-cloud/image/upload/lifecycle.jpg`,
      sourceUrl: 'https://example.com/lifecycle.jpg',
      confidenceScore: '0.8500',
      status: 'UPLOADING',
      sortOrder: 4,
      isPrimary: false,
    });
    createdImageIds.push(image.id);

    const updated = await productImageRepository.updateStatus(image.id, 'UPLOADED');
    expect(updated.status).toBe('UPLOADED');

    const reviewRequired = await productImageRepository.updateStatus(image.id, 'REVIEW_REQUIRED');
    expect(reviewRequired.status).toBe('REVIEW_REQUIRED');
  });
});
