export interface Product {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  pricePoints: number;
  shortDescription: string;
  stockStatus: 'In Stock' | 'Out of Stock';
  images: string[];
}
