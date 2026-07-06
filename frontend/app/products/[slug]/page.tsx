'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/mock-data';
import ProductGallery from '@/components/product/ProductGallery';
import ProductDetails from '@/components/product/ProductDetails';
import SpecificationsTable from '@/components/product/SpecificationsTable';
import RelatedProducts from '@/components/product/RelatedProducts';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  // Product not found state
  if (!product) {
    return (
      <div style={{ backgroundColor: colors.bgLight, minHeight: '60vh' }}>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{
            paddingTop: '80px',
            paddingBottom: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <svg width="56" height="56" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke={colors.border} strokeWidth="1.5" />
            <path
              d="M21 21l-4.35-4.35"
              stroke={colors.border}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M8 11h6M11 8v6"
              stroke={colors.primary}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
            Product Not Found
          </h1>
          <p style={{ fontSize: '14px', color: colors.textMuted, margin: 0, maxWidth: '360px' }}>
            We could not find the product you are looking for. It may have been removed or the link
            is incorrect.
          </p>
          <Link
            href="/products"
            style={{
              marginTop: '8px',
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '20px', paddingBottom: '56px' }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            fontSize: '12px',
            color: colors.textMuted,
            marginBottom: '20px',
          }}
        >
          <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/products" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            style={{ color: colors.textMuted, textDecoration: 'none', textTransform: 'capitalize' }}
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Main product section */}
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '40px' }}>
            {/* Gallery */}
            <ProductGallery productName={product.name} />

            {/* Details */}
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Specifications / Description / Reviews tabs */}
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <SpecificationsTable product={product} />
        </div>

        {/* Related products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  );
}
