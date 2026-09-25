export class ImageSearchError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'ImageSearchError';
  }
}

export class SearchProviderError extends ImageSearchError {
  constructor(
    public readonly providerName: string,
    message: string,
    cause?: unknown
  ) {
    super(`[${providerName}] Search failed: ${message}`, cause);
    this.name = 'SearchProviderError';
  }
}

export class ImageValidationError extends ImageSearchError {
  constructor(
    public readonly url: string,
    public readonly reason: string
  ) {
    super(`Image validation failed for "${url}": ${reason}`);
    this.name = 'ImageValidationError';
  }
}
