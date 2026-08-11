import { ExcelProduct } from '../types/excel-product.type';
import { parseExcel } from './parser';
import { transformRow } from './transformer';
import { validateProducts } from './validator';

export async function importProducts() {
  const rows = (await parseExcel()) as ExcelProduct[];

  const products = rows.map(transformRow);

  const result = validateProducts(products);

  return result;
}
