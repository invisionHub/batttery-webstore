import { FilterState } from '@/components/product/FilterSidebar';
import { normalizeValue } from '../utils/normalize-values';
import { Product } from '@/database/types';
import { getProductSeries } from './generate-filter';

export function filterProducts(products: Product[], filters: FilterState) {
  let result = [...products];

  // 1. Categories
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter((product) =>
      filters.categories.some(
        (category) => normalizeValue(category) === normalizeValue(product.category)
      )
    );
  }

  // 2. Subcategories
  if (filters.subcategories && filters.subcategories.length > 0) {
    result = result.filter((product) =>
      filters.subcategories.some(
        (subcat) => normalizeValue(subcat) === normalizeValue(product.subcategory)
      )
    );
  }

  // 3. Series / Range (Arteor, Myrius, Ekinox, Belanko, etc.)
  if (filters.series && filters.series.length > 0) {
    result = result.filter((product) => {
      const series = getProductSeries(product.name || '');
      return series && filters.series.some((s) => normalizeValue(s) === normalizeValue(series));
    });
  }

  // 4. Brands
  if (filters.brands && filters.brands.length > 0) {
    result = result.filter((product) =>
      filters.brands.some((brand) => normalizeValue(brand) === normalizeValue(product.brand))
    );
  }

  // 5. In Stock Only
  if (filters.inStockOnly) {
    result = result.filter((product) => product.stockStatus !== 'Out of Stock');
  }

  // 6. Price range
  const min = filters.priceMin ?? 0;
  const max = filters.priceMax ?? 1000000;
  result = result.filter((product) => {
    const price = Number(product.price ?? 0);
    return price >= min && price <= max;
  });

  return result;
}
