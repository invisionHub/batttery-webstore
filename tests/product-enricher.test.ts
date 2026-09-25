/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { ProductImageEnricher } from '@/lib/image-search/enricher.service';
import { Product } from '@/database/types';
import { ImageCandidate } from '@/lib/image-search/types';

describe('ProductImageEnricher — Phase 9 (Tasks 21-25)', () => {
  const dummyProduct: Product = {
    id: 'prod-uuid-1',
    sku: 'PHI-1234',
    name: 'Philips LED Bulb 12W',
    brand: 'Philips',
    category: 'Lighting',
    subcategory: 'Bulbs',
    slug: 'philips-led-bulb-12w',
    price: '10.99',
    minPrice: '10.99',
    maxPrice: '10.99',
    pricePoints: '1',
    shortDescription: 'Energy saving bulb',
    stockStatus: 'In Stock',
    images: '[]',
  };

  it('skips enrichment idempotently if product already has primary image (Task 22)', async () => {
    const mockRepo = {
      findPrimaryByProductId: vi.fn().mockResolvedValue({
        id: 'img-1',
        productId: dummyProduct.id,
        cloudinaryUrl: 'https://res.cloudinary.com/test/image.jpg',
        isPrimary: true,
      }),
      create: vi.fn(),
      findByProductId: vi.fn(),
      findByCloudinaryPublicId: vi.fn(),
      existsForProduct: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    };

    const enricher = new ProductImageEnricher(
      { search: vi.fn(), getProviderName: () => 'Mock' },
      { validate: vi.fn(), assertValid: vi.fn() } as any,
      mockRepo as any,
      { upload: vi.fn(), delete: vi.fn(), exist: vi.fn() } as any
    );

    const result = await enricher.enrichProductImage(dummyProduct);
    expect(result.status).toBe('SKIPPED_EXISTING');
    expect(mockRepo.findPrimaryByProductId).toHaveBeenCalledWith(dummyProduct.id);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it('rolls back Cloudinary asset if database insert fails (Task 25 consistency)', async () => {
    const candidate: ImageCandidate = {
      imageUrl: 'https://example.com/bulb.jpg',
      sourceUrl: 'https://distributor.example/bulb',
      title: 'Philips LED Bulb 12W PHI-1234',
      source: 'distributor.example',
      width: 800,
      height: 800,
    };

    const mockSearchService = {
      search: vi.fn().mockResolvedValue([candidate]),
      getProviderName: () => 'Mock',
    };

    const mockValidator = {
      validate: vi.fn().mockResolvedValue({ isValid: true }),
      assertValid: vi.fn(),
    };

    const mockCloudinary = {
      upload: vi.fn().mockResolvedValue({
        publicId: 'products/PHI-1234/primary',
        secureUrl: 'https://res.cloudinary.com/test/products/PHI-1234/primary.jpg',
        resourceType: 'image',
      }),
      delete: vi.fn().mockResolvedValue({ result: 'ok' }),
      exist: vi.fn(),
    };

    const mockRepo = {
      findPrimaryByProductId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockRejectedValue(new Error('Simulated DB connection error')),
      findByProductId: vi.fn(),
      findByCloudinaryPublicId: vi.fn(),
      existsForProduct: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    };

    const enricher = new ProductImageEnricher(
      mockSearchService,
      mockValidator as any,
      mockRepo as any,
      mockCloudinary as any
    );

    await expect(enricher.enrichProductImage(dummyProduct)).rejects.toThrow(
      /Database insert failed after upload/
    );

    // Consistency rollback assertion:
    expect(mockCloudinary.delete).toHaveBeenCalledWith('products/PHI-1234/primary');
  });

  it('successfully uploads and stores record when candidate meets threshold (Tasks 23 & 24)', async () => {
    const candidate: ImageCandidate = {
      imageUrl: 'https://example.com/bulb.jpg',
      sourceUrl: 'https://distributor.example/bulb',
      title: 'Philips LED Bulb 12W PHI-1234 Lighting High Res',
      source: 'distributor.example',
      width: 1000,
      height: 1000,
    };

    const mockSearchService = {
      search: vi.fn().mockResolvedValue([candidate]),
      getProviderName: () => 'Mock',
    };

    const mockValidator = {
      validate: vi.fn().mockResolvedValue({ isValid: true }),
      assertValid: vi.fn(),
    };

    const mockCloudinary = {
      upload: vi.fn().mockResolvedValue({
        publicId: 'products/PHI-1234/primary',
        secureUrl: 'https://res.cloudinary.com/test/primary.jpg',
        resourceType: 'image',
      }),
      delete: vi.fn(),
      exist: vi.fn(),
    };

    const mockRepo = {
      findPrimaryByProductId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((val) => Promise.resolve({ id: 'img-new-1', ...val })),
      findByProductId: vi.fn(),
      findByCloudinaryPublicId: vi.fn(),
      existsForProduct: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    };

    const enricher = new ProductImageEnricher(
      mockSearchService,
      mockValidator as any,
      mockRepo as any,
      mockCloudinary as any
    );

    const result = await enricher.enrichProductImage(dummyProduct);
    expect(result.status).toBe('SUCCESS');
    expect(result.primaryImage?.cloudinaryPublicId).toBe('products/PHI-1234/primary');
    expect(result.primaryImage?.status).toBe('UPLOADED');
    expect(mockCloudinary.upload).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalled();
  });
});
