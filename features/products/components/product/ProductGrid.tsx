"use client"
import React from 'react'
import { CatalogProduct } from '../../types/product.type'
import { ProductCard } from '@/components/product'
import { GridListArrangement, ProductNotFound } from './ProductToolBar'
import Pagination from '@/components/ui/Pagination'


interface IProductGrid {
    productLength: number
    paginatedProducts: CatalogProduct[]
    view: "grid" | "list"
    setView: (v: "grid" | "list") => void
    totalPages: number
    page: number
    setPage:(page:number)=> void
}
export const ProductGrid = ({ ...productgridProps }: IProductGrid) => {
    const { paginatedProducts, productLength, setView, view, totalPages, page, setPage } = productgridProps
    
    return (
        <>
            <GridListArrangement setView={setView} view={view} />
            {  productLength > 0 && (
            <div
                style={
                    view === 'grid'
                    ? {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '16px',
                    }
                    : { display: 'flex', flexDirection: 'column', gap: '12px' }
                 }
             >
                {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} view={view} />
            ))}
         </div>         
         )}   
            { totalPages > 1 &&  (
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        )}
    </>
  )
}

