import { productRepository } from '../database/repository/products/product.repository';
import { Product } from '../database/types';
import {
  buildImageSearchQuery,
  calculateConfidence,
  ImageSearchService,
  MockSearchProvider,
  defaultImageValidator,
  DEFAULT_CONFIDENCE_THRESHOLD,
} from '../lib/image-search';

async function runTask13Test() {
  console.log('====================================================');
  console.log('Task 13 — Image Search & Scoring on 10 Catalog Products');
  console.log('====================================================\n');

  // 1. Fetch 10 products from DB (or fallback)
  let products = await productRepository.getAllProducts();
  if (!products || products.length === 0) {
    console.log('No products found in DB, using sample catalog products...');
    products = [
      {
        id: '1',
        sku: 'ACC010',
        name: '38mm DEPTH 2MODULE 1G- PATRESS',
        brand: 'Appleby',
        category: 'Wiring Devices',
        subcategory: 'Back Boxes',
      } as unknown as Product,
    ];
  }

  const testSubset = products.slice(0, 10);
  console.log(`Loaded ${testSubset.length} products for image search pipeline test.\n`);

  const searchService = new ImageSearchService(new MockSearchProvider());

  let totalProcessed = 0;
  let approvedCount = 0;
  let reviewCount = 0;

  for (const product of testSubset) {
    totalProcessed++;
    const query = buildImageSearchQuery(product);
    console.log(`[Product ${totalProcessed}] SKU: ${product.sku} | Name: ${product.name}`);
    console.log(`  -> Generated Search Query: "${query}"`);

    const candidates = await searchService.search(query, { limit: 3 });
    console.log(`  -> Found ${candidates.length} candidates.`);

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const evaluation = calculateConfidence(product, candidate, DEFAULT_CONFIDENCE_THRESHOLD);
      const validation = await defaultImageValidator.validate(candidate.imageUrl);

      console.log(`     Candidate ${i + 1}: "${candidate.title}"`);
      console.log(
        `       Score: ${evaluation.score}/100 [Approved: ${evaluation.isApproved ? 'YES' : 'NO (Review Required)'}]`
      );
      console.log(
        `       Breakdown: Brand=${evaluation.breakdown.brandScore}/30, Name=${evaluation.breakdown.nameScore}/25, Model=${evaluation.breakdown.modelScore}/25, Quality=${evaluation.breakdown.qualityScore}/5`
      );
      console.log(
        `       Validation: Valid URL=${validation.isValid ? 'YES' : 'NO'} (${validation.mimeType || 'unknown'})`
      );

      if (i === 0) {
        if (evaluation.isApproved) {
          approvedCount++;
        } else {
          reviewCount++;
        }
      }
    }
    console.log('');
  }

  console.log('====================================================');
  console.log(`Summary of 10 Products Test:`);
  console.log(`- Processed Products: ${totalProcessed}`);
  console.log(`- High Confidence (>= ${DEFAULT_CONFIDENCE_THRESHOLD}): ${approvedCount}`);
  console.log(`- Review Required (< ${DEFAULT_CONFIDENCE_THRESHOLD}): ${reviewCount}`);
  console.log('====================================================\n');
}

runTask13Test().catch((err) => {
  console.error('Task 13 Test failed:', err);
  process.exit(1);
});
