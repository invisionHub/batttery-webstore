import { ITEMS_PER_PAGE } from '../constants/product.constants';

export function paginateProducts<T> (
    items: T[],
    page: number
) {
    const totalPages = Math.max(
        1,
        Math.ceil(items.length / ITEMS_PER_PAGE)
    );

    return {
        totalPages,

        items: items.slice(
            (page - 1) * ITEMS_PER_PAGE,
            page * ITEMS_PER_PAGE
        ),
    };
}