import path from 'path';
import * as XLSX from 'xlsx';

export async function parseExcel() {
  const filePath = path.join(process.cwd(), 'data', 'product_catalog.xlsx');

  const workbook = XLSX.readFile(filePath);

  const firstSheet = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[firstSheet];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    range: 1,
    defval: '',
  });

  return rows;
}
