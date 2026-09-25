import { Product } from '@/database/types';
import { ProductImage } from '@/database/repository/products/interfaces/product-image.interfaces';
import { productImageRepository } from '@/database/repository/products/product-image.repository';
import { cloudinaryService } from '@/lib/cloudinary/cloudinary.service';
import { buildImageSearchQuery } from './query-builder';
import { calculateConfidence, DEFAULT_CONFIDENCE_THRESHOLD } from './confidence-scorer';
import { defaultImageValidator, ImageValidator } from './validator';
import { defaultImageSearchService, IImageSearchService } from './service';
import { ConfidenceScoreResult, ImageCandidate } from './types';
import { ImageSearchError } from './errors';
import { withPipelineRetry, PipelineStage, PipelineExecutionError } from './pipeline-errors';

export type EnrichmentStatus =
  | 'SUCCESS'
  | 'REVIEW_REQUIRED'
  | 'SKIPPED_EXISTING'
  | 'NOT_FOUND'
  | 'FAILED';

export interface EnrichmentResult {
  productId: string;
  sku: string | null;
  status: EnrichmentStatus;
  primaryImage?: ProductImage;
  candidate?: ImageCandidate;
  confidence?: ConfidenceScoreResult;
  reason?: string;
  error?: string;
  stage?: PipelineStage;
}

export interface EnrichmentOptions {
  confidenceThreshold?: number;
  forceOverwrite?: boolean;
  uploadLowConfidenceForReview?: boolean;
  maxRetries?: number;
}

export class ProductImageEnricher {
  constructor(
    private readonly searchService: IImageSearchService = defaultImageSearchService,
    private readonly validator: ImageValidator = defaultImageValidator,
    private readonly repo = productImageRepository,
    private readonly cloudinary = cloudinaryService
  ) {}

  /**
   * Enriches a single product with an authoritative primary image.
   * Follows strict idempotency, multi-candidate fallback, validation, and consistency rollback.
   */
  async enrichProductImage(
    product: Product,
    options: EnrichmentOptions = {}
  ): Promise<EnrichmentResult> {
    const threshold = options.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;
    const maxRetries = options.maxRetries ?? 2;
    const sku = product.sku || product.id;

    // 1. Task 22: Idempotent Existing Image Check
    if (!options.forceOverwrite) {
      try {
        const existingPrimary = await this.repo.findPrimaryByProductId(product.id);
        if (existingPrimary) {
          return {
            productId: product.id,
            sku: product.sku,
            status: 'SKIPPED_EXISTING',
            primaryImage: existingPrimary,
            reason: 'Product already has an existing primary image record.',
          };
        }
      } catch (err) {
        console.warn(`[Enricher] Warning checking existing primary image for ${product.id}:`, err);
      }
    }

    // 2. Task 14: Build Search Query
    const query = buildImageSearchQuery(product);
    if (!query) {
      const err = new PipelineExecutionError({
        sku,
        productId: product.id,
        stage: 'INIT',
        message: 'Unable to construct search query (insufficient product attributes).',
        isRetryable: false,
        attempt: 1,
        timestamp: new Date().toISOString(),
      });
      console.warn(err.formatLog());
      return {
        productId: product.id,
        sku: product.sku,
        status: 'FAILED',
        stage: 'INIT',
        reason: 'Unable to construct search query (insufficient product attributes).',
        error: err.message,
      };
    }

    // 3. Search Candidates with Transient Error Retries (Task 29 & Task 34)
    let candidates: ImageCandidate[] = [];
    try {
      candidates = await withPipelineRetry(
        () => this.searchService.search(query, { limit: 5 }),
        {
          stage: 'IMAGE_SEARCH',
          sku,
          productId: product.id,
          maxAttempts: maxRetries,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Enricher] Retrying image search for ${sku} (attempt ${attempt}): ${error instanceof Error ? error.message : String(error)}. Waiting ${delay}ms...`
            );
          },
        }
      );
    } catch (err: unknown) {
      if (err instanceof PipelineExecutionError) {
        console.error(err.formatLog());
      }
      return {
        productId: product.id,
        sku: product.sku,
        status: 'FAILED',
        stage: 'IMAGE_SEARCH',
        error: err instanceof Error ? err.message : 'Search provider failure',
      };
    }

    if (!candidates || candidates.length === 0) {
      return {
        productId: product.id,
        sku: product.sku,
        status: 'NOT_FOUND',
        stage: 'IMAGE_SEARCH',
        reason: `No image candidates found for query: "${query}"`,
      };
    }

    // 4. Task 15 & 16: Score and Rank Candidates
    const scoredCandidates = candidates.map((candidate) => ({
      candidate,
      confidence: calculateConfidence(product, candidate, threshold),
    }));

    // Sort descending by confidence score
    scoredCandidates.sort((a, b) => b.confidence.score - a.confidence.score);

    // 5. Task 23: Select Best Valid Candidate with Fallback (Task 30)
    let selectedCandidate: ImageCandidate | null = null;
    let selectedConfidence: ConfidenceScoreResult | null = null;
    let validationFailureReason: string | undefined;

    for (const item of scoredCandidates) {
      const validation = await this.validator.validate(item.candidate.imageUrl);
      if (validation.isValid) {
        selectedCandidate = item.candidate;
        selectedConfidence = item.confidence;
        break;
      } else {
        validationFailureReason = validation.error;
      }
    }

    if (!selectedCandidate || !selectedConfidence) {
      const err = new PipelineExecutionError({
        sku,
        productId: product.id,
        stage: 'IMAGE_VALIDATION',
        message: `All ${candidates.length} candidates failed validation. Last error: ${validationFailureReason}`,
        isRetryable: false,
        attempt: 1,
        timestamp: new Date().toISOString(),
      });
      console.warn(err.formatLog());

      return {
        productId: product.id,
        sku: product.sku,
        status: 'FAILED',
        stage: 'IMAGE_VALIDATION',
        reason: err.info.message,
        error: err.message,
      };
    }

    const isHighConfidence = selectedConfidence.isApproved;
    const targetStatus = isHighConfidence ? 'UPLOADED' : 'REVIEW_REQUIRED';

    // If candidate does not meet threshold and option doesn't allow upload for review, stop here
    if (!isHighConfidence && !options.uploadLowConfidenceForReview) {
      return {
        productId: product.id,
        sku: product.sku,
        status: 'REVIEW_REQUIRED',
        stage: 'IMAGE_MATCHING',
        candidate: selectedCandidate,
        confidence: selectedConfidence,
        reason: `Highest candidate scored ${selectedConfidence.score}/100, which is below threshold of ${threshold}.`,
      };
    }

    // 6. Task 24: Upload to Cloudinary with Retry Logic (Task 31 & Task 34)
    let uploadedPublicId: string | null = null;
    let secureUrl: string | null = null;

    try {
      const uploadResult = await withPipelineRetry(
        () =>
          this.cloudinary.upload({
            file: selectedCandidate!.imageUrl,
            folder: `products/${sku}`,
            publicId: 'primary',
            overwrite: Boolean(options.forceOverwrite),
          }),
        {
          stage: 'CLOUDINARY_UPLOAD',
          sku,
          productId: product.id,
          maxAttempts: maxRetries,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Enricher] Retrying Cloudinary upload for ${sku} (attempt ${attempt}). Waiting ${delay}ms...`
            );
          },
        }
      );

      uploadedPublicId = uploadResult.publicId;
      secureUrl = uploadResult.secureUrl;
    } catch (uploadErr) {
      if (uploadErr instanceof PipelineExecutionError) {
        console.error(uploadErr.formatLog());
      }
      return {
        productId: product.id,
        sku: product.sku,
        status: 'FAILED',
        stage: 'CLOUDINARY_UPLOAD',
        candidate: selectedCandidate,
        confidence: selectedConfidence,
        error: `Cloudinary upload failed: ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}`,
      };
    }

    // 7. Task 25: Save Database Record & Transaction/Consistency Rollback Handling (Task 32)
    try {
      const savedRecord = await this.repo.create({
        productId: product.id,
        cloudinaryPublicId: uploadedPublicId,
        cloudinaryUrl: secureUrl,
        sourceUrl: selectedCandidate.sourceUrl,
        source: selectedCandidate.source ?? 'web-search',
        confidenceScore: (selectedConfidence.score / 100).toFixed(4),
        status: targetStatus,
        altText: `${product.name} - Primary Product View`,
        sortOrder: 0,
        isPrimary: true,
      });

      return {
        productId: product.id,
        sku: product.sku,
        status: isHighConfidence ? 'SUCCESS' : 'REVIEW_REQUIRED',
        primaryImage: savedRecord,
        candidate: selectedCandidate,
        confidence: selectedConfidence,
      };
    } catch (dbErr) {
      // Consistency rollback: prevent orphaned Cloudinary assets!
      if (uploadedPublicId) {
        try {
          console.warn(
            `[Enricher] Rolling back Cloudinary asset "${uploadedPublicId}" due to database failure...`
          );
          await this.cloudinary.delete(uploadedPublicId);
        } catch (rollbackErr) {
          console.error(
            `[Enricher] Failed to rollback orphaned Cloudinary asset "${uploadedPublicId}":`,
            rollbackErr
          );
        }
      }

      const structErr = new PipelineExecutionError({
        sku,
        productId: product.id,
        stage: 'DATABASE_PERSISTENCE',
        message: `Database insert failed after upload. Rolled back Cloudinary asset.`,
        isRetryable: false,
        attempt: 1,
        originalError: dbErr,
        timestamp: new Date().toISOString(),
      });
      console.error(structErr.formatLog());

      throw new ImageSearchError(structErr.message, dbErr);
    }
  }
}

export const defaultProductImageEnricher = new ProductImageEnricher();
