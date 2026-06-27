import React from 'react';
import { type Product } from '@/lib/mock-data';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/skeleton';
// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  bgLight: '#F9FAFB',
};

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  view = 'grid',
  className = '',
}) => {
  // Loading skeleton state
  if (isLoading) {
    return (
      <div
        className={`grid gap-4 ${
          view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
        } ${className}`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-20 rounded-xl ${className}`}
        style={{ backgroundColor: colors.bgLight, border: `1px dashed ${colors.border}` }}
      >
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4">
          <circle cx="11" cy="11" r="8" stroke={colors.border} strokeWidth="1.5" />
          <path
            d="M21 21l-4.35-4.35"
            stroke={colors.border}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 11h6M11 8v6"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h3 className="text-base font-bold mb-1" style={{ color: colors.secondary }}>
          No products found
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Try adjusting your filters or search term
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${
        view === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
          : 'flex flex-col gap-3'
      } ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view={view} />
      ))}
    </div>
  );
};

export default ProductGrid;
