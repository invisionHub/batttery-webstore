import Link from 'next/link';
import type { CatalogProduct } from '@/features/products/types/product.type';

const colors = {
  secondary: '#0D1B2A',
  textMuted: '#6B7280',
};

type ProductBreadcrumbsProps = {
  product: CatalogProduct;
};

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  const category = product.category ?? 'products';
  const productName = product.name ?? 'Product';

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '12px',
        color: colors.textMuted,
        marginBottom: '20px',
      }}
    >
      <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
        Home
      </Link>
      <span>/</span>
      <Link href="/products" style={{ color: colors.textMuted, textDecoration: 'none' }}>
        Products
      </Link>
      <span>/</span>
      <Link
        href={`/products?category=${category}`}
        style={{
          color: colors.textMuted,
          textDecoration: 'none',
          textTransform: 'capitalize',
        }}
      >
        {category.replace(/-/g, ' ')}
      </Link>
      <span>/</span>
      <span style={{ color: colors.secondary, fontWeight: 600 }}>{productName}</span>
    </nav>
  );
}
