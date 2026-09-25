import { Product } from '@/database/types';
import { ImageCandidate, ConfidenceScoreResult } from './types';
import { containsPhrase, normalizeText, tokenize, calculateTokenOverlap } from './matcher';

export const DEFAULT_CONFIDENCE_THRESHOLD = 90;

const TRUSTED_DOMAINS = [
  'philips.com',
  'schneider-electric.com',
  'ingco.com',
  'totaltools.com',
  'makita.com',
  'bosch.com',
  'amazon.com',
  'homedepot.com',
  'electrical-supplies',
  'distributor',
  'manufacturer',
  'catalog',
];

/**
 * Calculates a confidence score (0 to 100) comparing a product against an image search candidate.
 * Follows the scoring breakdown:
 * - Brand match: up to +30
 * - Product name match: up to +25
 * - Model / SKU match: up to +25
 * - Category match: up to +10
 * - Image quality / dimensions: up to +5
 * - Trusted source: up to +5
 */
export function calculateConfidence(
  product: Partial<Product>,
  candidate: ImageCandidate,
  threshold: number = DEFAULT_CONFIDENCE_THRESHOLD
): ConfidenceScoreResult {
  const candidateText = `${candidate.title ?? ''} ${candidate.sourceUrl ?? ''} ${candidate.source ?? ''} ${candidate.imageUrl ?? ''}`;
  const candidateTokens = tokenize(candidateText);

  let brandScore = 0;
  let nameScore = 0;
  let modelScore = 0;
  let categoryScore = 0;
  let qualityScore = 0;
  let sourceTrustScore = 0;

  const allMatchedTokens: string[] = [];

  // 1. Brand match (up to 30)
  if (product.brand && product.brand.trim() && product.brand.toLowerCase() !== 'unknown') {
    const brand = product.brand.trim();
    if (containsPhrase(candidateText, brand)) {
      brandScore = 30;
      allMatchedTokens.push(brand);
    } else {
      const brandTokens = tokenize(brand);
      const overlap = calculateTokenOverlap(brandTokens, candidateTokens);
      brandScore = Math.round(overlap.ratio * 30);
      allMatchedTokens.push(...overlap.matchedTokens);
    }
  } else {
    // If product has no explicit brand, grant neutral proportional score
    brandScore = 15;
  }

  // 2. Product name match (up to 25)
  if (product.name && product.name.trim()) {
    const nameTokens = tokenize(product.name);
    const overlap = calculateTokenOverlap(nameTokens, candidateTokens);
    nameScore = Math.round(overlap.ratio * 25);
    allMatchedTokens.push(...overlap.matchedTokens);
  }

  // 3. Model / SKU match (up to 25)
  if (product.sku && product.sku.trim()) {
    const sku = normalizeText(product.sku);
    if (sku.length >= 3 && containsPhrase(candidateText, sku)) {
      modelScore = 25;
      allMatchedTokens.push(product.sku);
    } else {
      const skuTokens = tokenize(product.sku);
      const overlap = calculateTokenOverlap(skuTokens, candidateTokens);
      modelScore = Math.round(overlap.ratio * 25);
      allMatchedTokens.push(...overlap.matchedTokens);
    }
  }

  // 4. Category / Subcategory match (up to 10)
  const catString = `${product.category ?? ''} ${product.subcategory ?? ''}`.trim();
  if (catString) {
    const catTokens = tokenize(catString);
    const overlap = calculateTokenOverlap(catTokens, candidateTokens);
    categoryScore = Math.round(overlap.ratio * 10);
    allMatchedTokens.push(...overlap.matchedTokens);
  }

  // 5. Image quality / dimensions (up to 5)
  const width = candidate.width ?? 0;
  const height = candidate.height ?? 0;
  if (width >= 800 && height >= 800) {
    qualityScore = 5;
  } else if (width >= 500 && height >= 500) {
    qualityScore = 4;
  } else if (width >= 300 && height >= 300) {
    qualityScore = 3;
  } else {
    qualityScore = 2; // unknown or unstated dimension
  }

  // 6. Trusted source (up to 5)
  const sourceLower = (candidate.sourceUrl + ' ' + (candidate.source ?? '')).toLowerCase();
  const isTrusted = TRUSTED_DOMAINS.some((domain) => sourceLower.includes(domain));
  if (isTrusted) {
    sourceTrustScore = 5;
  } else {
    sourceTrustScore = 2;
  }

  const totalScore = Math.min(
    100,
    brandScore + nameScore + modelScore + categoryScore + qualityScore + sourceTrustScore
  );

  const isApproved = totalScore >= threshold;
  const requiresReview = !isApproved;

  return {
    score: totalScore,
    isApproved,
    requiresReview,
    breakdown: {
      brandScore,
      nameScore,
      modelScore,
      categoryScore,
      qualityScore,
      sourceTrustScore,
    },
    matchedTokens: Array.from(new Set(allMatchedTokens)),
  };
}
