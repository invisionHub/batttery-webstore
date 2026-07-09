import { NextResponse } from 'next/server';
import { fetchProductsFromDatabase } from '@/features/products/actions/get-products';

export async function GET() {
  try {
    const products = await fetchProductsFromDatabase();

    return NextResponse.json({ ok: true, data: products });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error while fetching products';
    // Log server-side for diagnostics
     
    console.error('GET /api/products error:', err);

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
