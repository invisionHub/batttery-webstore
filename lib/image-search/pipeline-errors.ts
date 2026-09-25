export type PipelineStage =
  | 'INIT'
  | 'IMAGE_SEARCH'
  | 'IMAGE_MATCHING'
  | 'IMAGE_VALIDATION'
  | 'CLOUDINARY_UPLOAD'
  | 'DATABASE_PERSISTENCE';

export interface StructuredPipelineError {
  sku: string;
  productId: string;
  stage: PipelineStage;
  message: string;
  isRetryable: boolean;
  attempt: number;
  originalError?: unknown;
  timestamp: string;
}

export class PipelineExecutionError extends Error {
  constructor(
    public readonly info: StructuredPipelineError
  ) {
    super(`[${info.stage}] Product ${info.sku} (${info.productId}): ${info.message}`);
    this.name = 'PipelineExecutionError';
  }

  formatLog(): string {
    return [
      '----------------------------------------',
      '[FAILED]',
      `SKU:      ${this.info.sku}`,
      `Product:  ${this.info.productId}`,
      `Stage:    ${this.info.stage}`,
      `Reason:   ${this.info.message}`,
      `Retry:    ${this.info.isRetryable ? 'YES' : 'NO'}`,
      '----------------------------------------',
    ].join('\n');
  }
}

/**
 * Determines whether an error at a specific pipeline stage is transient and safe to retry.
 */
export function isRetryableError(err: unknown, stage: PipelineStage): boolean {
  if (!err) return false;
  const message = (err instanceof Error ? err.message : String(err)).toLowerCase();

  // Non-retryable authentication / credential issues
  if (
    message.includes('401') ||
    message.includes('403') ||
    message.includes('invalid api key') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return false;
  }

  // Non-retryable content / domain failures
  if (
    message.includes('unsupported format') ||
    message.includes('tracking pixel') ||
    message.includes('image file too small') ||
    message.includes('below required minimum') ||
    message.includes('html pretending') ||
    message.includes('malformed') ||
    message.includes('404') ||
    message.includes('not found')
  ) {
    return false;
  }

  // Network / transient issues
  if (
    message.includes('timeout') ||
    message.includes('etimedout') ||
    message.includes('econnreset') ||
    message.includes('econnrefused') ||
    message.includes('network') ||
    message.includes('aborted') ||
    message.includes('429') ||
    message.includes('rate limit') ||
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504') ||
    message.includes('temporarily unavailable')
  ) {
    return true;
  }

  // Database connection issues
  if (stage === 'DATABASE_PERSISTENCE') {
    if (
      message.includes('connection') ||
      message.includes('pool') ||
      message.includes('terminating connection') ||
      message.includes('deadlock')
    ) {
      return true;
    }
    return false;
  }

  return false;
}

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  stage: PipelineStage;
  sku: string;
  productId: string;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
}

/**
 * Executes an operation with exponential backoff for retryable errors.
 */
export async function withPipelineRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const initialDelay = options.initialDelayMs ?? 1000;
  const backoffFactor = options.backoffFactor ?? 2;

  let attempt = 0;
  let currentDelay = initialDelay;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      return await operation();
    } catch (err: unknown) {
      const retryable = isRetryableError(err, options.stage);
      const isLastAttempt = attempt >= maxAttempts;

      if (!retryable || isLastAttempt) {
        throw new PipelineExecutionError({
          sku: options.sku,
          productId: options.productId,
          stage: options.stage,
          message: err instanceof Error ? err.message : String(err),
          isRetryable: retryable,
          attempt,
          originalError: err,
          timestamp: new Date().toISOString(),
        });
      }

      if (options.onRetry) {
        options.onRetry(attempt, err, currentDelay);
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffFactor;
    }
  }

  throw new Error('Unreachable retry boundary');
}
