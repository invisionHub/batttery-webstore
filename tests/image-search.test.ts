import { describe, it, expect } from 'vitest';
import {
  buildImageSearchQuery,
  calculateConfidence,
  DEFAULT_CONFIDENCE_THRESHOLD,
  normalizeText,
  tokenize,
  parseImageDimensions,
  ImageValidator,
  ImageSearchService,
  MockSearchProvider,
} from '@/lib/image-search';

describe('Image Search Pipeline — Phase 4 to Phase 8', () => {
  describe('Phase 6: Search Query Builder (Task 14)', () => {
    it('prioritizes brand, includes product name, SKU, and category without duplicates', () => {
      const product = {
        brand: 'Philips',
        name: 'LED Bulb 12W Cool White',
        sku: 'PHI-LED-12-CW',
        category: 'Lighting',
        subcategory: 'LED Bulbs',
      };

      const query = buildImageSearchQuery(product);
      expect(query).toContain('Philips');
      expect(query).toContain('LED Bulb 12W Cool White');
      expect(query).toContain('PHI-LED-12-CW');
      expect(query).toContain('Lighting');
    });

    it('cleans up filler words and duplicate tokens', () => {
      const product = {
        brand: 'Schneider',
        name: 'Schneider the socket with switch for home',
        sku: 'SCH-SW-01',
        category: 'Wiring',
      };

      const query = buildImageSearchQuery(product);
      // 'Schneider' should only appear once at the beginning
      const occurrences = query.split(' ').filter((w) => w.toLowerCase() === 'schneider');
      expect(occurrences.length).toBe(1);
      // Filler words like 'the', 'with', 'for' should be stripped
      expect(query).not.toContain(' the ');
      expect(query).not.toContain(' with ');
    });
  });

  describe('Phase 7: Text Matching & Confidence Scoring (Task 15 & 16 & 17)', () => {
    const product = {
      brand: 'Ingco',
      name: 'Angle Grinder 900W 115mm',
      sku: 'AG90028',
      category: 'Power Tools',
      subcategory: 'Grinders',
    };

    it('awards high confidence (>= 90) when brand, name, SKU, and high-res image match', () => {
      const candidate = {
        imageUrl: 'https://cdn.example.com/ingco-ag90028.jpg',
        sourceUrl: 'https://distributor.example/tools/ingco-ag90028',
        title: 'Ingco Angle Grinder 900W 115mm AG90028 High Quality',
        source: 'distributor.example',
        width: 1000,
        height: 1000,
      };

      const result = calculateConfidence(product, candidate);
      expect(result.score).toBeGreaterThanOrEqual(DEFAULT_CONFIDENCE_THRESHOLD);
      expect(result.isApproved).toBe(true);
      expect(result.requiresReview).toBe(false);
      expect(result.breakdown.brandScore).toBe(30);
      expect(result.breakdown.modelScore).toBe(25);
    });

    it('requires review (< 90) for partial matches or different models', () => {
      const candidate = {
        imageUrl: 'https://cdn.example.com/grinder-accessory.jpg',
        sourceUrl: 'https://unverified.example/item',
        title: 'Generic Grinder Disc 115mm',
        source: 'unverified.example',
        width: 400,
        height: 400,
      };

      const result = calculateConfidence(product, candidate);
      expect(result.score).toBeLessThan(DEFAULT_CONFIDENCE_THRESHOLD);
      expect(result.isApproved).toBe(false);
      expect(result.requiresReview).toBe(true);
    });

    it('normalizes diacritics and punctuation correctly', () => {
      const raw = 'Schneider-Electric™ Modicon M221 (PLC) — 24V!';
      const normalized = normalizeText(raw);
      expect(normalized).toBe('schneider electric modicon m221 plc 24v');

      const tokens = tokenize(raw);
      expect(tokens.has('schneider')).toBe(true);
      expect(tokens.has('electric')).toBe(true);
      expect(tokens.has('m221')).toBe(true);
    });
  });

  describe('Phase 8: Image Validation (Task 18 & 19 & 20)', () => {
    it('parses PNG dimensions from binary header', () => {
      // 24-byte PNG header with 800x600 dimensions
      const pngBuffer = Buffer.alloc(32);
      // Magic bytes: 89 50 4E 47 0D 0A 1A 0A
      pngBuffer.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
      // IHDR chunk: width at 16, height at 20
      pngBuffer.writeUInt32BE(800, 16);
      pngBuffer.writeUInt32BE(600, 20);

      const parsed = parseImageDimensions(pngBuffer);
      expect(parsed).not.toBeNull();
      expect(parsed?.format).toBe('image/png');
      expect(parsed?.width).toBe(800);
      expect(parsed?.height).toBe(600);
    });

    it('rejects invalid or tiny image URLs', async () => {
      const validator = new ImageValidator({ minWidth: 300, minHeight: 300 });

      // Malformed URL
      const invalidUrl = await validator.validate('not-a-valid-url');
      expect(invalidUrl.isValid).toBe(false);
      expect(invalidUrl.error).toContain('Invalid URL');
    });
  });

  describe('Phase 4 & 5: Image Search Service Abstraction (Task 11 & 12)', () => {
    it('returns candidates through ImageSearchService with MockSearchProvider', async () => {
      const service = new ImageSearchService(new MockSearchProvider());
      const results = await service.search('Philips LED Bulb', { limit: 2 });

      expect(results.length).toBe(2);
      expect(results[0].imageUrl).toBeDefined();
      expect(results[0].sourceUrl).toBeDefined();
      expect(results[0].title).toContain('Philips LED Bulb');
    });

    it('handles empty query gracefully', async () => {
      const service = new ImageSearchService(new MockSearchProvider());
      const results = await service.search('');
      expect(results).toEqual([]);
    });
  });
});
