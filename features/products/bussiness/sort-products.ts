import { Product } from '@/database/types';
import { SortOption } from '../types';

export function sortProducts(products: Product[], sort: SortOption) {
  const result = [...products];

  switch (sort) {
    case 'price-asc':
      return result.sort((a, b) => a.price! - b.price!);

    case 'price-desc':
      return result.sort((a, b) => b.price! - a.price!);

    case 'newest':
      return result.reverse();

    case 'name-asc':
      return result.sort((a, b) => a.name!.localeCompare(b.name!));

    default:
      return result;
  }
}
