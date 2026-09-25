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
