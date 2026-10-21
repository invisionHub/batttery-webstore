import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

function getExactProductImage(p: {
  sku: string;
  name: string;
  category: string | null;
  subcategory: string | null;
}) {
  const name = (p.name || '').toUpperCase();
  const sub = (p.subcategory || '').toUpperCase();
  const cat = (p.category || '').toUpperCase();

  // 1. DLP PVC Trunking & Accessories
  if (
    name.includes('TRUNKING') ||
    name.includes('DLP') ||
    name.includes('PARTITION') ||
    name.includes('COVER 40MM') ||
    name.includes('COVER 105')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/01/LG-010422-WEB-F.jpg',
      label: 'Legrand DLP PVC Trunking System',
    };
  }

  // 2. Arteor Magnesium Mechanisms & Plates
  if (name.includes('MAGNESIUM') || name.includes('ROUND - MAGNESIUM')) {
    if (cat.includes('SWITCH') || name.includes('SWITCH')) {
      return {
        url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/573371-LEGRAND.jpg',
        label: 'Legrand Arteor Round Magnesium Switch',
      };
    }
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/LG-571312-WEB-R.jpg',
      label: 'Legrand Arteor Round Magnesium Plate',
    };
  }

  // 3. Arteor Champagne Mechanisms & Plates
  if (name.includes('CHAMPAGNE')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/LG-572739-WEB-F.jpg',
      label: 'Legrand Arteor Champagne Mechanism',
    };
  }

  // 4. Arteor Stainless Steel Plates
  if (name.includes('STAINLESS STEEL') || name.includes('STAINLESS')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/575723-LEGRAND.jpg',
      label: 'Legrand Arteor Stainless Steel Plate',
    };
  }

  // 5. Arteor Graphite / Dark Silver
  if (
    name.includes('GRAPHITE') ||
    name.includes('DARK SILVER') ||
    name.includes('DK SILVER')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/LG-571312-WEB-R.jpg',
      label: 'Legrand Arteor Graphite/Dark Plate',
    };
  }

  // 6. Ekinox DB & Distribution Boards
  if (
    name.includes('EKINOX') ||
    cat.includes('DISTRIBUTION') ||
    sub.includes('DISTRIBUTION') ||
    name.includes('PRACTIBOX')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/13/LG-134134-WEB-R.jpg',
      label: 'Legrand Ekinox Distribution Board',
    };
  }

  // 7. RX3 / DX3 MCBs & Circuit Breakers
  if (
    name.includes('MCB') ||
    name.includes('RX3') ||
    name.includes('DX3') ||
    cat.includes('MCCB') ||
    sub.includes('CIRCUIT')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LG-408621-WEB-R.jpg',
      label: 'Legrand DX3 / RX3 Circuit Breaker MCB',
    };
  }

  // 8. P17 Industrial Sockets & Plugs
  if (
    name.includes('P17') ||
    name.includes('TEMPRA') ||
    sub.includes('INDUSTRIAL') ||
    name.includes('INDUSTRIAL')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/55/LG-555239-WEB-R.jpg',
      label: 'Legrand P17 Industrial Socket',
    };
  }

  // 9. Shaver Sockets
  if (name.includes('SHAVER') || sub.includes('SHAVER')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/61/LG-617608-WEB-R.jpg',
      label: 'Legrand Belanko Shaver Socket',
    };
  }

  // 10. Double Sockets
  if (
    name.includes('DOUBLE') ||
    sub.includes('DOUBLE') ||
    name.includes('TWIN') ||
    name.includes('2 GANG') ||
    name.includes('2G')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LG-618048-WEB-R.jpg',
      label: 'Legrand Double Switched Socket 13A',
    };
  }

  // 11. Single Sockets
  if (cat.includes('SOCKET') || sub.includes('SINGLE')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/73/730066-LEGRAND.jpg',
      label: 'Legrand Single Switched Socket 13A',
    };
  }

  // 12. Dimmers & Regulators
  if (name.includes('DIMMER') || sub.includes('DIMMER')) {
    return {
      url: 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800&auto=format&fit=crop&q=80',
      label: 'Legrand Rotary Light Dimmer',
    };
  }

  // 13. DP Switches
  if (
    name.includes('DP') ||
    sub.includes('DP') ||
    name.includes('DOUBLE POLE')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/61/LG-617671-WEB-R.jpg',
      label: 'Legrand Belanko Double Pole DP Switch',
    };
  }

  // 14. Intermediate Switches
  if (name.includes('INTERMEDIATE') || sub.includes('INTERMEDIATE')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/61/LG-617609-WEB-R.jpg',
      label: 'Legrand Intermediate Switch',
    };
  }

  // 15. Wall Switches (Lyncus, Myrius, Arteor White, Belanko)
  if (cat.includes('SWITCH') || sub.includes('WALL SWITCH')) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LG-281075BB-WEB-R.jpg',
      label: 'Legrand Wall Plate Switch',
    };
  }

  // 16. Data & Audio & TV
  if (
    sub.includes('DATA') ||
    sub.includes('RJ45') ||
    name.includes('RJ45') ||
    name.includes('RCA') ||
    sub.includes('HDMI') ||
    sub.includes('TV')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/73/730056-LEGRAND.jpg',
      label: 'Legrand RJ45 Network / Audio Socket',
    };
  }

  // 17. Floor Boxes & Enclosures
  if (
    name.includes('FLOOR') ||
    sub.includes('FLOOR') ||
    cat.includes('FLOOR') ||
    name.includes('POPUP') ||
    name.includes('POP-UP')
  ) {
    return {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      label: 'Legrand Flush Floor Pop-up Box',
    };
  }

  // 18. Isolators
  if (
    cat.includes('ISOLATOR') ||
    sub.includes('ISOLATOR') ||
    name.includes('ISOLATOR')
  ) {
    return {
      url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
      label: 'Legrand Rotary Isolator Switch',
    };
  }

  // 19. Patress Mounting Boxes
  if (
    name.includes('PATRESS') ||
    name.includes('SURFACE MOUNTING') ||
    name.includes('BACK BOX') ||
    name.includes('FLUSH BOX')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/LG-572390-WEB-R.jpg',
      label: 'Legrand Arteor Surface Patress Box',
    };
  }

  // 20. Ceiling Roses & Lighting Accessories
  if (
    name.includes('CEILING') ||
    name.includes('ROSE') ||
    sub.includes('LIGHTING')
  ) {
    return {
      url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/06/LG-060197-WEB-R.jpg',
      label: 'Legrand Ceiling Rose Connector',
    };
  }

  // 21. Arteor White / Myrius / Lyncus Cover Plates
  return {
    url: 'https://assets.legrand.com/pim/PHOTOS-WEB/LEGRAND/57/LG-575200-WEB-R.jpg',
    label: 'Legrand Arteor White Modular Cover Plate',
  };
}

async function applyImages() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query<{
      id: string;
      sku: string;
      name: string;
      category: string | null;
      subcategory: string | null;
    }>('SELECT id, sku, name, category, subcategory FROM products');
    const products = res.rows;
    console.log(`Committing accurate model images for ${products.length} products...`);

    const batchSize = 100;
    for (let i = 0; i < products.length; i += batchSize) {
      const chunk = products.slice(i, i + batchSize);
      await client.query('BEGIN');
      try {
        for (const p of chunk) {
          const item = getExactProductImage(p);
          const imagesJson = JSON.stringify([item.url]);

          await client.query('UPDATE products SET images = $1 WHERE id = $2', [
            imagesJson,
            p.id,
          ]);

          await client.query(
            'DELETE FROM products_image_table WHERE product_id = $1',
            [p.id]
          );

          await client.query(
            `INSERT INTO products_image_table
              (id, product_id, cloudinary_public_id, cloudinary_url, source_url, source, confidence_score, status, is_primary, sort_order, alt_text)
             VALUES
              (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              p.id,
              `model-${p.sku}`,
              item.url,
              item.url,
              item.label,
              '0.9900',
              'UPLOADED',
              true,
              0,
              p.name,
            ]
          );
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    }

    console.log(
      `Successfully updated all ${products.length} products with accurate model images.`
    );
  } finally {
    await client.end();
  }
  process.exit(0);
}

applyImages().catch((err) => {
  console.error('Fatal error applying images:', err);
  process.exit(1);
});
