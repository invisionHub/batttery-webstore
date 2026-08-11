import Link from 'next/link';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

type ProductDetailErrorViewProps = {
  message: string;
};

export function ProductDetailErrorView({ message }: ProductDetailErrorViewProps) {
  return (
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
      <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 20px 0', maxWidth: '360px' }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
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
}
