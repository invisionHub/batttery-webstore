import React from 'react';
import ProductCard from './ProductCard';
import { type Product } from '@/lib/mock-data';

interface ProductGridDisplayProps {
  products: Product[];
  view: 'grid' | 'list';
}

export default function ProductGridDisplay({ products, view }: ProductGridDisplayProps) {
  // These classes handle the toggle between grid and list views
  const gridClasses =
    view === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      : 'flex flex-col gap-4';

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view={view} />
      ))}
    </div>
  );
}
