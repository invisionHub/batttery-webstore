import { Product } from '../types/product.type';
import { ImportResult, InvalidProduct } from '../types/import-result.type';
import { ProductImportSchema } from '../schema';

export function validateProducts(products: Product[]): ImportResult {
  const validProducts: Product[] = [];
  const invalidProducts: InvalidProduct[] = [];

  const slugCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.slug] = (acc[product.slug] ?? 0) + 1;
    return acc;
  }, {});

  const skuCounts = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.sku] = (acc[product.sku] ?? 0) + 1;
    return acc;
  }, {});

  products.forEach((product, index) => {
    const errors: string[] = [];
    const result = ProductImportSchema.safeParse(product);

    if (!result.success) {
      errors.push(...result.error.issues.map((issue) => issue.message));
    }

    if (slugCounts[product.slug] > 1) {
      errors.push(`Duplicate slug found: ${product.slug}`);
    }

    if (skuCounts[product.sku] > 1) {
      errors.push(`Duplicate SKU found: ${product.sku}`);
    }

    if (errors.length > 0) {
      invalidProducts.push({
        row: index + 1,
        product,
        errors,
      });
      return;
    }

    validProducts.push(product);
  });

  return {
    validProducts,
    invalidProducts,
    summary: {
      totalRows: products.length,
      validRows: validProducts.length,
      invalidRows: invalidProducts.length,
    },
  };
}
