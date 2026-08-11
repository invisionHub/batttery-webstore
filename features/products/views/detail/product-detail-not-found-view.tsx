import Link from 'next/link';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export function ProductDetailNotFoundView() {
  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '20px', paddingBottom: '56px' }}
      >
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
            We couldn&apos;t find the product you requested.
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
      </div>
    </div>
  );
}
