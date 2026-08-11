import { parseExcel } from '@/features/products/import/parser';
import { transformRow } from '@/features/products/import/transformer';
import { validateProducts } from '@/features/products/import/validator';
import { ExcelProduct } from '@/features/products/types/excel-product.type';

async function main() {
  const rows = (await parseExcel()) as ExcelProduct[];

  const products = rows.map(transformRow);

  const result = validateProducts(products);

  console.log({
    totalRows: rows.length,

    validProducts: result.validProducts.length,

    invalidProducts: result.invalidProducts.length,
  });
}

main();
