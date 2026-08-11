import { importProducts } from '@/features/products/import/importer';

async function main() {
  const result = await importProducts();

  console.log(result.summary);
}

main();
