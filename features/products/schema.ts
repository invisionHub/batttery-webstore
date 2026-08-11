import { z } from 'zod';

export const ProductImportSchema = z.object({
  sku: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string(),
  price: z.number().min(0),
  minPrice: z.number().min(0),
  maxPrice: z.number().min(0),
  pricePoints: z.number().min(1),
  shortDescription: z.string(),
  stockStatus: z.enum(['In Stock', 'Out of Stock']),
  images: z.array(z.string()),
});
