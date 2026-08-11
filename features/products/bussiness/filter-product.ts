import { FilterState } from '@/components/product/FilterSidebar';
import { CatalogProduct } from '../types/product.type';
import { normalizeValue } from '../utils/normalize-values';

export function filterProducts (
    products: CatalogProduct[],
    filters: FilterState
) {

    let result = [ ...products ];

    if (filters.categories.length)
    {
        result = result.filter(product =>
            filters.categories.some(category =>
                normalizeValue(category) ===
                normalizeValue(product.category)
            )
        );
    }

    if (filters.brands.length)
    {
        result = result.filter(product =>
            filters.brands.some(brand =>
                normalizeValue(brand) ===
                normalizeValue(product.brand)
            )
        );
    }    
    result = result.filter(product =>
            product.price! >= filters.priceMin &&
            product.price! <= filters.priceMax
    );


    if (filters.inStockOnly)
    {
        result = result.filter(product =>
            product.stockStatus === "In Stock"
        );
    }

    return result;
}