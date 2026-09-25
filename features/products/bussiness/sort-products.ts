import { Product } from '@/database/types';
import { SortOption } from '../types';

export function sortProducts(products: Product[], sort: SortOption) {
  const result = [...products];

  switch (sort) {
    case 'price-asc':
      return result.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));

    case 'price-desc':
      return result.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));

    case 'newest':
      return result.reverse();

    case 'name-asc':
      return result.sort((a, b) => a.name!.localeCompare(b.name!));

    default:
      return result;
  }
}
