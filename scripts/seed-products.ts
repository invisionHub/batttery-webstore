import { importProducts } from '@/features/products/import/importer';
import { seedProductsToMongo } from '@/lib/mongodb';

async function main() {
  const importResult = await importProducts();

  if (importResult.invalidProducts.length > 0) {
    console.warn('Some rows were invalid and will not be seeded:');
    console.warn(
      importResult.invalidProducts.map(({ row, errors }) => ({
        row,
        errors,
      }))
    );
  }

  if (importResult.validProducts.length === 0) {
    console.log('No valid products found to seed.');
    return;
  }

  const result = await seedProductsToMongo(importResult.validProducts);

  console.log({
    ...result,
    summary: importResult.summary,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
