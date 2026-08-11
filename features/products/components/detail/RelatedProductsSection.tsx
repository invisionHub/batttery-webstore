import Link from 'next/link';
import { ProductCard } from '@/components/product';
import type { CatalogProduct } from '@/features/products/types/product.type';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
};

type RelatedProductsSectionProps = {
  products: CatalogProduct[];
};

export function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
            You May Also Like
          </h2>
          <div
            style={{
              width: '36px',
              height: '3px',
              backgroundColor: colors.primary,
              borderRadius: '2px',
              marginTop: '6px',
            }}
          />
        </div>
        <Link
          href="/products"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: colors.primary,
            textDecoration: 'none',
          }}
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
