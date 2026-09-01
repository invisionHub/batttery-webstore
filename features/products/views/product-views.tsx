'use client';

import { useState } from 'react';
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE,
  DEFAULT_SORT,
  DEFAULT_VIEW,
} from '../constants/product.constants';
import {
  generateFilterOptions,
  filterProducts,
  paginateProducts,
  searchProducts,
  sortProducts,
} from '../bussiness';
import { ProductHeader } from '../components/header/ProductHeader';
import { Catalog } from '../components/filter/Catalog';
import { ProductLayout } from '../components/layout/ProductLayout';
import { FilterSidebar } from '@/components/product';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductNotFound } from '../components/product/ProductToolBar';
import { Product } from '@/database/types';

type ProductsViewProps = {
  initialProducts: Product[] | undefined;
  initialError: string | undefined;
};

export function ProductsView({ initialProducts, initialError }: ProductsViewProps) {
  const products = initialProducts;

  const [search, setSearch] = useState('');
  const [filters] = useState(DEFAULT_FILTERS);
  const [sort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [view, setView] = useState<'grid' | 'list'>(DEFAULT_VIEW);

  if (!products || initialError) {
    return <ProductNotFound error={initialError} />;
  }

  const searchedProducts = searchProducts(initialProducts, search);

  const filteredProducts = filterProducts(searchedProducts, filters);

  const sortedProducts = sortProducts(filteredProducts, sort);

  const { totalPages, items } = paginateProducts(sortedProducts, page);

  const categoryOptions = generateFilterOptions(initialProducts, 'category');

  const brandOptions = generateFilterOptions(initialProducts, 'brand');

  console.log('filteredProducts', items);

  return (
    <>
      <ProductHeader resultCount={filteredProducts.length} search={search} setSearch={setSearch} />
      <Catalog categoryOptions={categoryOptions} selected={filters.categories} />
      <ProductLayout
        SiderBar={
          <FilterSidebar
            filters={filters}
            brands={brandOptions}
            categories={filters.categories}
            onChange={() => console.log('hello')}
          />
        }
      >
        <ProductGrid
          page={page}
          paginatedProducts={items}
          productLength={filteredProducts.length}
          setPage={setPage}
          setView={setView}
          totalPages={totalPages}
          view={view}
        />
      </ProductLayout>
    </>
  );
}
