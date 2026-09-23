import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { CloudinaryService } from '../lib/cloudinary/cloudinary.service';

const service = new CloudinaryService();

const TEST_SKU = 'TEST-SKU-001';
const FOLDER = `products/${TEST_SKU}`;
const PUBLIC_ID = 'primary';

async function main() {
  const imagePath = path.resolve(process.cwd(), 'tests/fixtures/product-test.jpg');

  console.log('Reading test image...');

  const file = await readFile(imagePath);

  console.log(file);
  console.log('Uploading image...');

  const uploadResult = await service.upload({
    file,
    folder: FOLDER,
    publicId: PUBLIC_ID,
  });

  console.log('\nUpload result');
  console.log(uploadResult);

  const exists = await service.exist(uploadResult.publicId);

  console.log(exists ? 'Assests already exists' : 'Assests does not exist');

  console.log('Deleting image...');

  if (exists) {
    const deleteResult = await service.delete(uploadResult.publicId);
    console.log(deleteResult);
  }
}

main().catch((error) => {
  console.error('\nCloudinary integration test failed');
  console.error(error);
  process.exit(1);
});
