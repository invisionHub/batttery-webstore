import { productImageRepository } from '../database/repository/products/product-image.repository';
import { productRepository } from '../database/repository/products/product.repository';
import {
  DuplicatePrimaryImageError,
  ProductNotFoundError,
} from '../database/repository/products/errors/product-image.errors';

async function main() {
  console.log('====================================================');
  console.log('Task 10 — Product / Image Relationship Integration Test');
  console.log('====================================================\n');

  // 1. Fetch representative product
  console.log('1. Selecting existing representative product...');
  const products = await productRepository.getAllProducts();
  if (products.length === 0) {
    throw new Error('No products found in database or catalog.');
  }

  const product = products[0];
  console.log(`✓ Selected product: "${product.name}" (ID: ${product.id}, SKU: ${product.sku})\n`);

  const createdIds: string[] = [];

  try {
    // 2. Create primary image
    console.log('2. Inserting primary product_images record...');
    const primaryPublicId = `products/${product.sku ?? 'SAMPLE'}/primary`;
    const secureUrl = `https://res.cloudinary.com/demo/image/upload/${primaryPublicId}.jpg`;

    const primaryImage = await productImageRepository.create({
      productId: product.id,
      cloudinaryPublicId: primaryPublicId,
      cloudinaryUrl: secureUrl,
      sourceUrl: 'https://example.com/source-catalog/bulb.jpg',
      source: 'authorized-distributor',
      confidenceScore: '0.9800',
      status: 'UPLOADED',
      altText: `${product.name} Primary View`,
      sortOrder: 0,
      isPrimary: true,
    });
    createdIds.push(primaryImage.id);
    console.log(`✓ Primary image created: ID ${primaryImage.id} (Status: ${primaryImage.status})\n`);

    // 3. Create secondary gallery image
    console.log('3. Inserting secondary gallery image...');
    const galleryPublicId = `products/${product.sku ?? 'SAMPLE'}/gallery-1`;
    const galleryImage = await productImageRepository.create({
      productId: product.id,
      cloudinaryPublicId: galleryPublicId,
      cloudinaryUrl: `https://res.cloudinary.com/demo/image/upload/${galleryPublicId}.jpg`,
      sourceUrl: 'https://example.com/source-catalog/bulb-side.jpg',
      source: 'authorized-distributor',
      confidenceScore: '0.9200',
      status: 'UPLOADED',
      altText: `${product.name} Side View`,
      sortOrder: 1,
      isPrimary: false,
    });
    createdIds.push(galleryImage.id);
    console.log(`✓ Gallery image created: ID ${galleryImage.id}\n`);

    // 4. Retrieve by product ID
    console.log('4. Querying findByProductId()...');
    const productImages = await productImageRepository.findByProductId(product.id);
    console.log(`✓ Found ${productImages.length} images for product (ordered by sort_order)\n`);
    if (productImages.length < 2) {
      throw new Error(`Expected at least 2 images, found ${productImages.length}`);
    }

    // 5. Retrieve primary by product ID
    console.log('5. Querying findPrimaryByProductId()...');
    const foundPrimary = await productImageRepository.findPrimaryByProductId(product.id);
    if (!foundPrimary || foundPrimary.id !== primaryImage.id) {
      throw new Error('findPrimaryByProductId returned unexpected record');
    }
    console.log(`✓ Correct primary image retrieved: ${foundPrimary.cloudinaryPublicId}\n`);

    // 6. Retrieve by Cloudinary Public ID
    console.log('6. Querying findByCloudinaryPublicId()...');
    const foundByPublicId = await productImageRepository.findByCloudinaryPublicId(galleryPublicId);
    if (!foundByPublicId || foundByPublicId.id !== galleryImage.id) {
      throw new Error('findByCloudinaryPublicId returned unexpected record');
    }
    console.log(`✓ Correct gallery image retrieved: ${foundByPublicId.cloudinaryPublicId}\n`);

    // 7. Verify existence check
    console.log('7. Querying existsForProduct()...');
    const exists = await productImageRepository.existsForProduct(product.id);
    if (!exists) throw new Error('existsForProduct returned false for product with images');
    console.log(`✓ existsForProduct confirmed: ${exists}\n`);

    // 8. Test lifecycle status update
    console.log('8. Testing status update lifecycle...');
    const updated = await productImageRepository.updateStatus(galleryImage.id, 'REVIEW_REQUIRED');
    if (updated.status !== 'REVIEW_REQUIRED') throw new Error('Status update failed');
    console.log(`✓ Status updated to: ${updated.status}\n`);

    // 9. Verify foreign key protection
    console.log('9. Verifying foreign key constraint against non-existent product...');
    let foreignKeyRejected = false;
    try {
      await productImageRepository.create({
        productId: '00000000-0000-0000-0000-000000000000',
        cloudinaryPublicId: 'products/UNKNOWN/primary',
        cloudinaryUrl: 'https://example.com/test.jpg',
        sourceUrl: 'https://example.com/test.jpg',
        confidenceScore: '0.5000',
        status: 'PENDING',
        sortOrder: 0,
        isPrimary: true,
      });
    } catch (err) {
      if (err instanceof ProductNotFoundError) {
        foreignKeyRejected = true;
        console.log('✓ Foreign key violation caught correctly (ProductNotFoundError)\n');
      } else {
        throw err;
      }
    }
    if (!foreignKeyRejected) {
      throw new Error('Foreign key violation was not caught!');
    }

    // 10. Verify duplicate primary protection
    console.log('10. Verifying duplicate primary image protection (is_primary_unique)...');
    let duplicateRejected = false;
    try {
      await productImageRepository.create({
        productId: product.id,
        cloudinaryPublicId: `products/${product.sku ?? 'SAMPLE'}/primary-duplicate`,
        cloudinaryUrl: 'https://example.com/dup.jpg',
        sourceUrl: 'https://example.com/dup.jpg',
        confidenceScore: '0.8000',
        status: 'PENDING',
        sortOrder: 0,
        isPrimary: true, // Should fail
      });
    } catch (err) {
      if (err instanceof DuplicatePrimaryImageError) {
        duplicateRejected = true;
        console.log('✓ Duplicate primary rejected correctly (DuplicatePrimaryImageError)\n');
      } else {
        throw err;
      }
    }
    if (!duplicateRejected) {
      throw new Error('Duplicate primary image was unexpectedly allowed!');
    }

  } finally {
    // 11. Cleanup test data
    console.log('11. Cleaning up test image records (preserving representative product)...');
    for (const id of createdIds) {
      const deleted = await productImageRepository.delete(id);
      console.log(`✓ Deleted test image ${id}: ${deleted}`);
    }
    console.log('✓ Representative product remains untouched.\n');
  }

  console.log('====================================================');
  console.log('Task 10 — All Relationship & Constraint Tests PASSED');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('\n❌ Task 10 verification test failed:');
  console.error(err);
  process.exit(1);
});
