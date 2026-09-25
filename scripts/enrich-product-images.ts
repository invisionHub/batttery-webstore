import { productRepository } from '../database/repository/products/product.repository';
import { productImageRepository } from '../database/repository/products/product-image.repository';
import { defaultProductImageEnricher, EnrichmentResult } from '../lib/image-search/enricher.service';
import { ReviewEntry, defaultReviewManager } from '../lib/image-search/review-manager';
import { Product } from '../database/types';

interface BatchOptions {
  batchSize: number;
  delayMs: number;
  limit?: number;
  forceOverwrite: boolean;
  uploadLowConfidenceForReview: boolean;
  retryFailedOnly: boolean;
  exportCsvPath: string;
}

function parseCliArgs(): BatchOptions {
  const args = process.argv.slice(2);
  const options: BatchOptions = {
    batchSize: 5,
    delayMs: 1000,
    forceOverwrite: false,
    uploadLowConfidenceForReview: false,
    retryFailedOnly: false,
    exportCsvPath: 'image-review.csv',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      options.limit = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--batch-size' && args[i + 1]) {
      options.batchSize = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--delay' && args[i + 1]) {
      options.delayMs = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--force') {
      options.forceOverwrite = true;
    } else if (args[i] === '--include-reviews') {
      options.uploadLowConfidenceForReview = true;
    } else if (args[i] === '--retry-failed') {
      options.retryFailedOnly = true;
    } else if (args[i] === '--csv' && args[i + 1]) {
      options.exportCsvPath = args[i + 1];
      i++;
    }
  }

  return options;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

async function runBatchEnrichment() {
  const options = parseCliArgs();

  const allProducts: Product[] = await productRepository.getAllProducts();
  const totalFound = allProducts.length;

  // Fast bulk query for all existing primary images
  const primaryProductIds = await productImageRepository.findAllPrimaryProductIds();
  const alreadyProcessedCount = primaryProductIds.size;

  const filteredProducts: Product[] = [];
  for (const prod of allProducts) {
    if (primaryProductIds.has(prod.id) && !options.forceOverwrite) {
      continue;
    }
    filteredProducts.push(prod);
  }

  const targetProducts = options.limit ? filteredProducts.slice(0, options.limit) : filteredProducts;
  const toProcessCount = targetProducts.length;

  console.log('========================================');
  console.log('PRODUCT IMAGE ENRICHMENT');
  console.log('========================================\n');
  console.log(`Products found:       ${formatNumber(totalFound)}`);
  console.log(`Already processed:    ${formatNumber(alreadyProcessedCount)}`);
  console.log(`Processing:           ${formatNumber(toProcessCount)}`);
  if (options.retryFailedOnly) {
    console.log(`Mode:                 RETRY FAILED ONLY`);
  }
  console.log('\n========================================');
  console.log('STARTING BATCH EXECUTION');
  console.log('========================================\n');

  const summary = {
    uploaded: 0,
    reviewRequired: 0,
    notFound: 0,
    failed: 0,
  };

  const reviewEntries: ReviewEntry[] = [];

  for (let i = 0; i < targetProducts.length; i += options.batchSize) {
    const batch = targetProducts.slice(i, i + options.batchSize);
    const batchNum = Math.floor(i / options.batchSize) + 1;
    const totalBatches = Math.ceil(targetProducts.length / options.batchSize);

    console.log(`[Batch ${batchNum}/${totalBatches}] Processing ${batch.length} products...`);

    const results: EnrichmentResult[] = await Promise.all(
      batch.map(async (prod) => {
        try {
          return await defaultProductImageEnricher.enrichProductImage(prod, {
            forceOverwrite: options.forceOverwrite,
            uploadLowConfidenceForReview: options.uploadLowConfidenceForReview,
          });
        } catch (err: unknown) {
          return {
            productId: prod.id,
            sku: prod.sku,
            status: 'FAILED',
            error: err instanceof Error ? err.message : String(err),
          };
        }
      })
    );

    for (let j = 0; j < results.length; j++) {
      const res = results[j];
      const prod = batch[j];

      switch (res.status) {
        case 'SUCCESS':
          summary.uploaded++;
          console.log(`  ✓ UPLOADED:         ${res.sku} -> ${res.primaryImage?.cloudinaryUrl}`);
          break;
        case 'SKIPPED_EXISTING':
          console.log(`  • SKIPPED:          ${res.sku} (already has primary image)`);
          break;
        case 'REVIEW_REQUIRED':
          summary.reviewRequired++;
          console.log(
            `  ! REVIEW_REQUIRED:  ${res.sku} (Score: ${res.confidence?.score ?? 0}/100)`
          );
          reviewEntries.push({
            sku: res.sku ?? prod.sku ?? 'UNKNOWN',
            productName: prod.name ?? 'Unknown',
            candidateImage: res.candidate?.imageUrl ?? '',
            sourceUrl: res.candidate?.sourceUrl ?? '',
            confidenceScore: res.confidence?.score ?? 0,
            status: 'REVIEW_REQUIRED',
            reason: res.reason,
          });
          break;
        case 'NOT_FOUND':
          summary.notFound++;
          console.log(`  ? NOT_FOUND:        ${res.sku} (${res.reason})`);
          reviewEntries.push({
            sku: res.sku ?? prod.sku ?? 'UNKNOWN',
            productName: prod.name ?? 'Unknown',
            candidateImage: '',
            sourceUrl: '',
            confidenceScore: 0,
            status: 'NOT_FOUND',
            reason: res.reason,
          });
          break;
        case 'FAILED':
        default:
          summary.failed++;
          console.log(`  ✗ FAILED:           ${res.sku} (${res.error || res.reason})`);
          reviewEntries.push({
            sku: res.sku ?? prod.sku ?? 'UNKNOWN',
            productName: prod.name ?? 'Unknown',
            candidateImage: res.candidate?.imageUrl ?? '',
            sourceUrl: res.candidate?.sourceUrl ?? '',
            confidenceScore: res.confidence?.score ?? 0,
            status: 'FAILED',
            reason: res.error || res.reason,
          });
          break;
      }
    }

    if (i + options.batchSize < targetProducts.length && options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  // Export CSV if there are any review candidates or failures (Task 37)
  if (reviewEntries.length > 0) {
    try {
      const csvFile = await defaultReviewManager.exportCsvFile(reviewEntries, options.exportCsvPath);
      console.log(`\nReview file generated: ${csvFile} (${reviewEntries.length} entries)`);
    } catch (csvErr) {
      console.warn('Failed to export review CSV:', csvErr);
    }
  }

  // Exact output format matching Task 28 specification
  console.log('\n========================================');
  console.log('PRODUCT IMAGE ENRICHMENT');
  console.log('========================================\n');
  console.log(`Products found:       ${formatNumber(totalFound)}\n`);
  console.log(`Already processed:    ${formatNumber(alreadyProcessedCount)}`);
  console.log(`Processing:           ${formatNumber(toProcessCount)}\n`);
  console.log(`Uploaded:             ${formatNumber(summary.uploaded)}`);
  console.log(`Review required:      ${formatNumber(summary.reviewRequired)}`);
  console.log(`Not found:            ${formatNumber(summary.notFound)}`);
  console.log(`Failed:               ${formatNumber(summary.failed)}\n`);
  console.log('========================================');
  console.log('COMPLETE');
  console.log('========================================\n');
}

runBatchEnrichment().catch((err) => {
  console.error('Fatal batch pipeline error:', err);
  process.exit(1);
});
