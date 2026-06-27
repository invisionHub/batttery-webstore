import { Product } from './product.type';

export interface InvalidProduct {
  row: number;
  product: unknown;
  errors: string[];
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
}

export interface ImportResult {
  validProducts: Product[];
  invalidProducts: InvalidProduct[];
  summary: ImportSummary;
}

export interface InvalidProduct {
  row: number;
  product: unknown;
  errors: string[];
}
