import { parseExcel } from '@/features/products/import/parser';

async function main() {
  const rows = await parseExcel();

  console.log(rows.length);

  console.log(rows[0]);
}

main();
