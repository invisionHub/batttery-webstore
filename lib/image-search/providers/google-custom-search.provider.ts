import { ImageCandidate, ImageSearchOptions, ImageSearchProvider } from '../types';
import { SearchProviderError } from '../errors';

export class GoogleCustomSearchProvider implements ImageSearchProvider {
  readonly name = 'GoogleCustomSearch';

  constructor(
    private readonly apiKey: string = process.env.GOOGLE_SEARCH_API_KEY ?? '',
    private readonly searchEngineId: string = process.env.GOOGLE_SEARCH_CX ?? ''
  ) {}

  async search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]> {
    if (!this.apiKey || !this.searchEngineId) {
      throw new SearchProviderError(
        this.name,
        'Google Custom Search API Key or CX Search Engine ID is not configured.'
      );
    }

    const limit = Math.min(options?.limit ?? 10, 10);
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('cx', this.searchEngineId);
    url.searchParams.set('q', query);
    url.searchParams.set('searchType', 'image');
    url.searchParams.set('num', String(limit));
    url.searchParams.set('safe', options?.safeSearch === false ? 'off' : 'active');

    try {
      const response = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        items?: Array<{
          link: string;
          image?: {
            contextLink?: string;
            width?: number;
            height?: number;
          };
          title?: string;
          displayLink?: string;
          mime?: string;
        }>;
      };

      if (!data.items || data.items.length === 0) {
        return [];
      }

      return data.items.map((item) => ({
        imageUrl: item.link,
        sourceUrl: item.image?.contextLink ?? item.link,
        title: item.title,
        width: item.image?.width,
        height: item.image?.height,
        source: item.displayLink,
        format: item.mime,
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
