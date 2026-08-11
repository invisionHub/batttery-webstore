import { SortOption } from '../types';
import { CatalogProduct } from '../types/product.type';

export function sortProducts (
    products: CatalogProduct[],
    sort: SortOption
) {

    const result = [ ...products ];

    switch (sort)
    {

        case 'price-asc':
            return result.sort((a, b) => a.price! - b.price!);

        case 'price-desc':
            return result.sort((a, b) => b.price! - a.price!);

        case 'newest':
            return result.reverse();

        case 'name-asc':
            return result.sort((a, b) =>
                a.name!.localeCompare(b.name!)
            );

        default:
            return result;
    }
}