import { FilterState } from '@/components/product/FilterSidebar';
import { Product } from './product.type';

export type ProductList = Product[];

export type ProductFilter = FilterState;

export type SortOption =
    | 'popular'
    | 'price-asc'
    | 'price-desc'
    | 'rating'
    | 'newest'
    | 'name-asc';

export type ViewMode = 'grid' | 'list';