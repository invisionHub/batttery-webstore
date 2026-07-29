import { CatalogProduct } from "../types/product.type";

export function searchProducts (
    products: CatalogProduct[],
    search: string
) {
    if (!search.trim()) return products;

    const query = search.toLowerCase();

    return products.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.shortDescription?.toLowerCase().includes(query)
    );
}