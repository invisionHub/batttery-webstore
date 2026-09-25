import { Product } from '@/database/types';

// Stop words or filler terms that add noise to image search engines
const NOISE_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'for',
  'with',
  'in',
  'on',
  'at',
  'to',
  'by',
  'item',
  'product',
]);

/**
 * Normalizes and cleans individual token strings.
 */
function cleanToken(token: string): string {
  return token.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
}

/**
 * Builds an optimal, high-signal image search query for an e-commerce product.
 * Prioritizes brand, canonical product name, model/SKU, and category while stripping duplicate tokens and noise.
 */
export function buildImageSearchQuery(product: Partial<Product>): string {
  const brand = (product.brand ?? '').trim();
  const name = (product.name ?? '').trim();
  const sku = (product.sku ?? '').trim();
  const category = (product.category ?? '').trim();
  const subcategory = (product.subcategory ?? '').trim();

  const collectedTokens: string[] = [];
  const seenLowerTokens = new Set<string>();

  const addTokens = (text: string) => {
    if (!text) return;
    const parts = text.split(/[\s,/_+-]+/);
    for (const raw of parts) {
      const cleaned = cleanToken(raw);
      if (!cleaned) continue;
      const lower = cleaned.toLowerCase();
      if (!seenLowerTokens.has(lower) && !NOISE_WORDS.has(lower)) {
        seenLowerTokens.add(lower);
        collectedTokens.push(cleaned);
      }
    }
  };

  // 1. Add Brand first for highest priority
  if (brand && brand.toLowerCase() !== 'unknown' && brand.toLowerCase() !== 'generic') {
    addTokens(brand);
  }

  // 2. Add Product Name
  if (name) {
    addTokens(name);
  }

  // 3. Add SKU / Model intact if distinct and alphanumeric
  if (sku && sku.length >= 3) {
    const cleanedSku = cleanToken(sku);
    if (cleanedSku && !seenLowerTokens.has(cleanedSku.toLowerCase())) {
      seenLowerTokens.add(cleanedSku.toLowerCase());
      collectedTokens.push(cleanedSku);
    }
  }

  // 4. Add Category & Subcategory if not already captured
  if (category && !seenLowerTokens.has(category.toLowerCase())) {
    addTokens(category);
  }
  if (subcategory && !seenLowerTokens.has(subcategory.toLowerCase())) {
    addTokens(subcategory);
  }

  return collectedTokens.join(' ');
}
