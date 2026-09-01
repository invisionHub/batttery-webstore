import { FilterState } from '@/components/product/FilterSidebar';
import { normalizeValue } from '../utils/normalize-values';
import { Product } from '@/database/types';

export function filterProducts(products: Product[], filters: FilterState) {
  let result = [...products];

  if (filters.categories.length) {
    result = result.filter((product) =>
      filters.categories.some(
        (category) => normalizeValue(category) === normalizeValue(product.category)
      )
    );
  }

  if (filters.brands.length) {
    result = result.filter((product) =>
      filters.brands.some((brand) => normalizeValue(brand) === normalizeValue(product.brand))
    );
  }
  products[0].price;
  result = result.filter(
    (product) => product.price! >= filters.priceMin && product.price! <= filters.priceMax
  );

  return result;
}
