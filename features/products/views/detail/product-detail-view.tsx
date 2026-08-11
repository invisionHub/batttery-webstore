import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import SpecificationsTable from '@/components/product/SpecificationsTable';
import type { CatalogProduct } from '@/features/products/types/product.type';
import { ProductBreadcrumbs } from '@/features/products/components/detail/ProductBreadcrumbs';
import { RelatedProductsSection } from '@/features/products/components/detail/RelatedProductsSection';

const colors = {
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
};

type ProductDetailViewProps = {
  product: CatalogProduct;
  relatedProducts: CatalogProduct[];
};

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '20px', paddingBottom: '56px' }}
      >
        <ProductBreadcrumbs product={product} />

        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '40px' }}>
            <ProductGallery productName={product.name ?? 'Product'} images={product.images} />
            <ProductDetails product={product} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <SpecificationsTable product={product} />
        </div>

        <RelatedProductsSection products={relatedProducts} />
      </div>
    </div>
  );
}
