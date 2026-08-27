'use client';
import React from 'react';
import { CatalogProduct } from '../../types/product.type';
import { ProductCard } from '@/components/product';
import { GridListArrangement, ProductNotFound } from './ProductToolBar';
import Pagination from '@/components/ui/Pagination';

interface IProductGrid {
  productLength: number;
  paginatedProducts: CatalogProduct[];
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}
export const ProductGrid = ({ ...productgridProps }: IProductGrid) => {
  const { paginatedProducts, productLength, setView, view, totalPages, page, setPage } =
    productgridProps;

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="">
        <GridListArrangement setView={setView} view={view} />
      </div>
      {productLength > 0 && (
        <div
          className={`${view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'flex flex-col'}  gap-3 w-full`}
        >
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} view={view} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
};
