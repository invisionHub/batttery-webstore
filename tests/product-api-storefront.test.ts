import { describe, it, expect } from 'vitest';
import toCatalogProduct from '@/features/products/mappers/product-mapper';
import { Product } from '@/database/types';

describe('Product/Image API & Next.js Storefront (Phases 17 & 18 — Tasks 48–51)', () => {
  it('correctly maps product into catalog response with images array and gallery (Task 49)', () => {
    const rawProduct: Product = {
      id: 'prod-456',
      sku: 'PHI-LED-12-CW',
      slug: 'philips-led-bulb-12w-cool-white',
      name: 'Philips LED Bulb 12W Cool White',
      brand: 'Philips',
      category: 'Lighting',
      subcategory: 'LED Bulbs',
      price: '12.50',
      minPrice: '12.50',
      maxPrice: '15.00',
      pricePoints: '4',
      shortDescription: 'High efficiency warm and cool lighting',
      stockStatus: 'In Stock',
      images: JSON.stringify([
        'https://res.cloudinary.com/demo/image/upload/products/PHI-LED-12-CW/primary.jpg',
        'https://res.cloudinary.com/demo/image/upload/products/PHI-LED-12-CW/angle.jpg',
      ]),
    };

    const catalogProduct = toCatalogProduct(rawProduct);

    expect(catalogProduct.id).toBe('prod-456');
    expect(catalogProduct.sku).toBe('PHI-LED-12-CW');
    expect(catalogProduct.name).toBe('Philips LED Bulb 12W Cool White');
    expect(catalogProduct.price).toBe(12.5);
    expect(catalogProduct.images).toHaveLength(2);
    expect(catalogProduct.images[0]).toContain('primary.jpg');

    // Gallery structured response check (Task 49 & Task 51)
    expect(catalogProduct.imageGallery).toBeDefined();
    expect(catalogProduct.imageGallery?.length).toBe(2);
    expect(catalogProduct.imageGallery?.[0].isPrimary).toBe(true);
    expect(catalogProduct.imageGallery?.[0].sortOrder).toBe(0);
    expect(catalogProduct.imageGallery?.[1].isPrimary).toBe(false);
    expect(catalogProduct.imageGallery?.[1].sortOrder).toBe(1);
  });

  it('provides safe fallback when product has no images (Task 50)', () => {
    const rawProduct: Product = {
      id: 'prod-no-img',
      sku: 'NO-IMG-001',
      slug: 'item-no-image',
      name: 'Item without image',
      brand: 'Generic',
      category: 'Hardware',
      subcategory: 'Bolts',
      price: '5.00',
      minPrice: '5.00',
      maxPrice: '5.00',
      pricePoints: '1',
      shortDescription: '',
      stockStatus: 'In Stock',
      images: null,
    };

    const catalogProduct = toCatalogProduct(rawProduct);
    expect(catalogProduct.images.length).toBeGreaterThan(0);
    expect(catalogProduct.images[0]).toBe('/images/categories/led-bulb.jpg');
  });
});
