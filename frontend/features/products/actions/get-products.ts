'use server';

import { getAllProducts } from '@/lib/repository';
import toCatalogProduct from '../mappers/product-mapper';


// export type ProductFetchResult = {
//   products: CatalogProduct[];
//   error: string | null;
// };





export async function fetchProducts () {


  try
  {
    const documents = await getAllProducts();
    return {
      product: documents.map(toCatalogProduct),
      error: null
    };
  } catch (error)
  {
    return {
      product: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

}

// export async function fetchProductBySlug (slug: string): Promise<ProductBySlugResult> {
//   try
//   {
//     const documents = await getProductBySlug(slug);

//     if (!documents)
//     {
//       return {
//         product: null,
//         error: 'Product not found.',
//       };
//     }

//     const product = toCatalogProduct(documents);

//     console.info(`[products] Fetched product with slug: ${ slug }`);

//     return {
//       product,
//       error: null,
//     };
//   } catch (error)
//   {
//     const message = error instanceof Error ? error.message : 'Failed to fetch product.';

//     console.error('[products] Failed to load product:', message);

//     return {
//       product: null,
//       error: message,
//     };
//   }
// }