export interface ImageCandidate {
  imageUrl: string;
  sourceUrl: string;
  title?: string;
  width?: number;
  height?: number;
  source?: string;
  format?: string;
}

export interface ImageSearchOptions {
  limit?: number;
  safeSearch?: boolean;
}

export interface ImageSearchProvider {
  readonly name: string;
  search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]>;
}

export interface ConfidenceBreakdown {
  brandScore: number;
  nameScore: number;
  modelScore: number;
  categoryScore: number;
  qualityScore: number;
  sourceTrustScore: number;
}

export interface ConfidenceScoreResult {
  score: number;
  isApproved: boolean;
  requiresReview: boolean;
  breakdown: ConfidenceBreakdown;
  matchedTokens: string[];
}

export interface ImageValidationRequirements {
  minWidth?: number;
  minHeight?: number;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  timeoutMs?: number;
}

export interface ImageValidationResult {
  isValid: boolean;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  error?: string;
}
