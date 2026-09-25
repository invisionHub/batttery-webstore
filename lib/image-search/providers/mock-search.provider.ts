import { ImageCandidate, ImageSearchOptions, ImageSearchProvider } from '../types';

export class MockSearchProvider implements ImageSearchProvider {
  readonly name = 'MockSearchProvider';

  async search(query: string, options?: ImageSearchOptions): Promise<ImageCandidate[]> {
    const limit = options?.limit ?? 5;
    const cleanQuery = query.trim().replace(/\s+/g, '-').toLowerCase();

    const candidates: ImageCandidate[] = [
      {
        imageUrl: `https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80`,
        sourceUrl: `https://www.electrical-supplies.example/products/${cleanQuery}`,
        title: `${query} Official High-Resolution Product Image`,
        source: 'electrical-supplies.example',
        width: 800,
        height: 800,
        format: 'image/jpeg',
      },
      {
        imageUrl: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80`,
        sourceUrl: `https://www.hardware-distributor.example/catalog/${cleanQuery}`,
        title: `${query} Side Angle Spec Sheet`,
        source: 'hardware-distributor.example',
        width: 600,
        height: 600,
        format: 'image/jpeg',
      },
      {
        imageUrl: `https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&auto=format&fit=crop&q=80`,
        sourceUrl: `https://store.example/item/${cleanQuery}`,
        title: `${query} Packaging and Accessories`,
        source: 'store.example',
        width: 500,
        height: 500,
        format: 'image/jpeg',
      },
    ];

    return candidates.slice(0, limit);
  }
}
