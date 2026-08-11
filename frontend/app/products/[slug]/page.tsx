import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProducts } from '@/features/products/actions/get-products';
import { getRelatedProducts } from '@/features/products/bussiness/get-related-products';
import {
  ProductDetailErrorView,
  ProductDetailView,
} from '@/features/products/views/detail';

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const [{ product, error }, { product: products }] = await Promise.all([
    fetchProductBySlug(slug),
    fetchProducts(),
  ]);

  if (!product && error === 'Product not found.') {
    notFound();
  }

  if (!product || error) {
    return <ProductDetailErrorView message={error ?? 'Failed to load product.'} />;
  }

  const relatedProducts = getRelatedProducts(product, products ?? []);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
