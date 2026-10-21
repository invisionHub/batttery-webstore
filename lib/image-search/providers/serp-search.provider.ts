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

    const isSerpApiKey = this.apiKey.length === 64 || Boolean(process.env.SERP_API_KEY);

    // 1. If key is SerpApi (serpapi.com)
    if (isSerpApiKey) {
      try {
        const serpApiUrl = new URL('https://serpapi.com/search.json');
        serpApiUrl.searchParams.set('engine', 'google_images');
        serpApiUrl.searchParams.set('q', query);
        serpApiUrl.searchParams.set('api_key', this.apiKey);
        serpApiUrl.searchParams.set('num', String(options?.limit ?? 5));

        const response = await fetch(serpApiUrl.toString(), {
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`SerpApi HTTP ${response.status}: ${errText}`);
        }

        const data = (await response.json()) as {
          images_results?: Array<{
            original?: string;
            link?: string;
            title?: string;
            source?: string;
            original_width?: number;
            original_height?: number;
          }>;
          error?: string;
        };

        if (data.error && !data.images_results) {
          console.warn(`[SerpSearch] SerpApi note for query "${query}": ${data.error}`);
          return [];
        }

        if (data.images_results && data.images_results.length > 0) {
          return data.images_results
            .map((img) => ({
              imageUrl: img.original || '',
              sourceUrl: img.link || '',
              title: img.title,
              source: img.source,
              width: img.original_width,
              height: img.original_height,
            }))
            .filter((c) => Boolean(c.imageUrl));
        }

        return [];
      } catch (err: unknown) {
        throw new SearchProviderError(
          this.name,
          err instanceof Error ? err.message : 'SerpApi search failure',
          err
        );
      }
    }

    // 2. Otherwise google.serper.dev
    try {
      const response = await fetch('https://google.serper.dev/images', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: options?.limit ?? 5,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Serper HTTP ${response.status}: ${await response.text()}`);
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
