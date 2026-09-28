import { ImageCandidate, ImageSearchOptions, ImageSearchProvider } from '../types';
import { SearchProviderError } from '../errors';

export class SerpSearchProvider implements ImageSearchProvider {
  readonly name = 'SerpSearch';

  constructor(
    private readonly apiKey: string = process.env.SERP_API_KEY ?? process.env.SERPER_API_KEY ?? ''
  ) {}

  async search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]> {
    if (!this.apiKey) {
      throw new SearchProviderError(this.name, 'SERP API Key is not configured.');
    }

    // Attempt SerpApi (serpapi.com) first if key is 64 hex characters or if Serper fails
    try {
      const serpApiUrl = new URL('https://serpapi.com/search.json');
      serpApiUrl.searchParams.set('engine', 'google_images');
      serpApiUrl.searchParams.set('q', query);
      serpApiUrl.searchParams.set('api_key', this.apiKey);
      serpApiUrl.searchParams.set('num', String(options?.limit ?? 10));

      const response = await fetch(serpApiUrl.toString(), {
        signal: AbortSignal.timeout(12000),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          images_results?: Array<{
            original?: string;
            link?: string;
            title?: string;
            source?: string;
            original_width?: number;
            original_height?: number;
          }>;
        };

        if (data.images_results && data.images_results.length > 0) {
          return data.images_results.map((img) => ({
            imageUrl: img.original || '',
            sourceUrl: img.link || '',
            title: img.title,
            source: img.source,
            width: img.original_width,
            height: img.original_height,
          })).filter((c) => Boolean(c.imageUrl));
        }
        return [];
      }
    } catch {
      // Fall through to serper.dev if serpapi errors
    }

    // Fallback: google.serper.dev
    try {
      const response = await fetch('https://google.serper.dev/images', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: options?.limit ?? 10,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as {
        images?: Array<{
          imageUrl: string;
          link: string;
          title?: string;
          source?: string;
          imageWidth?: number;
          imageHeight?: number;
        }>;
      };

      if (!data.images || data.images.length === 0) {
        return [];
      }

      return data.images.map((img) => ({
        imageUrl: img.imageUrl,
        sourceUrl: img.link,
        title: img.title,
        source: img.source,
        width: img.imageWidth,
        height: img.imageHeight,
      }));
    } catch (err: unknown) {
      throw new SearchProviderError(
        this.name,
        err instanceof Error ? err.message : 'Unknown network error',
        err
      );
    }
  }
}
