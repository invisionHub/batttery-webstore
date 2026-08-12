import path from 'path';
import { importProducts } from '../features/products/import/importer';
import { seedProductsToMongo } from '../lib/mongodb';
import type { Product } from '../features/products/types/product.type';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: path.join(process.cwd(), envFile) });

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

  const result = await seedProductsToMongo(importResult.validProducts as Product[]);

  console.log({
    ...result,
    summary: importResult.summary,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
