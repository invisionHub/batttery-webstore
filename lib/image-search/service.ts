import { ImageCandidate, ImageSearchOptions, ImageSearchProvider } from './types';
import { GoogleCustomSearchProvider } from './providers/google-custom-search.provider';
import { SerpSearchProvider } from './providers/serp-search.provider';
import { MockSearchProvider } from './providers/mock-search.provider';

export interface IImageSearchService {
  search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]>;
  getProviderName(): string;
}

export class ImageSearchService implements IImageSearchService {
  private readonly provider: ImageSearchProvider;

  constructor(customProvider?: ImageSearchProvider) {
    if (customProvider) {
      this.provider = customProvider;
    } else if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_CX) {
      this.provider = new GoogleCustomSearchProvider();
    } else if (process.env.SERP_API_KEY || process.env.SERPER_API_KEY) {
      this.provider = new SerpSearchProvider();
    } else {
      this.provider = new MockSearchProvider();
    }
  }

  getProviderName(): string {
    return this.provider.name;
  }

  async search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]> {
    if (!query || !query.trim()) {
      return [];
    }

    return await this.provider.search(query.trim(), options);
  }
}

export const defaultImageSearchService = new ImageSearchService();
