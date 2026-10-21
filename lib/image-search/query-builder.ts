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
 * Extracts catalog/part numbers (e.g. Legrand Cat. No. 0104 22 -> "Legrand 010422")
 * or forms a concise, high-relevance search query.
 */
export function buildImageSearchQuery(product: Partial<Product>): string {
  const brand = (product.brand ?? 'Legrand').trim();
  const name = (product.name ?? '').trim();
  const sku = (product.sku ?? '').trim();
  const subcategory = (product.subcategory ?? '').trim();

  // 1. Check for Cat. No. or catalog number (e.g. Cat. No. 0104 22 or 5733 71)
  const catNoMatch = name.match(/Cat\.?\s*No\.?\s*([0-9\sA-Za-z]+)\)?/i);
  if (catNoMatch && catNoMatch[1]) {
    const cleanNo = catNoMatch[1].replace(/[^0-9A-Za-z]/g, '').trim();
    if (cleanNo.length >= 4) {
      return `${brand} ${cleanNo}`;
    }
  }

  // 2. Otherwise build clean concise query from brand, clean name and subcategory
  const cleanName = name
    .replace(/\(.*?\)/g, '')
    .replace(/[-–—/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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

  if (brand && brand.toLowerCase() !== 'unknown') {
    addTokens(brand);
  }

  addTokens(cleanName);

  if (subcategory && !seenLowerTokens.has(subcategory.toLowerCase())) {
    addTokens(subcategory);
  }

  // Limit query to at most 6-7 tokens for optimal image search indexing
  return collectedTokens.slice(0, 7).join(' ');
}
