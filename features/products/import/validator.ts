import { Product } from '../types/product.type';
import { ImportResult, InvalidProduct } from '../types/import-result.type';
import { ProductImportSchema } from '../schema';

export function validateProducts(products: Product[]): ImportResult {
  const validProducts: Product[] = [];

  const invalidProducts = [] as unknown as InvalidProduct[];

  products.forEach((product, index) => {
    const result = ProductImportSchema.safeParse(product);

    if (result.success) {
      validProducts.push(product);
      return;
    }

    invalidProducts.push({
      row: index + 1,

      product,

      errors: result.error.issues.map((issue) => issue.message),
    });
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
