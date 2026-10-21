import { Product } from '@/database/types';
import { normalizeValue } from '../utils/normalize-values';

export function getProductSeries(name: string): string | null {
  const upper = name.toUpperCase();
  if (upper.includes('ARTEOR')) return 'Arteor';
  if (upper.includes('MYRIUS')) return 'Myrius';
  if (upper.includes('BELANKO')) return 'Belanko';
  if (upper.includes('EKINOX')) return 'Ekinox';
  if (upper.includes('BRITZY')) return 'Britzy';
  if (upper.includes('DLP') || upper.includes('TRUNKING')) return 'DLP Trunking';
  if (upper.includes('DRX') || upper.includes('DPX')) return 'Industrial MCCB';
  if (upper.includes('PLEXO') || upper.includes('MALLIA')) return 'Plexo / Mallia';
  return null;
}

export function generateFilterOptions(
  products: Product[],
  key: 'brand' | 'category' | 'subcategory' | 'series'
) {
  const counts = new Map<string, { name: string; count: number }>();

  products.forEach((product) => {
    let value: string | null = null;

    if (key === 'series') {
      value = getProductSeries(product.name || '');
    } else {
      value = product[key]?.trim() || null;
    }

    if (!value) return;

    const normalized = normalizeValue(value);
    const existing = counts.get(normalized);

    counts.set(normalized, {
      name: value,
      count: (existing?.count ?? 0) + 1,
    });
  });

  return [...counts.entries()]
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([id, option], index) => ({
      id: `${id}-${index}`,
      name: option.name,
      value: option.name,
      count: option.count,
    }));
}
