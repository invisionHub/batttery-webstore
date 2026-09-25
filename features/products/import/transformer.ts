import { ExcelProduct } from '../types/excel-product.type';
import { Product } from '../types/product.type';

function toString(value: unknown): string {
  return String(value ?? '').trim();
}

function toNumber(value: unknown): number {
  const parsed = Number(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function transformRow(row: ExcelProduct): Product {
  const sku = toString(row.SKU);
  const slug = normalizeSlug(toString(row['Slug (URL)']));

  return {
    id: sku || slug,
    sku,
    slug,
    name: toString(row['Product Name']),
    brand: toString(row.Brand),
    category: toString(row.Category),
    subcategory: toString(row.Subcategory),
    price: toNumber(row['Avg Price (₦)']),
    minPrice: toNumber(row['Min Price (₦)']),
    maxPrice: toNumber(row['Max Price (₦)']),
    pricePoints: toNumber(row['Price Points']) || 1,
    shortDescription: toString(row['Short Description']),
    stockStatus: row['Stock Status'] === 'In Stock' ? 'In Stock' : 'Out of Stock',
    images: [],
  };
}
