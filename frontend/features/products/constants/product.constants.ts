import { SortOption } from "../types";

export const ITEMS_PER_PAGE = 12;

export const DEFAULT_FILTERS = {
    categories: [],
    brands: [],
    priceMin: 0,
    priceMax: 500000,
    rating: null,
    inStockOnly: false,
};

export const DEFAULT_SORT = 'popular' as SortOption;

export const DEFAULT_VIEW = 'grid';

export const DEFAULT_PAGE = 1;