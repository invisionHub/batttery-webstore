import { fetchProducts } from "@/features/products/actions/get-products";
import { ProductsView } from "@/features/products/views/product-views";

export default async function productPage(){
  const { error, product } = await fetchProducts()
  



  return (
      <ProductsView 
        initialError={ error as string}
        initialProducts={product}
      />
  )
}