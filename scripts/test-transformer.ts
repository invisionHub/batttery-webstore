import { parseExcel } from '@/features/products/import/parser';
import { transformRow } from '@/features/products/import/transformer';
import { ExcelProduct } from '@/features/products/types/excel-product.type';

async function main() {
  const rows = (await parseExcel()) as ExcelProduct[];
  const product = transformRow(rows[0]);

  console.log(product);
}

main();
