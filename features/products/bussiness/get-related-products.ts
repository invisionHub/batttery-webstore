import type { CatalogProduct } from '../types/product.type';

export function getRelatedProducts(
  currentProduct: CatalogProduct,
  products: CatalogProduct[],
  limit = 4
) {
  const sameCategory = products.filter(
    (product) =>
      product.id !== currentProduct.id &&
      product.category &&
      currentProduct.category &&
      product.category === currentProduct.category
  );

  const fallback = products.filter(
    (product) =>
      product.id !== currentProduct.id &&
      !sameCategory.some((relatedProduct) => relatedProduct.id === product.id)
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
