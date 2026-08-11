// ============================================
// MOCK API LAYER
// All functions simulate real API calls with
// a delay. Replace fetch() calls in Week 5
// when backend is ready.
// ============================================

import {
  mockProducts,
  mockCategories,
  mockBrands,
  mockFeaturedProducts,
  type Product,
  type Category,
  type Brand,
} from '@/lib/mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Simulate occasional errors for testing (5% chance)
const maybeThrow = () => {
  if (process.env.NODE_ENV === 'test' && Math.random() < 0.05) {
    throw new Error('Simulated API error');
  }
};

// ─────────────────────────────────────────
// PRODUCT FILTERS TYPE
// ─────────────────────────────────────────
export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number | null;
  inStockOnly?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// ─────────────────────────────────────────
// PRODUCTS API
// ─────────────────────────────────────────

// GET /products — with filtering, sorting, pagination
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  await delay(400); // simulate network latency
  maybeThrow();

  const {
    search = '',
    category,
    brand,
    priceMin = 0,
    priceMax = 999999,
    rating,
    inStockOnly = false,
    sort = 'popular',
    page = 1,
    limit = 12,
  } = filters;

  let result = [...mockProducts];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category) {
    result = result.filter((p) => p.category === category);
  }

  // Brand filter
  if (brand) {
    result = result.filter((p) => p.brand === brand);
  }

  // Price filter
  result = result.filter((p) => p.price >= priceMin && p.price <= priceMax);

  // Rating filter
  if (rating !== null && rating !== undefined) {
    result = result.filter((p) => p.rating >= rating);
  }

  // In stock filter
  if (inStockOnly) {
    result = result.filter((p) => p.inStock);
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result = result.reverse();
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  return {
    products: paginated,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

// GET /products/:slug — single product by slug
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await delay(300);
  maybeThrow();

  const product = mockProducts.find((p) => p.slug === slug) ?? null;
  return product;
}

// GET /products/featured — homepage featured products
export async function fetchFeaturedProducts(): Promise<Product[]> {
  await delay(350);
  return mockFeaturedProducts;
}

// GET /products/related/:category — related products
export async function fetchRelatedProducts(
  category: string,
  excludeId: string,
  limit = 4
): Promise<Product[]> {
  await delay(300);

  const related = mockProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, limit);

  const needed = limit - related.length;
  if (needed > 0) {
    const fallback = mockProducts
      .filter((p) => p.id !== excludeId && !related.some((r) => r.id === p.id))
      .slice(0, needed);
    return [...related, ...fallback];
  }

  return related;
}

// ─────────────────────────────────────────
// CATEGORIES API
// ─────────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  await delay(300);
  return mockCategories;
}

// ─────────────────────────────────────────
// BRANDS API
// ─────────────────────────────────────────
export async function fetchBrands(): Promise<Brand[]> {
  await delay(300);
  return mockBrands;
}
