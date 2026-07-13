'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
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
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

const shimmerStyle = {
  background: 'linear-gradient(90deg, #E5E7EB 25%, #F9FAFB 50%, #E5E7EB 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
};

const ProductDetailSkeleton = () => (
  <>
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ ...shimmerStyle, aspectRatio: '1/1', width: '100%' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{ ...shimmerStyle, width: '72px', height: '72px', flexShrink: 0 }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ ...shimmerStyle, height: '20px', width: '30%' }} />
          <div style={{ ...shimmerStyle, height: '36px', width: '90%' }} />
          <div style={{ ...shimmerStyle, height: '36px', width: '70%' }} />
          <div style={{ ...shimmerStyle, height: '20px', width: '40%' }} />
          <div style={{ ...shimmerStyle, height: '40px', width: '50%' }} />
          <div style={{ ...shimmerStyle, height: '60px', width: '100%' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...shimmerStyle, height: '44px', width: '120px' }} />
            <div style={{ ...shimmerStyle, height: '44px', flex: 1 }} />
            <div style={{ ...shimmerStyle, height: '44px', width: '44px' }} />
          </div>
          <div style={{ ...shimmerStyle, height: '44px', width: '100%' }} />
        </div>
      </div>
    </div>
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ ...shimmerStyle, height: '36px', width: '120px' }} />
        ))}
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <div style={{ ...shimmerStyle, height: '16px', width: '140px' }} />
          <div style={{ ...shimmerStyle, height: '16px', flex: 1 }} />
        </div>
      ))}
    </div>
  </>
);

const ProductErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      backgroundColor: colors.errorBg,
      borderRadius: '16px',
      border: `1px solid ${colors.errorBorder}`,
      marginBottom: '32px',
    }}
  >
    <svg width="56" height="56" fill="none" viewBox="0 0 24 24" style={{ marginBottom: '16px' }}>
      <circle cx="12" cy="12" r="10" stroke={colors.error} strokeWidth="1.5" />
      <path d="M12 8v4M12 16h.01" stroke={colors.error} strokeWidth="2" strokeLinecap="round" />
    </svg>
    <h2 style={{ fontSize: '20px', fontWeight: 800, color: colors.secondary, margin: '0 0 8px 0' }}>
      Failed to load product
    </h2>
    <p
      style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 20px 0', maxWidth: '360px' }}
    >
      {message}
    </p>
    <div style={{ display: 'flex', gap: '12px' }}>
      <button
        onClick={onRetry}
        style={{
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: colors.primary,
          color: colors.white,
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
      <Link
        href="/products"
        style={{
          padding: '10px 24px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.white,
          color: colors.secondary,
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Browse Products
      </Link>
    </div>
  </div>
);

const ProductNotFound = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '64px 24px',
      textAlign: 'center',
      backgroundColor: colors.bgLight,
      borderRadius: '16px',
      border: `1px dashed ${colors.border}`,
      marginBottom: '32px',
    }}
  >
    <svg width="56" height="56" fill="none" viewBox="0 0 24 24" style={{ marginBottom: '16px' }}>
      <circle cx="11" cy="11" r="8" stroke={colors.border} strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke={colors.border} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11h6M11 8v6" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <h1 style={{ fontSize: '22px', fontWeight: 900, color: colors.secondary, margin: '0 0 8px 0' }}>
      Product Not Found
    </h1>
    <p
      style={{ fontSize: '14px', color: colors.textMuted, margin: '0 0 20px 0', maxWidth: '360px' }}
    >
      We couldn&#39;t find any products.
    </p>
    <Link
      href="/products"
      style={{
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
);

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading, isError, error, refetch } = useProduct(slug);

  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '20px', paddingBottom: '56px' }}
      >
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
          {isLoading ? (
            <span
              style={{
                display: 'inline-block',
                height: '12px',
                width: '120px',
                borderRadius: '4px',
                backgroundColor: '#E5E7EB',
              }}
            />
          ) : product ? (
            <>
              <Link
                href={`/products?category=${product.category}`}
                style={{
                  color: colors.textMuted,
                  textDecoration: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {product.category.replace(/-/g, ' ')}
              </Link>
              <span>/</span>
              <span style={{ color: colors.secondary, fontWeight: 600 }}>{product.name}</span>
            </>
          ) : (
            <span style={{ color: colors.secondary, fontWeight: 600 }}>Product</span>
          )}
        </nav>

        {isLoading && <ProductDetailSkeleton />}

        {isError && !isLoading && (
          <ProductErrorState
            message={error?.message ?? 'Something went wrong. Please try again.'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && !product && <ProductNotFound />}

        {!isLoading && !isError && product && (
          <>
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
                <ProductGallery productName={product.name} />
                <ProductDetails product={product} />
              </div>
            </div>
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
            <RelatedProducts currentProductId={product.id} category={product.category} />
          </>
        )}
      </div>
    </div>
  );
}
