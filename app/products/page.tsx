import { fetchProducts } from '@/features/products/actions/get-products';
import { ProductsView } from '@/features/products/views/product-views';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ searchParams }: ProductsPageProps) {
  const resolved = await searchParams;
  const search = typeof resolved.search === 'string' ? resolved.search : '';
  const category = typeof resolved.category === 'string' ? resolved.category : undefined;
  const brand = typeof resolved.brand === 'string' ? resolved.brand : undefined;
  const minPrice = typeof resolved.minPrice === 'string' ? Number(resolved.minPrice) : undefined;
  const maxPrice = typeof resolved.maxPrice === 'string' ? Number(resolved.maxPrice) : undefined;
  const sort = typeof resolved.sort === 'string' ? resolved.sort : undefined;

  // Server-side filtered fetch based on URL params
  const [{ error, product }, allResult] = await Promise.all([
    fetchProducts({
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
    }),
    fetchProducts(), // for options generation
  ]);

  return (
    <ProductsView
      initialError={error as string}
      initialProducts={product}
      allProducts={allResult.product}
      initialSearch={search}
      initialCategory={category}
      initialBrand={brand}
    />
  );
}
