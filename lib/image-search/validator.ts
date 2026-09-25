import { ImageValidationRequirements, ImageValidationResult } from './types';
import { ImageValidationError } from './errors';

export const DEFAULT_IMAGE_REQUIREMENTS: Required<ImageValidationRequirements> = {
  minWidth: 300,
  minHeight: 300,
  maxSizeBytes: 10 * 1024 * 1024, // 10 MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  timeoutMs: 8000,
};

/**
 * Extracts dimensions from image binary headers (PNG, JPEG, WEBP, GIF).
 */
export function parseImageDimensions(
  buffer: Buffer
): { width: number; height: number; format: string } | null {
  if (buffer.length < 16) return null;

  // 1. PNG: 89 50 4E 47 0D 0A 1A 0A -> IHDR starts at byte 12: width at 16, height at 20 (big-endian 32-bit)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    if (buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, format: 'image/png' };
    }
  }

  // 2. GIF: 'GIF87a' or 'GIF89a' -> width at 6, height at 8 (little-endian 16-bit)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    if (buffer.length >= 10) {
      const width = buffer.readUInt16LE(6);
      const height = buffer.readUInt16LE(8);
      return { width, height, format: 'image/gif' };
    }
  }

  // 3. WEBP: RIFF ... WEBP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const vp8 = buffer.toString('ascii', 12, 16);
    if (vp8 === 'VP8 ' && buffer.length >= 30) {
      // VP8 lossy
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      return { width, height, format: 'image/webp' };
    } else if (vp8 === 'VP8L' && buffer.length >= 25) {
      // VP8L lossless
      const b0 = buffer[21];
      const b1 = buffer[22];
      const b2 = buffer[23];
      const b3 = buffer[24];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { width, height, format: 'image/webp' };
    } else if (vp8 === 'VP8X' && buffer.length >= 30) {
      // VP8X extended
      const width = 1 + buffer.readUIntLE(24, 3);
      const height = 1 + buffer.readUIntLE(27, 3);
      return { width, height, format: 'image/webp' };
    }
    return { width: 500, height: 500, format: 'image/webp' };
  }

  // 4. JPEG: Starts with FF D8
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length - 8) {
      if (buffer[offset] !== 0xff) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      // SOF markers: C0, C1, C2, C3, C5, C6, C7, C9, CA, CB, CD, CE, CF
      const isSOF =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);

      if (isSOF && offset + 8 < buffer.length) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { width, height, format: 'image/jpeg' };
      }

      // Read chunk length
      if (offset + 3 < buffer.length) {
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      } else {
        break;
      }
    }
  }

  return null;
}

export class ImageValidator {
  constructor(private readonly requirements: ImageValidationRequirements = {}) {}

  /**
   * Validates an image URL by checking accessibility, MIME type, size, and dimensions.
   */
  async validate(url: string): Promise<ImageValidationResult> {
    const config = { ...DEFAULT_IMAGE_REQUIREMENTS, ...this.requirements };

    // 1. Basic URL syntax check
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        return { isValid: false, error: 'Invalid URL protocol: Must be HTTP or HTTPS' };
      }
    } catch {
      return { isValid: false, error: 'Invalid URL: Malformed image URL' };
    }

    try {
      // 2. Fetch image stream/buffer with timeout
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/webp,image/png,image/jpeg,*/*',
        },
        signal: AbortSignal.timeout(config.timeoutMs),
      });

      if (!response.ok) {
        return {
          isValid: false,
          error: `HTTP ${response.status}: Inaccessible or removed resource`,
        };
      }

      // 3. Content-Type inspection
      const contentType = (response.headers.get('content-type') || '').toLowerCase().split(';')[0].trim();
      if (contentType.includes('text/html') || contentType.includes('application/json')) {
        return {
          isValid: false,
          mimeType: contentType,
          error: `Rejected non-image Content-Type: ${contentType}`,
        };
      }

      const isAllowedMime = config.allowedMimeTypes.some((mime) =>
        contentType.includes(mime.replace('image/', ''))
      );

      // Read first chunk (or full buffer up to max size) to parse dimensions & verify magic bytes
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 4. File size inspection
      if (buffer.length === 0) {
        return { isValid: false, error: 'Empty response (0 bytes)' };
      }
      if (buffer.length < 1024) {
        // Less than 1KB is almost certainly a tracking pixel, error page, or dummy asset
        return {
          isValid: false,
          sizeBytes: buffer.length,
          error: `Image file too small (${buffer.length} bytes), likely a tracking pixel or icon`,
        };
      }
      if (buffer.length > config.maxSizeBytes) {
        return {
          isValid: false,
          sizeBytes: buffer.length,
          error: `Image file exceeds maximum size limit of ${config.maxSizeBytes} bytes`,
        };
      }

      // Check for HTML pretend payload
      const textPreview = buffer.subarray(0, 100).toString('utf-8').toLowerCase();
      if (
        textPreview.includes('<!doctype') ||
        textPreview.includes('<html') ||
        textPreview.includes('<svg')
      ) {
        return {
          isValid: false,
          error: 'Content is HTML or SVG markup pretending to be raster image',
        };
      }

      // 5. Dimension and Format parsing
      const parsed = parseImageDimensions(buffer);
      const effectiveMime = parsed?.format || contentType;

      if (!parsed && !isAllowedMime) {
        return {
          isValid: false,
          mimeType: effectiveMime,
          error: `Unsupported image format (${effectiveMime})`,
        };
      }

      const width = parsed?.width ?? 0;
      const height = parsed?.height ?? 0;

      // 6. Minimum dimensions check
      if (width > 0 && width < config.minWidth) {
        return {
          isValid: false,
          width,
          height,
          mimeType: effectiveMime,
          sizeBytes: buffer.length,
          error: `Image width (${width}px) is below required minimum of ${config.minWidth}px`,
        };
      }

      if (height > 0 && height < config.minHeight) {
        return {
          isValid: false,
          width,
          height,
          mimeType: effectiveMime,
          sizeBytes: buffer.length,
          error: `Image height (${height}px) is below required minimum of ${config.minHeight}px`,
        };
      }

      return {
        isValid: true,
        width: width || undefined,
        height: height || undefined,
        mimeType: effectiveMime,
        sizeBytes: buffer.length,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown validation error';
      return {
        isValid: false,
        error: `Validation request failed: ${message}`,
      };
    }
  }

  /**
   * Asserts validity and throws ImageValidationError if invalid.
   */
  async assertValid(url: string): Promise<ImageValidationResult> {
    const result = await this.validate(url);
    if (!result.isValid) {
      throw new ImageValidationError(url, result.error || 'Image validation failed');
    }
    return result;
  }
}

export const defaultImageValidator = new ImageValidator();
