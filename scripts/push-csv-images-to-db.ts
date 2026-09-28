import fs from 'node:fs';
import path from 'node:path';
import { db } from '../database/client';
import { productTable } from '../database/schema/product.schema';
import { productImageTable } from '../database/schema/product-image.schema';
import { eq } from 'drizzle-orm';
import { cloudinaryService } from '../lib/cloudinary/cloudinary.service';

interface CsvRow {
  sku: string;
  productName: string;
  candidateImage: string;
  sourceUrl: string;
  confidenceScore: number;
  status: string;
  reason?: string;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split('\n');
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV quoting
    const tokens: string[] = [];
    let inQuotes = false;
    let currentToken = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' && line[c + 1] === '"') {
        currentToken += '"';
        c++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        tokens.push(currentToken);
        currentToken = '';
      } else {
        currentToken += char;
      }
    }
    tokens.push(currentToken);

    if (tokens.length >= 6) {
      rows.push({
        sku: tokens[0].trim(),
        productName: tokens[1].trim(),
        candidateImage: tokens[2].trim(),
        sourceUrl: tokens[3].trim(),
        confidenceScore: parseFloat(tokens[4]) || 0,
        status: tokens[5].trim(),
        reason: tokens[6]?.trim(),
      });
    }
  }

  return rows;
}

async function importCsvToDatabase() {
  const csvPath = path.resolve(process.cwd(), 'image-review.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('image-review.csv not found!');
    process.exit(1);
  }

  console.log('====================================================');
  console.log('IMPORTING APPROVED CSV IMAGES INTO DATABASE');
  console.log('====================================================\n');

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(content);
  console.log(`Parsed ${rows.length} rows from CSV.`);

  const validEntries = rows.filter((r) => r.candidateImage && r.candidateImage.startsWith('http'));
  console.log(`Found ${validEntries.length} valid images to import.\n`);

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < validEntries.length; i++) {
    const entry = validEntries[i];
    const itemNum = i + 1;

    try {
      // 1. Locate product by SKU
      const products = await db
        .select()
        .from(productTable)
        .where(eq(productTable.sku, entry.sku))
        .limit(1);

      if (!products || products.length === 0) {
        console.warn(`[${itemNum}/${validEntries.length}] Product not found for SKU: ${entry.sku}`);
        failedCount++;
        continue;
      }

      const product = products[0];

      // 2. Upload to Cloudinary if configured, or use candidateImage directly
      let imageUrl = entry.candidateImage;
      let cloudinaryPublicId = `csv-import-${entry.sku}-${Date.now()}`;

      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const uploadRes = await cloudinaryService.upload({
            file: entry.candidateImage,
            folder: `products/${entry.sku}`,
            publicId: 'primary',
            overwrite: true,
          });
          imageUrl = uploadRes.secureUrl;
          cloudinaryPublicId = uploadRes.publicId;
        } catch (uploadErr) {
          console.warn(`Cloudinary upload failed for ${entry.sku}, falling back to original URL:`, uploadErr instanceof Error ? uploadErr.message : uploadErr);
        }
      }

      // 3. Upsert / update productTable images field
      const currentImages = [imageUrl];
      await db
        .update(productTable)
        .set({
          images: JSON.stringify(currentImages),
        })
        .where(eq(productTable.id, product.id));

      // 4. Save into products_image_table as primary image
      // Delete any previous primary image for this product
      try {
        await db
          .delete(productImageTable)
          .where(eq(productImageTable.productId, product.id));

        await db.insert(productImageTable).values({
          productId: product.id,
          cloudinaryPublicId,
          cloudinaryUrl: imageUrl,
          sourceUrl: entry.sourceUrl || imageUrl,
          source: 'Review CSV Auto-Pass',
          confidenceScore: (entry.confidenceScore / 100).toFixed(4),
          status: 'UPLOADED',
          isPrimary: true,
          sortOrder: 0,
          altText: product.name || entry.productName,
        });
      } catch (insertErr) {
        console.warn(`Failed inserting to products_image_table for ${entry.sku}:`, insertErr instanceof Error ? insertErr.message : insertErr);
      }

      successCount++;
      console.log(`[${itemNum}/${validEntries.length}] ✓ PASSED & SAVED: ${entry.sku} -> ${product.name}`);
    } catch (err) {
      failedCount++;
      console.error(`[${itemNum}/${validEntries.length}] ✗ Error importing ${entry.sku}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('\n====================================================');
  console.log('IMPORT COMPLETE');
  console.log('====================================================');
  console.log(`Successfully saved to database: ${successCount}`);
  console.log(`Skipped / Not applicable:      ${skippedCount}`);
  console.log(`Failed:                         ${failedCount}`);
  console.log('====================================================\n');
}

importCsvToDatabase().catch((err) => {
  console.error('Fatal import error:', err);
  process.exit(1);
});
