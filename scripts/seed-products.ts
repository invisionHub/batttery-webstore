import { importProducts } from '../features/products/import/importer';
import { productRepository } from '../database/repository/products/product.repository';
import { NewProduct } from '@/database/types';

async function main() {
  const importResult = await importProducts();

  if (importResult.invalidProducts.length < 0) {
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

  const result = await productRepository.seedProduct(
    importResult.validProducts as unknown as NewProduct[]
  );

  // console.log({
  //   ...result,
  //   summary: importResult.summary,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
