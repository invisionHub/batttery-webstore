
import {  CatalogProduct } from '../types/product.type';
import { normalizeValue } from '../utils/normalize-values';


export function generateFilterOptions (
    products: CatalogProduct[],
    key: 'brand' | 'category'
) {

    const counts = new Map<
        string,
        { name: string; count: number }
    >();

    products.forEach(product => {

        const value = product[ key ]?.trim();

        if (!value) return;

        const normalized = normalizeValue(value);

        const existing = counts.get(normalized);

        counts.set(normalized, {
            name: value,
            count: (existing?.count ?? 0) + 1,
        });

    });

    return [ ...counts.entries() ]
        .sort(([ a ], [ b ]) => a.localeCompare(b))
        .map(([ id, option ], index) => ({
            id: `${ id }-${ index }`,
            name: option.name,
            value: option.name,
            count: option.count,
        }));
}