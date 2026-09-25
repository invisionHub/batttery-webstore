import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { productImageRepository } from '@/database/repository/products/product-image.repository';
import { cloudinaryService } from '@/lib/cloudinary/cloudinary.service';
import { ImageStatus } from '@/database/repository/products/interfaces/product-image.interfaces';

export interface ReviewEntry {
  sku: string;
  productName: string;
  candidateImage: string;
  sourceUrl: string;
  confidenceScore: number;
  status: 'REVIEW_REQUIRED' | 'FAILED' | 'NOT_FOUND';
  reason?: string;
}

export class ReviewManager {
  constructor(
    private readonly repo = productImageRepository,
    private readonly cloudinary = cloudinaryService
  ) {}

  /**
   * Generates a CSV string compliant with RFC 4180 from review entries.
   */
  generateCsvContent(entries: ReviewEntry[]): string {
    const headers = [
      'SKU',
      'Product',
      'Candidate Image',
      'Source URL',
      'Confidence Score',
      'Status',
      'Reason',
    ];

    const escapeCsv = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = entries.map((entry) => [
      escapeCsv(entry.sku),
      escapeCsv(entry.productName),
      escapeCsv(entry.candidateImage),
      escapeCsv(entry.sourceUrl),
      escapeCsv(entry.confidenceScore.toFixed(2)),
      escapeCsv(entry.status),
      escapeCsv(entry.reason ?? ''),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  /**
   * Writes the image-review.csv file to the workspace.
   */
  async exportCsvFile(
    entries: ReviewEntry[],
    outputPath: string = 'image-review.csv'
  ): Promise<string> {
    const csvContent = this.generateCsvContent(entries);
    const resolvedPath = path.resolve(process.cwd(), outputPath);
    await writeFile(resolvedPath, csvContent, 'utf-8');
    return resolvedPath;
  }

  /**
   * Manually approves a review candidate:
   * Updates its status to 'UPLOADED' and sets it as primary image.
   */
  async approveCandidate(
    imageId: string,
    options?: { overrideStatus?: ImageStatus }
  ) {
    const status = options?.overrideStatus ?? 'UPLOADED';
    return await this.repo.updateStatus(imageId, status);
  }

  /**
   * Manually rejects a review candidate:
   * Marks as 'REJECTED' or deletes record.
   */
  async rejectCandidate(imageId: string, removeAsset: boolean = true) {
    if (removeAsset) {
      // Find asset to delete from Cloudinary if uploaded
      const existing = await this.repo.findByCloudinaryPublicId(imageId);
      if (existing?.cloudinaryPublicId) {
        try {
          await this.cloudinary.delete(existing.cloudinaryPublicId);
        } catch (err) {
          console.warn(`[ReviewManager] Failed deleting Cloudinary asset on reject:`, err);
        }
      }
    }
    return await this.repo.updateStatus(imageId, 'FAILED');
  }
}

export const defaultReviewManager = new ReviewManager();
