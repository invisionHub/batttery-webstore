/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import {
  isRetryableError,
  withPipelineRetry,
  PipelineExecutionError,
} from '@/lib/image-search/pipeline-errors';
import { ReviewManager, ReviewEntry } from '@/lib/image-search/review-manager';

describe('Error Handling, Retry System & Review Workflow (Phases 11–13)', () => {
  describe('Phase 11 & 12: Error Classification & Retries (Tasks 29–34)', () => {
    it('classifies network timeouts and HTTP 429/503 as retryable', () => {
      expect(isRetryableError(new Error('ETIMEDOUT connection timed out'), 'IMAGE_SEARCH')).toBe(true);
      expect(isRetryableError(new Error('Rate limit exceeded: 429 Too Many Requests'), 'IMAGE_SEARCH')).toBe(true);
      expect(isRetryableError(new Error('Cloudinary 503 Service Temporarily Unavailable'), 'CLOUDINARY_UPLOAD')).toBe(true);
    });

    it('classifies 401 unauthorized and invalid image formats as non-retryable', () => {
      expect(isRetryableError(new Error('401 Invalid API Key'), 'IMAGE_SEARCH')).toBe(false);
      expect(isRetryableError(new Error('Unsupported format (image/svg+xml)'), 'IMAGE_VALIDATION')).toBe(false);
      expect(isRetryableError(new Error('Image file too small (12 bytes)'), 'IMAGE_VALIDATION')).toBe(false);
    });

    it('retries transient failures up to maxAttempts with exponential backoff', async () => {
      let attempts = 0;
      const transientFn = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('ETIMEDOUT gateway timeout');
        }
        return 'success-payload';
      });

      const onRetry = vi.fn();
      const result = await withPipelineRetry(transientFn, {
        stage: 'IMAGE_SEARCH',
        sku: 'SKU-RETRY-01',
        productId: 'prod-01',
        maxAttempts: 3,
        initialDelayMs: 10,
        backoffFactor: 2,
        onRetry,
      });

      expect(result).toBe('success-payload');
      expect(attempts).toBe(3);
      expect(onRetry).toHaveBeenCalledTimes(2);
    });

    it('immediately aborts and formats structured error log on non-retryable error', async () => {
      const nonRetryableFn = vi.fn().mockRejectedValue(new Error('401 Unauthorized API access'));

      await expect(
        withPipelineRetry(nonRetryableFn, {
          stage: 'IMAGE_SEARCH',
          sku: 'SKU-AUTH-01',
          productId: 'prod-02',
          maxAttempts: 3,
        })
      ).rejects.toThrow(PipelineExecutionError);

      try {
        await withPipelineRetry(nonRetryableFn, {
          stage: 'IMAGE_SEARCH',
          sku: 'SKU-AUTH-01',
          productId: 'prod-02',
          maxAttempts: 3,
        });
      } catch (err: any) {
        expect(err.info.isRetryable).toBe(false);
        const log = err.formatLog();
        expect(log).toContain('[FAILED]');
        expect(log).toContain('SKU:      SKU-AUTH-01');
        expect(log).toContain('Stage:    IMAGE_SEARCH');
        expect(log).toContain('Retry:    NO');
      }
    });
  });

  describe('Phase 13: Review Candidate CSV & Manual Workflow (Tasks 36–38)', () => {
    it('generates well-formatted RFC 4180 CSV with headers and escaping', () => {
      const reviewManager = new ReviewManager({} as any, {} as any);
      const entries: ReviewEntry[] = [
        {
          sku: 'TEST-SKU-001',
          productName: 'Ingco 900W Grinder "Special Edition"',
          candidateImage: 'https://example.com/img1.jpg',
          sourceUrl: 'https://store.example/grinder',
          confidenceScore: 78.5,
          status: 'REVIEW_REQUIRED',
          reason: 'Model mismatch with title',
        },
      ];

      const csv = reviewManager.generateCsvContent(entries);
      expect(csv).toContain('SKU,Product,Candidate Image,Source URL,Confidence Score,Status,Reason');
      expect(csv).toContain('"TEST-SKU-001"');
      expect(csv).toContain('"Ingco 900W Grinder ""Special Edition"""');
      expect(csv).toContain('"78.50"');
      expect(csv).toContain('"REVIEW_REQUIRED"');
    });

    it('approves review candidate and updates database status (Task 38)', async () => {
      const mockRepo = {
        updateStatus: vi.fn().mockResolvedValue({ id: 'img-123', status: 'UPLOADED' }),
      };
      const reviewManager = new ReviewManager(mockRepo as any, {} as any);

      const result = await reviewManager.approveCandidate('img-123');
      expect(mockRepo.updateStatus).toHaveBeenCalledWith('img-123', 'UPLOADED');
      expect(result.status).toBe('UPLOADED');
    });

    it('rejects candidate and removes uploaded Cloudinary asset (Task 38)', async () => {
      const mockRepo = {
        findByCloudinaryPublicId: vi.fn().mockResolvedValue({
          id: 'img-123',
          cloudinaryPublicId: 'products/TEST/primary',
        }),
        updateStatus: vi.fn().mockResolvedValue({ id: 'img-123', status: 'FAILED' }),
      };
      const mockCloudinary = {
        delete: vi.fn().mockResolvedValue({ deleted: true }),
      };

      const reviewManager = new ReviewManager(mockRepo as any, mockCloudinary as any);
      await reviewManager.rejectCandidate('products/TEST/primary', true);

      expect(mockCloudinary.delete).toHaveBeenCalledWith('products/TEST/primary');
      expect(mockRepo.updateStatus).toHaveBeenCalledWith('products/TEST/primary', 'FAILED');
    });
  });
});
